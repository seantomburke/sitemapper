import 'async';
import 'assert';
import 'should';
import isUrl = require('is-url');

import Sitemapper from '../../lib/assets/sitemapper.js';
import { SitemapperResponse } from '../../sitemapper';
let sitemapper: Sitemapper;

describe('Sitemapper', function () {
  beforeEach(() => {
    sitemapper = new Sitemapper();
  });

  describe('Sitemapper Class', function () {
    it('should have initializeTimeout method', () => {
      sitemapper.initializeTimeout.should.be.Function;
    });

    it('should have crawl method', () => {
      sitemapper.crawl.should.be.Function;
    });

    it('should have parse method', () => {
      sitemapper.parse.should.be.Function;
    });

    it('should have fetch method', () => {
      sitemapper.fetch.should.be.Function;
    });

    it('should construct with a url', () => {
      sitemapper = new Sitemapper({
        url: 'google.com',
      });
      sitemapper.url.should.equal('google.com');
    });

    it('should construct with a timeout', () => {
      sitemapper = new Sitemapper({
        timeout: 1000,
      });
      sitemapper.timeout.should.equal(1000);
    });

    it('should set timeout', () => {
      sitemapper.timeout = 1000;
      sitemapper.timeout.should.equal(1000);
    });

    it('should set url', () => {
      sitemapper.url = 1000;
      sitemapper.url.should.equal(1000);
    });

    it('should construct with specific fields', () => {
      sitemapper = new Sitemapper({
        fields: { loc: true, lastmod: true, priority: true, changefreq: true },
      });
      sitemapper.fields.should.be.Object &&
        sitemapper.fields.should.have.keys(
          'loc',
          'lastmod',
          'priority',
          'changefreq'
        );
    });
  });

  describe('fetch Method resolves sites to array', function () {
    it('https://wp.seantburke.com/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(2);
          isUrl(data.sites[0]).should.be.true;
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('gibberish.gibberish should fail silently with an empty array', function (done) {
      this.timeout(30000);
      const url = 'http://gibberish.gibberish';
      sitemapper.debug = true;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.errors.should.be.Array;
          data.errors.length.should.be.greaterThan(0);
          console.log(data);
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://webflow.com/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      const url = 'https://webflow.com/sitemap.xml';
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(2);
          isUrl(data.sites[0]).should.be.true;
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://wp.seantburke.com/sitemap.xml sitemaps should contain extra fields', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper = new Sitemapper({
        fields: {
          loc: true,
          lastmod: true,
          priority: true,
          changefreq: true,
          sitemap: true,
        },
      });
      sitemapper
        .fetch(url)
        .then((data: SitemapperResponse) => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(0);

          const firstSite = data.sites[0];
          firstSite.should.be.Object();

          firstSite.should.have.property('loc');
          firstSite.loc.should.be.String();
          isUrl(firstSite.loc).should.be.true();

          firstSite.should.have.property('sitemap');
          firstSite.sitemap.should.be.String();
          isUrl(firstSite.sitemap).should.be.true();

          if (firstSite.lastmod) {
            firstSite.lastmod.should.be.String();
          }
          if (firstSite.priority) {
            firstSite.priority.should.be.String();
          }
          if (firstSite.changefreq) {
            firstSite.changefreq.should.be.String();
          }

          done();
        })
        .catch((error) => {
          console.error('Test failed for extra fields:', error);
          done(error);
        });
    });

    it('https://www.golinks.io/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      const url = 'https://www.golinks.io/sitemap.xml';
      sitemapper.timeout = 5000;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(2);
          isUrl(data.sites[0]).should.be.true;
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://www.golinks.io/sitemap.xml sitemaps should return an empty array when timing out', function (done) {
      this.timeout(30000);
      const url = 'https://www.golinks.io/sitemap.xml';
      sitemapper.timeout = 1;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.errors.should.be.Array;
          console.log(data);
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://www.golinks.com/blog/sitemap.xml sitemaps should return an empty array when timing out', function (done) {
      this.timeout(30000);
      const url = 'https://www.golinks.com/blog/sitemap.xml';
      sitemapper.timeout = 10000;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.errors.should.be.Array;
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://www.banggood.com/sitemap/category.xml.gz gzip should be a non-empty array', function (done) {
      this.timeout(30000);
      const url = 'https://www.banggood.com/sitemap/category.xml.gz';
      sitemapper.timeout = 10000;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.length.should.be.greaterThan(0);
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://bigcrafters.com/sitemap.xml sitemaps should include the source sitemap URL', function (done) {
      this.timeout(30000); // Increase timeout for potentially large sitemap index
      const url = 'https://bigcrafters.com/sitemap.xml';
      sitemapper = new Sitemapper({
        // Using fields explicitly to ensure structure
        fields: { loc: true, lastmod: true },
      });
      sitemapper
        .fetch(url)
        .then((data: SitemapperResponse) => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(0); // Ensure sites were found

          // Check each site object
          let hasSubSitemapUrl = false;
          for (const site of data.sites) {
            site.should.be.Object; // Ensure it's an object
            site.should.have.property('sitemap');
            site.sitemap.should.be.String();
            isUrl(site.sitemap).should.be.true; // Check if it's a valid URL

            site.should.have.property('loc');
            isUrl(site.loc).should.be.true;

            // Check if we found a site from a sub-sitemap
            if (site.sitemap !== url) {
              hasSubSitemapUrl = true;
            }
          }

          // Verify that at least one site came from a different sitemap than the index
          hasSubSitemapUrl.should.be.true;

          done();
        })
        .catch((error) => {
          console.error('Test failed for sitemap source:', error);
          done(error);
        });
    });
  });

  describe('gzipped sitemaps', function () {
    beforeEach(() => {
      sitemapper = new Sitemapper({
        requestHeaders: {
          'Accept-Encoding': 'gzip,deflate,sdch',
        },
      });
    });

    it('https://www.banggood.com/sitemap/category.xml.gz gzip should be a non-empty array', function (done) {
      this.timeout(30000);
      const url = 'https://www.banggood.com/sitemap/category.xml.gz';
      sitemapper.timeout = 10000;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.errors.should.be.Array;
          data.sites.length.should.be.greaterThan(0);
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('https://foo.com/sitemap.xml should not allow insecure request', function (done) {
      this.timeout(30000);
      const url = 'https://foo.com/sitemap.xml';
      sitemapper.timeout = 10000;
      sitemapper.rejectUnauthorized = false;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.errors.should.be.Array;
          data.errors.should.containEql({
            type: 'HTTPError',
            message: 'HTTP Error occurred: Response code 404 (Not Found)',
            url: 'https://foo.com/sitemap.xml',
            retries: 0,
          });
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });
  });

  describe('getSites method', function () {
    it('getSites should be backwards compatible', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper.getSites(url, (err, sites) => {
        sites.should.be.Array;
        isUrl(sites[0]).should.be.true;
        done();
      });
    });
  });

  describe('exclusions option', function () {
    it('should prevent false positive', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper.exclusions = [/video/, /image/];
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.includes('https://wp.seantburke.com/?page_id=2').should.be
            .true;
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });

    it('should filter out page_id urls', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper.exclusions = [/page_id/];
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.includes('https://wp.seantburke.com/?page_id=2').should.be
            .false;
          done();
        })
        .catch((error) => {
          console.error('Test failed');
          done(error);
        });
    });
  });

  describe('isExcluded method', function () {
    it('should return false when no exclusions are set', function () {
      const result = sitemapper.isExcluded('https://foo.com/page1');
      result.should.be.false();
    });

    it('should return false when url does not match any exclusion patterns', function () {
      sitemapper.exclusions = [/\.pdf$/, /private/];
      const result = sitemapper.isExcluded('https://foo.com/page1');
      result.should.be.false();
    });

    it('should return false when url matches an exclusion pattern', function () {
      sitemapper.exclusions = [/\.pdf$/, /private/];
      const result = sitemapper.isExcluded('https://foo.com/document.pdf');
      result.should.be.true();
    });

    it('should return true when url matches any of multiple exclusion patterns', function () {
      sitemapper.exclusions = [/\.pdf$/, /private/, /temp/];
      const result = sitemapper.isExcluded('https://foo.com/private/temp.html');
      result.should.be.true();
    });

    it('should handle complex regex patterns correctly', function () {
      sitemapper.exclusions = [/^https:\/\/foo\.com\/([a-z]{2})\/private/];
      const result1 = sitemapper.isExcluded('https://foo.com/en/private/page');
      const result2 = sitemapper.isExcluded('https://foo.com/en/public/page');
      result1.should.be.true();
      result2.should.be.false();
    });

    it('should handle case sensitivity correctly', function () {
      sitemapper.exclusions = [/private/i];
      const result1 = sitemapper.isExcluded('https://foo.com/PRIVATE/page');
      const result2 = sitemapper.isExcluded('https://foo.com/Private/page');
      result1.should.be.true();
      result2.should.be.true();
    });
  });
});
