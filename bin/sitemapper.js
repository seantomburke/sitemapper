#!/usr/bin/env node

import Sitemapper from '../lib/assets/sitemapper.js';
import { parseArgs } from 'node:util';
import fs from 'node:fs';

// Get version from the package.json file - hardcoded for simplicity
const VERSION = '4.0.3';

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      // Core options
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
      url: { type: 'string', short: 'u' },
      // Output formatting
      format: { type: 'string', short: 'f', default: 'plaintext' },
      output: { type: 'string', short: 'o' },
      // Sitemapper options
      timeout: { type: 'string', short: 't' },
      debug: { type: 'boolean', short: 'd' },
      concurrency: { type: 'string', short: 'c' },
      retries: { type: 'string', short: 'r' },
      lastmod: { type: 'string', short: 'l' },
      'reject-unauthorized': { type: 'boolean' },
      fields: { type: 'string' },
      'user-agent': { type: 'string' },
      exclusions: { type: 'string' },
    },
    allowPositionals: true,
  });

  // Handle help command
  if (values.help) {
    displayHelp();
    return;
  }

  // Handle version command
  if (values.version) {
    console.log(`sitemapper v${VERSION}`);
    return;
  }

  // Get URL from positional argument or --url option
  const sitemapUrl = positionals[0] || values.url;

  if (!sitemapUrl) {
    console.error('Error: Please provide a sitemap URL');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  try {
    // Parse options for sitemapper
    const options = {
      url: sitemapUrl,
      debug: values.debug || false,
      rejectUnauthorized: values['reject-unauthorized'] !== false,
    };

    // Add numeric options if provided
    if (values.timeout) options.timeout = parseInt(values.timeout, 10);
    if (values.concurrency) {
      options.concurrency = parseInt(values.concurrency, 10);
    }
    if (values.retries) options.retries = parseInt(values.retries, 10);
    if (values.lastmod) options.lastmod = parseInt(values.lastmod, 10);

    // Add request headers if user-agent is provided
    if (values['user-agent']) {
      options.requestHeaders = {
        'User-Agent': values['user-agent'],
      };
    }

    // Parse fields option
    if (values.fields) {
      options.fields = {};
      const fieldsList = values.fields.split(',');
      for (const field of fieldsList) {
        options.fields[field.trim()] = true;
      }
    }

    // Parse exclusions option
    if (values.exclusions) {
      options.exclusions = values.exclusions
        .split(',')
        .map((pattern) => new RegExp(pattern.trim()));
    }

    const sitemapper = new Sitemapper(options);
    const result = await sitemapper.fetch(sitemapUrl);

    // Format the output based on format option
    let output;
    switch (values.format.toLowerCase()) {
      case 'json':
        output = JSON.stringify(result, null, 2);
        break;
      case 'csv':
        if (options.fields) {
          // Create header row
          const headers = Object.keys(options.fields).join(',');
          // Create data rows
          const rows = result.sites.map((site) => {
            if (typeof site === 'string') {
              return site;
            }
            return Object.keys(options.fields)
              .map((field) => site[field] || '')
              .join(',');
          });
          output = [headers, ...rows].join('\n');
        } else {
          // Simple CSV with just URLs
          output = result.sites.join('\n');
        }
        break;
      case 'plaintext':
      default:
        output = `Sitemap URL: ${result.url}\n\nFound URLs (${result.sites.length}):\n`;
        result.sites.forEach((site, index) => {
          if (typeof site === 'string') {
            output += `${index + 1}. ${site}\n`;
          } else {
            output += `${index + 1}. ${JSON.stringify(site)}\n`;
          }
        });
        if (result.errors.length > 0) {
          output += `\nErrors (${result.errors.length}):\n`;
          result.errors.forEach((error, index) => {
            output += `${index + 1}. ${error.message} (${error.url})\n`;
          });
        }
        break;
    }

    // Output results
    if (values.output) {
      fs.writeFileSync(values.output, output);
      console.log(`Results written to ${values.output}`);
    } else {
      console.log(output);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function displayHelp() {
  console.log(`
sitemapper v${VERSION}

Usage:
  npx sitemapper <sitemap-url> [options]

Options:
  -h, --help                   Show this help message and exit
  -v, --version                Show version information and exit
  -u, --url <url>              Sitemap URL to crawl (alternative to positional arg)
  -o, --output <file>          Write results to a file instead of stdout
  -f, --format <format>        Output format (plaintext, csv, json) [default: plaintext]
  -t, --timeout <ms>           Maximum timeout in ms for a single URL [default: 15000]
  -d, --debug                  Enable debug logging
  -c, --concurrency <number>   Maximum number of concurrent sitemap threads [default: 10]
  -r, --retries <number>       Maximum number of retries for failed requests [default: 0]
  -l, --lastmod <timestamp>    Minimum lastmod timestamp value for URLs to include
  --reject-unauthorized        Reject invalid SSL certificates [default: true]
  --user-agent <string>        Set a custom User-Agent header
  --fields <fields>            Comma-separated list of fields to include in output
                               (loc,lastmod,changefreq,priority,sitemap,
                                image:loc,image:title,image:caption,
                                video:title,video:description,video:thumbnail_loc)
  --exclusions <patterns>      Comma-separated list of regex patterns to exclude URLs

Examples:
  npx sitemapper https://example.com/sitemap.xml
  npx sitemapper https://example.com/sitemap.xml --format json
  npx sitemapper https://example.com/sitemap.xml --fields loc,lastmod,priority --format csv

For more information, visit: https://github.com/seantomburke/sitemapper
`);
}

main();
