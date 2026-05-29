---
name: sitemap
description: Use the `npx sitemapper` CLI to inspect XML sitemaps from the command line. Use when you need to list URLs from a `sitemap.xml` or sitemap index, find a sitemap URL from a site root, save raw CLI output, or apply the documented minimal timeout flag.
---

# Sitemap

## Overview

Use this skill for command-line sitemap inspection with `npx sitemapper`. Keep the scope at the outer interface: resolve the sitemap URL, run the CLI, save raw output when needed, and summarize the result from the displayed output.

## Quick Start

```sh
npx sitemapper https://example.com/sitemap.xml
```

If the user explicitly wants the documented timeout form, use:

```sh
npx sitemapper https://example.com/sitemap.xml --timeout=5000
```

## Workflow

1. Choose the interface.

- Use `npx sitemapper <sitemap-url>` for the normal path.
- Add `--timeout=<ms>` only when the user explicitly asks for it or a slow sitemap needs a longer wait.

2. Resolve the sitemap URL.

- If the user already provides a direct sitemap URL, use it as-is.
- If the user provides only a site root, inspect `robots.txt` first, then try common paths such as `/sitemap.xml` and `/sitemap_index.xml`.

3. Work with the CLI output.

- The CLI prints a sitemap header and then a numbered list of URLs.
- Treat that output as human-oriented display, not a stable machine-readable interface.
- If the user needs a saved artifact, save the raw CLI output as-is.

4. Summarize only what the command proves.

- Report the exact sitemap URL you used.
- Give a qualitative summary based on the visible output.
- If the user asked for an artifact, return the saved path to the raw CLI output.

## CLI Notes

- Stay at the CLI surface. Do not load internal repo structure or implementation details unless the user explicitly asks about the package source.
- Prefer the direct command first.
- Treat `npx sitemapper` as a read-only inspection tool. Do not infer metadata that the CLI output does not show.

## Common Requests

- "List every URL in this sitemap."
- "Find the sitemap URL for this site and inspect it."
- "Save the CLI output to a file."
- "Run the timeout form from the docs."

## References

Read [references/cli.md](references/cli.md) for CLI recipes and sitemap discovery patterns.
