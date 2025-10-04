import { assertEquals } from "@std/assert";
import { createHandler, getRedirectInfo, loadConfig } from "./lib.ts";
import type { Config } from "./lib.ts";

Deno.test("loadConfig - loads valid configuration", async () => {
  const config = await loadConfig("./config.yaml");
  assertEquals(typeof config.destination, "string");
  assertEquals(config.destination.length > 0, true);
});

Deno.test("loadConfig - throws error when destination is missing", async () => {
  const invalidYaml = `redirects:
  - from: /test
    to: /test2`;

  const tempFile = await Deno.makeTempFile({ suffix: ".yaml" });
  await Deno.writeTextFile(tempFile, invalidYaml);

  try {
    let errorThrown = false;
    try {
      await loadConfig(tempFile);
    } catch (e) {
      errorThrown = true;
      assertEquals(
        (e as Error).message,
        "Config must include a 'destination' field",
      );
    }
    assertEquals(errorThrown, true);
  } finally {
    await Deno.remove(tempFile);
  }
});

Deno.test("getRedirectInfo - default redirect replaces domain", () => {
  const config: Config = {
    destination: "bar.com",
  };
  const url = new URL("http://foo.com/example");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://bar.com/example");
  assertEquals(result.status, 307);
});

Deno.test("getRedirectInfo - preserves query parameters", () => {
  const config: Config = {
    destination: "bar.com",
  };
  const url = new URL("http://foo.com/example?key=value&foo=bar");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://bar.com/example?key=value&foo=bar");
});

Deno.test("getRedirectInfo - custom redirect with relative path", () => {
  const config: Config = {
    destination: "bar.com",
    redirects: [
      { from: "/biz", to: "/baz" },
    ],
  };
  const url = new URL("http://foo.com/biz");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://bar.com/baz");
});

Deno.test("getRedirectInfo - custom redirect with query params", () => {
  const config: Config = {
    destination: "bar.com",
    redirects: [
      { from: "/biz", to: "/baz" },
    ],
  };
  const url = new URL("http://foo.com/biz?test=1");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://bar.com/baz?test=1");
});

Deno.test("getRedirectInfo - custom redirect with full URL", () => {
  const config: Config = {
    destination: "bar.com",
    redirects: [
      { from: "/blog", to: "https://blog.example.com" },
    ],
  };
  const url = new URL("http://foo.com/blog");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://blog.example.com");
});

Deno.test("getRedirectInfo - non-matching path uses default", () => {
  const config: Config = {
    destination: "bar.com",
    redirects: [
      { from: "/biz", to: "/baz" },
    ],
  };
  const url = new URL("http://foo.com/other");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://bar.com/other");
});

Deno.test("getRedirectInfo - custom redirect with custom status", () => {
  const config: Config = {
    destination: "bar.com",
    redirects: [
      { from: "/permanent", to: "/moved", status: 301 },
    ],
  };
  const url = new URL("http://foo.com/permanent");
  const result = getRedirectInfo(url, config);
  assertEquals(result.url, "https://bar.com/moved");
  assertEquals(result.status, 301);
});

Deno.test("getRedirectInfo - custom redirect uses global status when not overridden", () => {
  const config: Config = {
    destination: "bar.com",
    redirectStatus: 301,
    redirects: [
      { from: "/test", to: "/testing" },
    ],
  };
  const url = new URL("http://foo.com/test");
  const result = getRedirectInfo(url, config);
  assertEquals(result.status, 301);
});

Deno.test("createHandler - returns 307 redirect response", () => {
  const config: Config = {
    destination: "bar.com",
  };
  const handler = createHandler(config);
  const request = new Request("http://foo.com/example");
  const response = handler(request);

  assertEquals(response.status, 307);
  assertEquals(response.headers.get("Location"), "https://bar.com/example");
});

Deno.test("createHandler - handles custom redirects", () => {
  const config: Config = {
    destination: "bar.com",
    redirects: [
      { from: "/biz", to: "/baz" },
    ],
  };
  const handler = createHandler(config);
  const request = new Request("http://foo.com/biz");
  const response = handler(request);

  assertEquals(response.status, 307);
  assertEquals(response.headers.get("Location"), "https://bar.com/baz");
});

Deno.test("createHandler - uses configured redirect status", () => {
  const config: Config = {
    destination: "bar.com",
    redirectStatus: 301,
  };
  const handler = createHandler(config);
  const request = new Request("http://foo.com/example");
  const response = handler(request);

  assertEquals(response.status, 301);
  assertEquals(response.headers.get("Location"), "https://bar.com/example");
});

Deno.test("createHandler - defaults to 307 when redirectStatus not specified", () => {
  const config: Config = {
    destination: "bar.com",
  };
  const handler = createHandler(config);
  const request = new Request("http://foo.com/example");
  const response = handler(request);

  assertEquals(response.status, 307);
});
