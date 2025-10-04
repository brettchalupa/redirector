import { parse } from "@std/yaml";

/**
 * A custom redirect rule that maps a source path to a destination path.
 */
export interface RedirectRule {
  /** The source path to match (e.g., "/old-page") */
  from: string;
  /** The destination path or full URL (e.g., "/new-page" or "https://example.com") */
  to: string;
  /** Optional HTTP status code for this redirect (301 for permanent, 307 for temporary) */
  status?: 301 | 307;
}

/**
 * Configuration for the redirector.
 */
export interface Config {
  /** The destination domain to redirect to (e.g., "example.com") */
  destination: string;
  /** Default HTTP status code for redirects (301 for permanent, 307 for temporary). Defaults to 307. */
  redirectStatus?: 301 | 307;
  /** Optional array of custom redirect rules that override default domain replacement */
  redirects?: RedirectRule[];
}

/**
 * Loads and parses a YAML configuration file.
 *
 * @param path - Path to the YAML configuration file
 * @returns Parsed configuration object
 * @throws Error if the configuration is missing required fields
 *
 * @example
 * ```ts
 * const config = await loadConfig("./config.yaml");
 * console.log(config.destination); // "example.com"
 * ```
 */
export async function loadConfig(path: string): Promise<Config> {
  const content = await Deno.readTextFile(path);
  const config = parse(content) as Config;

  if (!config.destination) {
    throw new Error("Config must include a 'destination' field");
  }

  return config;
}

/**
 * Determines the redirect URL and status code for a given request URL.
 *
 * @param url - The incoming request URL
 * @param config - The redirector configuration
 * @returns Object containing the redirect URL and HTTP status code
 *
 * @example
 * ```ts
 * const info = getRedirectInfo(
 *   new URL("http://foo.com/test"),
 *   { destination: "bar.com" }
 * );
 * console.log(info.url); // "https://bar.com/test"
 * console.log(info.status); // 307
 * ```
 */
export function getRedirectInfo(
  url: URL,
  config: Config,
): { url: string; status: number } {
  const pathname = url.pathname;
  const search = url.search;
  const defaultStatus = config.redirectStatus ?? 307;

  // Check custom redirects first
  if (config.redirects) {
    for (const rule of config.redirects) {
      if (pathname === rule.from) {
        const status = rule.status ?? defaultStatus;
        // If 'to' is a full URL, use it as-is
        if (rule.to.startsWith("http://") || rule.to.startsWith("https://")) {
          return { url: rule.to, status };
        }
        // Otherwise, use destination domain with the custom path
        return {
          url: `https://${config.destination}${rule.to}${search}`,
          status,
        };
      }
    }
  }

  // Default: replace domain, keep path and query
  return {
    url: `https://${config.destination}${pathname}${search}`,
    status: defaultStatus,
  };
}

/**
 * Creates an HTTP request handler function that performs redirects based on the configuration.
 *
 * @param config - The redirector configuration
 * @returns A request handler function compatible with Deno.serve()
 *
 * @example
 * ```ts
 * const handler = createHandler({
 *   destination: "example.com",
 *   redirectStatus: 307
 * });
 * Deno.serve(handler);
 * ```
 */
export function createHandler(config: Config): (req: Request) => Response {
  return (req: Request): Response => {
    const url = new URL(req.url);
    const redirect = getRedirectInfo(url, config);

    return new Response(null, {
      status: redirect.status,
      headers: {
        "Location": redirect.url,
      },
    });
  };
}

/**
 * Options for running the redirector server.
 */
export interface RunRedirectorOptions {
  /** Path to the YAML configuration file. Defaults to "./config.yaml" */
  configPath?: string;
  /** Inline configuration object (takes precedence over configPath) */
  config?: Config;
  /** Port to listen on */
  port?: number;
  /** Hostname to bind to */
  hostname?: string;
  /** AbortSignal to stop the server */
  signal?: AbortSignal;
  /** Callback invoked when the server starts listening */
  onListen?: (params: { hostname: string; port: number }) => void;
}

/**
 * Runs the redirector HTTP server.
 *
 * @param options - Configuration options for the server
 * @returns Promise that resolves to the Deno HTTP server instance
 *
 * @example
 * ```ts
 * // Run with default config.yaml
 * await runRedirector();
 * ```
 *
 * @example
 * ```ts
 * // Run with inline config
 * await runRedirector({
 *   config: {
 *     destination: "example.com",
 *     redirects: [{ from: "/old", to: "/new", status: 301 }]
 *   },
 *   port: 8000
 * });
 * ```
 */
export async function runRedirector(
  options: RunRedirectorOptions = {},
): Promise<Deno.HttpServer> {
  const {
    configPath = "./config.yaml",
    config: providedConfig,
    port,
    hostname,
    signal,
    onListen,
  } = options;

  const config = providedConfig ?? await loadConfig(configPath);
  const handler = createHandler(config);

  return Deno.serve({
    port,
    hostname,
    signal,
    onListen,
  }, handler);
}
