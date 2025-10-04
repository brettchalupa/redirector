# Redirector

A simple, configurable URL redirector library for Deno Deploy and edge runtimes.

## Features

- 📦 Library-first design - use as a package or standalone server
- 🚀 Simple domain-based redirects (e.g., `foo.com/example` → `bar.com/example`)
- 🎯 Custom path redirects with override support
- 🔒 Permanent (301) or temporary (307) redirects
- ⚙️ YAML-based or inline configuration
- 🧪 Comprehensive test suite
- 🌐 Deploy to Deno Deploy easily

## Installation

Published on [JSR](https://jsr.io/@brettchalupa/redirector):
`@brettchalupa/redirector`

### Use as a Library

```ts
import { runRedirector } from "jsr:@brettchalupa/redirector";

// Run with default config.yaml
await runRedirector();
```

```ts
import { type Config, runRedirector } from "jsr:@brettchalupa/redirector";

// Run with inline config
const config: Config = {
  destination: "example.com",
  redirectStatus: 307,
  redirects: [{ from: "/old", to: "/new", status: 301 }],
};

await runRedirector({ config });
```

```ts
import { createHandler, loadConfig } from "jsr:@brettchalupa/redirector";

// Use as a handler with your own server
const config = await loadConfig("./config.yaml");
const handler = createHandler(config);

Deno.serve(handler);
```

### Use as a Template

1. Fork or use this repository as a template
2. Connect your repository to [Deno Deploy](https://deno.com/deploy)
3. Configure `config.yaml` with your redirects
4. Push to main - automatic deployment handled by Deno Deploy

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd redirector

# Configure your redirects in config.yaml
# Run the server (defaults to port 8008)
deno task dev

# Or specify a custom port
PORT=3000 deno task dev
```

## Configuration

### Port Configuration

The server listens on port 8008 by default. You can customize this:

1. Set the `PORT` environment variable: `PORT=3000 deno task dev`
2. Pass the `port` option to `runRedirector({ port: 3000 })`
3. Let it use the default: 8008

### Logging Configuration

The server uses structured logging with configurable levels. Log level defaults
to `INFO`. Available levels: `DEBUG`, `INFO`, `WARN`, `ERROR`, `CRITICAL`.

Configure logging:

1. Set the `LOG_LEVEL` environment variable: `LOG_LEVEL=DEBUG deno task dev`
2. Pass the `logLevel` option to `runRedirector({ logLevel: "DEBUG" })`
3. Let it use the default: `INFO`

**Log output:**

- `INFO`: Server startup, configuration loaded, listening address
- `DEBUG`: All of the above + every request with redirect details
- `WARN`/`ERROR`/`CRITICAL`: Errors and critical issues

**Example:**

```bash
# Debug mode shows all requests
LOG_LEVEL=DEBUG deno task dev

# Quiet mode shows only warnings and errors
LOG_LEVEL=WARN deno task dev
```

### Redirect Configuration

Edit `config.yaml` to configure your redirects:

```yaml
# The destination domain for default redirects
destination: example.com

# Redirect status code: 301 (permanent) or 307 (temporary)
# Default: 307
redirectStatus: 307

# Custom path redirects (optional)
# These override the default domain replacement
# Each redirect can optionally override the status code
redirects:
  - from: /biz
    to: /baz
  - from: /old-page
    to: /new-page
    status: 301
  - from: /blog
    to: https://blog.example.com
```

### How It Works

1. **Default behavior**: Replaces the incoming domain with your configured
   destination
   - `foo.com/example` → `https://example.com/example`
   - Query parameters are preserved: `foo.com/page?q=test` →
     `https://example.com/page?q=test`

2. **Custom redirects**: Override specific paths
   - Relative paths use the destination domain: `/biz` →
     `https://example.com/baz`
   - Full URLs redirect directly: `/blog` → `https://blog.example.com`

3. **Redirect type**: Configure `redirectStatus` in `config.yaml` to use 301
   (permanent) or 307 (temporary, default)

## Development

```bash
# Run with watch mode
deno task dev

# Run tests
deno task test

# Check formatting
deno task fmt

# Run linter
deno task lint
```

## Project Structure

```
redirector/
├── mod.ts            # Library exports
├── lib.ts            # Core library logic
├── lib_test.ts       # Library tests
├── main.ts           # CLI entry point
├── main_test.ts      # Integration tests
├── config.yaml       # Example configuration
├── deno.json         # Project & JSR config
└── .github/
    └── workflows/
        └── ci.yml    # CI checks (fmt, lint, test)
```

## Publishing to JSR

Package is published at
[@brettchalupa/redirector](https://jsr.io/@brettchalupa/redirector).

To publish a new version:

```bash
# Update version in deno.json
# Then publish
deno publish
```

## Requirements

- Deno 2.5 or later
- Uses only Deno built-ins and standard library (`@std/yaml`)

## License

MIT License

Copyright (c) Brett Chalupa 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
