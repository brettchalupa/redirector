/**
 * A simple, configurable URL redirector for Deno Deploy and edge runtimes.
 *
 * @example
 * ```ts
 * import { runRedirector } from "@scope/redirector";
 *
 * // Run with default config.yaml
 * await runRedirector();
 * ```
 *
 * @example
 * ```ts
 * import { runRedirector } from "@scope/redirector";
 *
 * // Run with custom config path
 * await runRedirector({ configPath: "./my-config.yaml" });
 * ```
 *
 * @example
 * ```ts
 * import { runRedirector, type Config } from "@scope/redirector";
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
 * @example
 * ```ts
 * import { createHandler, loadConfig } from "@scope/redirector";
 *
 * // Use as a handler with your own server
 * const config = await loadConfig("./config.yaml");
 * const handler = createHandler(config);
 *
 * Deno.serve(handler);
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

export type { Config, RedirectRule, RunRedirectorOptions } from "./lib.ts";
