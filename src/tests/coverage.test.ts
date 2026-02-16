import 'async';
import 'should';

import Sitemapper from '../../lib/assets/sitemapper.js';

describe('Sitemapper Coverage Tests', function () {
  let sitemapper: Sitemapper;

  beforeEach(() => {
    sitemapper = new Sitemapper();
  });

  describe('Advanced crawling scenarios', function () {
    it('should handle retry correctly', async function () {
      this.timeout(10000);

      // Create a sitemapper with retry capability
      sitemapper = new Sitemapper({
        retries: 1,
        debug: true,
      });

      // Use a URL that will trigger retries
      const result = await sitemapper.crawl(
        'https://example.com/non-existent-sitemap.xml'
      );

      result.should.have.property('sites').which.is.an.Array();
      result.should.have.property('errors').which.is.an.Array();
      result.errors.length.should.be.greaterThan(0);
      result.errors[0].should.have.property('retries').which.is.a.Number();
    });

    it('should handle parsing urlset with single url', async function () {
      // Mock the parse method to return data with single url in urlset
      const originalParse = sitemapper.parse;

      sitemapper.parse = async () => {
        return {
          data: {
            urlset: {
              url: { loc: 'https://example.com/page1' },
            },
          },
        };
      };

      const result = await sitemapper.crawl('https://example.com/sitemap.xml');
      result.should.have.property('sites').which.is.an.Array();
      result.sites.length.should.equal(1);
      result.sites[0].should.equal('https://example.com/page1');

      // Restore original method
      sitemapper.parse = originalParse;
    });
  });

  describe('Error handling', function () {
    it('should handle unknown errors during crawl', async function () {
      // Mock the parse method to return an unexpected data format
      const originalParse = sitemapper.parse;

      sitemapper.parse = async () => {
        return {
          data: {
            unexpectedFormat: true,
          },
        };
      };

      const result = await sitemapper.crawl('https://example.com/sitemap.xml');
      result.should.have.property('sites').which.is.an.Array();
      result.should.have.property('errors').which.is.an.Array();
      result.errors.length.should.be.greaterThan(0);
      result.errors[0].should.have.property('type').which.is.a.String();

      // Restore original method
      sitemapper.parse = originalParse;
    });
  });

  describe('Exclusion patterns', function () {
    it('should correctly filter URLs based on multiple exclusion patterns', async function () {
      // Create a sitemapper with exclusion patterns
      sitemapper = new Sitemapper({
        exclusions: [/exclude/, /filtered/],
      });

      // Mock the parse method
      const originalParse = sitemapper.parse;

      sitemapper.parse = async () => {
        return {
          data: {
            urlset: {
              url: [
                { loc: 'https://example.com/exclude-this' },
                { loc: 'https://example.com/keep-this' },
                { loc: 'https://example.com/filtered-content' },
              ],
            },
          },
        };
      };

      const result = await sitemapper.crawl('https://example.com/sitemap.xml');
      result.should.have.property('sites').which.is.an.Array();
      result.sites.length.should.equal(1);
      result.sites[0].should.equal('https://example.com/keep-this');

      // Restore original method
      sitemapper.parse = originalParse;
    });
  });

  describe('Fields option', function () {
    it('should include specified fields when fields option is set', async function () {
      // Create a sitemapper with fields
      sitemapper = new Sitemapper({
        fields: {
          loc: true,
          lastmod: true,
          priority: true,
          changefreq: true,
          sitemap: true,
        },
      });

      // Mock the parse method
      const originalParse = sitemapper.parse;

      sitemapper.parse = async () => {
        return {
          data: {
            urlset: {
              url: [
                {
                  loc: 'https://example.com/page1',
                  lastmod: '2024-01-01',
                  priority: '0.8',
                  changefreq: 'daily',
                },
              ],
            },
          },
        };
      };

      const result = await sitemapper.crawl('https://example.com/sitemap.xml');
      result.should.have.property('sites').which.is.an.Array();
      result.sites.length.should.equal(1);
      result.sites[0].should.have.property('loc').which.is.a.String();
      result.sites[0].should.have.property('lastmod').which.is.a.String();
      result.sites[0].should.have.property('priority').which.is.a.String();
      result.sites[0].should.have.property('changefreq').which.is.a.String();

      // Restore original method
      sitemapper.parse = originalParse;
    });
  });
});
