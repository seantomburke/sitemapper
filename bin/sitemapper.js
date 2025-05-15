#!/usr/bin/env node

import Sitemapper from '../lib/assets/sitemapper.js';

async function main() {
  const sitemapUrl = process.argv[2];

  if (!sitemapUrl) {
    console.error('Please provide a sitemap URL');
    console.error('Usage: npx sitemapper <sitemap-url>');
    process.exit(1);
  }

  try {
    const sitemapper = new Sitemapper();
    const { url, sites } = await sitemapper.fetch(sitemapUrl);

    console.log('\nSitemap URL:', url);
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
