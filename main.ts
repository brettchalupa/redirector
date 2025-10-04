#!/usr/bin/env -S deno run --allow-read --allow-net
import { runRedirector } from "./mod.ts";

if (import.meta.main) {
  await runRedirector();
}
