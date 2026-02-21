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
