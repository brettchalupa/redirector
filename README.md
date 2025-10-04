# Redirector

A simple, configurable URL redirector built for Deno Deploy and edge runtimes.

## Features

- 🚀 Simple domain-based redirects (e.g., `foo.com/example` → `bar.com/example`)
- 🎯 Custom path redirects with override support
- 🔒 Permanent (301) or temporary (307) redirects
- ⚙️ YAML-based configuration
- 🧪 Comprehensive test suite
- 🌐 Deploy to Deno Deploy with automatic CI/CD

## Quick Start

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd redirector

# Configure your redirects in config.yaml
# Run the server
deno task dev
```

### Deploy to Deno Deploy

1. Fork or use this repository as a template
2. Connect your repository to [Deno Deploy](https://deno.com/deploy)
3. Configure `config.yaml` with your redirects
4. Push to main - automatic deployment handled by Deno Deploy

## Configuration

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
├── main.ts           # Main server logic
├── main_test.ts      # Test suite
├── config.yaml       # Redirect configuration
├── deno.json         # Deno project config
└── .github/
    └── workflows/
        └── ci.yml    # CI checks (fmt, lint, test)
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
