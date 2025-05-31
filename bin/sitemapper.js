#!/usr/bin/env node

import Sitemapper from '../lib/assets/sitemapper.js';

async function main() {
  const sitemapInput = process.argv[2];

  if (!sitemapInput) {
    console.error('Please provide a sitemap URL or file path');
    console.error('Usage: npx sitemapper <sitemap-url-or-file-path>');
    console.error('Examples:');
    console.error('  npx sitemapper https://example.com/sitemap.xml');
    console.error('  npx sitemapper ./sitemap.xml');
    console.error('  npx sitemapper /path/to/sitemap.xml');
    process.exit(1);
  }

  try {
    const sitemapper = new Sitemapper();
    const { url, sites } = await sitemapper.fetch(sitemapInput);

    console.log('\nSitemap source:', url);
    console.log('\nFound URLs:');
    sites.forEach((site, index) => {
      console.log(`${index + 1}. ${site}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
