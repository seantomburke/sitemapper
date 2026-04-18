# Sitemap CLI Reference

## Basic Usage

List the URLs from a sitemap:

```sh
npx sitemapper https://example.com/sitemap.xml
```

Use the documented timeout form when the user explicitly wants it:

```sh
npx sitemapper https://example.com/sitemap.xml --timeout=5000
```

## Find The Sitemap URL

If the user gives only a site root, check `robots.txt` first:

```sh
curl -sS https://example.com/robots.txt | rg -i '^sitemap:'
```

If that does not expose a sitemap URL, try common paths manually:

- `https://example.com/sitemap.xml`
- `https://example.com/sitemap_index.xml`

## Output Shape

The CLI prints:

- the resolved sitemap URL
- a `Found URLs:` header
- a numbered list of URLs

Treat this as human-facing output. Do not build fragile automation around the numbering or line format.

## Safe Shell Patterns

Save the full CLI output:

```sh
npx sitemapper https://example.com/sitemap.xml | tee /tmp/sitemap-output.txt
```

## Reporting

When summarizing results, include:

- the sitemap URL you inspected
- a brief qualitative description of the output
- a saved file path when the user asked for output handling
