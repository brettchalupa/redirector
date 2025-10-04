import { parse } from "@std/yaml";

interface RedirectRule {
  from: string;
  to: string;
  status?: 301 | 307;
}

interface Config {
  destination: string;
  redirectStatus?: 301 | 307;
  redirects?: RedirectRule[];
}

async function loadConfig(path: string): Promise<Config> {
  const content = await Deno.readTextFile(path);
  const config = parse(content) as Config;

  if (!config.destination) {
    throw new Error("Config must include a 'destination' field");
  }

  return config;
}

function getRedirectInfo(
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

export function handler(req: Request, config: Config): Response {
  const url = new URL(req.url);
  const redirect = getRedirectInfo(url, config);

  return new Response(null, {
    status: redirect.status,
    headers: {
      "Location": redirect.url,
    },
  });
}

if (import.meta.main) {
  const config = await loadConfig("./config.yaml");

  Deno.serve((req) => handler(req, config));
}

export { getRedirectInfo, loadConfig };
export type { Config, RedirectRule };
