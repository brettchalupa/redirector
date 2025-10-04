# Claude Code Development Notes

## Project Overview

Redirector is a simple, configurable URL redirector built for Deno Deploy and
edge runtimes. It handles domain-based redirects with custom path overrides.

## Development Workflow

### Before Making Changes

1. Read relevant files to understand the current implementation
2. Plan changes if complex (consider using TodoWrite for multi-step tasks)

### After Making Changes

**ALWAYS run `deno task check-all` before considering work complete.**

This runs:

- `deno check **/*.ts` - Type checking
- `deno test --allow-read --allow-write` - All tests
- `deno lint` - Linting
- `deno fmt --check` - Format checking

If `deno fmt --check` fails, run `deno fmt` to fix formatting.

### Available Tasks

```bash
deno task dev        # Run with watch mode (uses -P for permissions)
deno task start      # Run server
deno task test       # Run tests
deno task check      # Type check all TypeScript files
deno task fmt        # Format all files
deno task lint       # Lint all files
deno task check-all  # Run all checks (check, test, lint, fmt --check)
```

## Project Structure

- `main.ts` - Server logic, config loading, redirect handling
- `main_test.ts` - Comprehensive test suite (14 tests)
- `config.yaml` - Example configuration with redirect rules
- `deno.json` - Project config with tasks, imports, and permissions
- `.github/workflows/ci.yml` - CI that runs checks on push/PR

## Key Implementation Details

### Configuration Hierarchy

Redirect status codes follow this priority order:

1. Per-redirect `status` field (highest priority)
2. Global `redirectStatus` in config
3. Default 307 (temporary redirect)

### Redirect Logic

The `getRedirectInfo()` function returns both URL and status code:

- Checks custom redirects first (exact path match)
- Falls back to default domain replacement
- Preserves query parameters
- Supports full URLs in custom redirects

### Type Safety

- `Config` interface defines configuration structure
- `RedirectRule` interface for custom redirects
- Status codes limited to `301 | 307` for type safety

## Testing Philosophy

- Test both URL generation and status code selection
- Test hierarchy of status code precedence
- Test edge cases (query params, full URLs, non-matches)
- Tests should be comprehensive but fast

## Deployment

Deno Deploy handles automatic deployment from connected repos. The CI workflow
only runs checks - no deployment step needed.
