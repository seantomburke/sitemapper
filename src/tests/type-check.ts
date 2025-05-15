import Sitemapper, {
  SitemapperOptions,
  SitemapperResponse,
  SitemapperErrorData,
} from '../../sitemapper';
import { HttpsProxyAgent } from 'hpagent';

const sitemapper = new Sitemapper({
  url: 'https://example.com/sitemap.xml',
  timeout: 30000,
  debug: false,
  concurrency: 5,
  retries: 1,
  rejectUnauthorized: true,
  lastmod: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
  exclusions: [/exclude-this/],
});

async function testTypes() {
  try {
    // Check constructor options type
    const options = {
      url: 'https://test.com/sitemap.xml',
      timeout: 1000,
      lastmod: 0,
      concurrency: 1,
      retries: 0,
      debug: true,
      rejectUnauthorized: false,
      proxyAgent: new HttpsProxyAgent({
        proxy: 'http://localhost:8080',
      }),
      exclusions: [/test/],
    };
    const sitemapperWithOptions = new Sitemapper(options);
    console.log(
      `Created sitemapper with options for ${sitemapperWithOptions.url}`
    );

    // Check fetch method and return type
    console.log(`Fetching sitemap from: ${sitemapper.url}`);
    const data = await sitemapper.fetch();
    console.log(`Fetched ${data.sites.length} sites from ${data.url}`);

    // Check sites array type
    const sites = data.sites;
    sites.forEach((site) => {
      console.log(`- ${site}`);
    });

    // Check errors array type
    const errors = data.errors;
    errors.forEach((error) => {
      console.error(
        `Error: ${error.type} for ${error.url}, retries: ${error.retries}`
      );
    });

    // Test setting properties (assuming they exist and are settable in .d.ts)
    // sitemapper.timeout = 10000;
    // console.log(`New timeout: ${sitemapper.timeout}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

testTypes();
