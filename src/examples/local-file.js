import Sitemapper from '../assets/sitemapper.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to a local sitemap file (you can change this to your actual file)
const localSitemapPath = path.join(__dirname, '../tests/test-sitemap.xml');

console.log('Parsing local sitemap file:', localSitemapPath);

// Instantiate sitemapper
const sitemapper = new Sitemapper({
  debug: true, // show debug logs
});

/**
 * Async/await example of parsing a local sitemap file
 */
(async () => {
  try {
    // fetch the local file to get all sites
    const data = await sitemapper.fetch(localSitemapPath);

    console.log('\n=== Results ===');
    console.log('File:', data.url);
    console.log('Number of URLs found:', data.sites.length);
    console.log('\nURLs:');
    data.sites.forEach((site, index) => {
      console.log(`${index + 1}. ${site}`);
    });

    if (data.errors.length > 0) {
      console.log('\nErrors:');
      data.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
      });
    }
  } catch (error) {
    // log any errors
    console.error('Error:', error);
  }
})();