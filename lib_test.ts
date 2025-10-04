import { assertEquals } from "@std/assert";
import { createHandler } from "./lib.ts";
import type { Config } from "./lib.ts";

Deno.test("createHandler - works with inline config", () => {
  const config: Config = {
    destination: "example.com",
    redirectStatus: 307,
  };

  const handler = createHandler(config);
  const request = new Request("http://foo.com/test");
  const response = handler(request);

  assertEquals(response.status, 307);
  assertEquals(response.headers.get("Location"), "https://example.com/test");
});
