/**
 * A simple, configurable URL redirector for Deno Deploy and edge runtimes.
 *
 * ## Features
 *
 * - Simple domain-based redirects (e.g., `foo.com/example` → `bar.com/example`)
 * - Custom path redirects with override support
 * - Permanent (301) or temporary (307) redirects
 * - YAML-based or inline configuration
 * - Structured logging with configurable levels
 * - Configurable port (via option or `PORT` env var, default: 8008)
 * - Configurable log level (via option or `LOG_LEVEL` env var, default: INFO)
 *
 * ## Basic Usage
 *
 * @example
 * ```ts
 * import { runRedirector } from "jsr:@brettchalupa/redirector";
 *
 * // Run with default config.yaml on port 8008
 * await runRedirector();
 * ```
 *
 * ## Custom Configuration Path
 *
 * @example
 * ```ts
 * import { runRedirector } from "jsr:@brettchalupa/redirector";
 *
 * // Run with custom config path
 * await runRedirector({ configPath: "./my-config.yaml" });
 * ```
 *
 * ## Inline Configuration
 *
 * @example
 * ```ts
 * import { type Config, runRedirector } from "jsr:@brettchalupa/redirector";
 *
 * // Run with inline config
 * const config: Config = {
 *   destination: "example.com",
 *   redirectStatus: 307,
 *   redirects: [
 *     { from: "/old", to: "/new", status: 301 }
 *   ]
 * };
 *
 * await runRedirector({ config });
 * ```
 *
 * ## Custom Port Configuration
 *
 * @example
 * ```ts
 * import { runRedirector } from "jsr:@brettchalupa/redirector";
 *
 * // Run on custom port (option takes precedence over PORT env var)
 * await runRedirector({ port: 3000 });
 *
 * // Or use PORT environment variable:
 * // $ PORT=3000 deno run main.ts
 * await runRedirector(); // Will listen on port 3000
 * ```
 *
 * ## Logging Configuration
 *
 * @example
 * ```ts
 * import { runRedirector } from "jsr:@brettchalupa/redirector";
 *
 * // Run with DEBUG logging (shows all requests)
 * await runRedirector({ logLevel: "DEBUG" });
 *
 * // Or use LOG_LEVEL environment variable:
 * // $ LOG_LEVEL=DEBUG deno run main.ts
 * await runRedirector();
 *
 * // Available levels: "DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"
 * // Default: "INFO"
 * ```
 *
 * ## Using as a Handler
 *
 * @example
 * ```ts
 * import { createHandler, loadConfig } from "jsr:@brettchalupa/redirector";
 *
 * // Use as a handler with your own server
 * const config = await loadConfig("./config.yaml");
 * const handler = createHandler(config);
 *
 * Deno.serve(handler);
 * ```
 *
 * ## Complete Example with All Options
 *
 * @example
 * ```ts
 * import { type Config, runRedirector } from "jsr:@brettchalupa/redirector";
 *
 * const config: Config = {
 *   destination: "example.com",
 *   redirectStatus: 307, // or 301 for permanent
 *   redirects: [
 *     { from: "/old", to: "/new", status: 301 },
 *     { from: "/blog", to: "https://blog.example.com" }
 *   ]
 * };
 *
 * await runRedirector({
 *   config,
 *   port: 8008,
 *   logLevel: "INFO",
 *   onListen: ({ hostname, port }) => {
 *     console.log(`Custom message: Running on ${hostname}:${port}`);
 *   }
 * });
 * ```
 *
 * @module
 */

export {
  createHandler,
  getRedirectInfo,
  loadConfig,
  runRedirector,
} from "./lib.ts";

export type {
  Config,
  LogLevel,
  RedirectRule,
  RunRedirectorOptions,
} from "./lib.ts";
