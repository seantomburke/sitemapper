# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development

```bash
# Install dependencies
npm install

# Build the project (compiles ES6 to lib/ and TypeScript tests)
npm run build

# Run tests
npm test                    # Full test suite (build + tests + linting)
npm run test:js            # Run JavaScript tests only
npm run test:ts            # Run TypeScript type checking only
npm run test:coverage      # Run tests with code coverage report

# Run a single test file
npx mocha ./lib/tests/specific-test.js

# Linting and formatting
npm run lint               # Run all linting checks (ESLint + Prettier + Spell check)
npm run lint:eslint        # ESLint only
npm run lint:prettier      # Prettier check only
npm run lint:prettier -- --write  # Fix Prettier formatting issues
npm run lint:spell         # CSpell spell check only
```

### CLI Testing

```bash
# Test the CLI tool
node bin/sitemapper.js https://example.com/sitemap.xml
npx sitemapper https://example.com/sitemap.xml --timeout=5000
```

## Architecture Overview

### Project Structure

- **Source code**: `src/assets/sitemapper.js` - Main ES6 module source
- **Compiled output**: `lib/assets/sitemapper.js` - Babel-compiled ES module
- **Tests**: `src/tests/*.ts` - TypeScript test files that compile to `lib/tests/*.js`
- **CLI**: `bin/sitemapper.js` - Command-line interface

### Build Pipeline

1. **Babel** transpiles ES6+ to ES modules (targets browsers, not Node)
2. **TypeScript** compiles test files and provides type checking
3. **NYC/Istanbul** instruments code for coverage during tests

### Core Architecture

The `Sitemapper` class handles XML sitemap parsing with these key responsibilities:

1. **HTTP Request Management**
   - Uses `got` for HTTP requests with configurable timeout
   - Supports proxy via `hpagent`
   - Handles gzipped responses automatically
   - Implements retry logic for failed requests

2. **XML Parsing Flow**
   - `fetch()` → Public API entry point
   - `parse()` → Handles HTTP request and XML parsing
   - `crawl()` → Recursive method that handles both single sitemaps and sitemap indexes
   - Uses `fast-xml-parser` with specific array handling for `sitemap` and `url` elements

3. **Concurrency Control**
   - Uses `p-limit` to control concurrent requests when parsing sitemap indexes
   - Default concurrency: 10 simultaneous requests

4. **URL Filtering**
   - `isExcluded()` method applies regex patterns from `exclusions` option
   - `lastmod` filtering happens during the crawl phase

### Testing Strategy

- **Unit tests** cover core functionality and edge cases
- **Integration tests** hit real sitemaps (can fail if external sites are down)
- **Coverage requirements**: 74% branches, 75% lines/functions/statements
- Tests run across Node 18.x, 20.x, 22.x, and 24.x in CI

### CI/CD Considerations

GitHub Actions workflows enforce:

- All tests must pass
- TypeScript type checking
- ESLint and Prettier formatting
- Spell checking with CSpell
- Code coverage thresholds

When tests fail due to external sitemaps being unavailable, retry the workflow.

### Before Pushing

Always run the full test suite before pushing:

```bash
npm test
```

This runs build, unit tests, TypeScript type checking, ESLint, Prettier, and spell check.

### Formatting and Spell Check

After making any code or documentation changes:

1. Run `npm run lint:prettier -- --write` to fix formatting (automated via Claude Code hook)
2. Run `npm run lint:spell` to check for unknown words
3. Add legitimate technical terms to `cspell.json` under `words` rather than rewording

### GitHub Actions Idempotency

All workflows must be safe to rerun at any point. Guard every side-effectful step:

- **Git tags**: check `git rev-parse --verify refs/tags/$VERSION` before creating
- **NPM publish**: check `npm view <pkg>@$VERSION` before publishing
- **GitHub Releases**: check `gh release view $VERSION` before creating
- **Checkout**: use `fetch-tags: true` so tag existence checks see remote tags

## Important Notes

- This is an ES module project (`"type": "module"` in package.json)
- The main entry point is the compiled file, not the source
- Tests are written in TypeScript but run as compiled JavaScript
- Real-world sitemap tests may fail intermittently due to external dependencies
- The deprecated `getSites()` method exists for backward compatibility but should not be used

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->
