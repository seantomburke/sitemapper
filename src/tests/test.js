import 'async';
import 'assert';
import 'should';
import isUrl from 'is-url';

import Sitemapper from '../../lib/assets/sitemapper.js';

let sitemapper;

describe('Sitemapper', function () {
  beforeEach(function () {
    sitemapper = new Sitemapper();
  });

  describe('Sitemapper Class', function () {
    it('should have initializeTimeout method', function () {
      sitemapper.initializeTimeout.should.be.Function;
    });

    it('should have crawl method', function () {
      sitemapper.crawl.should.be.Function;
    });

    it('should have parse method', function () {
      sitemapper.parse.should.be.Function;
    });

    it('should have fetch method', function () {
      sitemapper.fetch.should.be.Function;
    });

    it('should construct with a url', function () {
      sitemapper = new Sitemapper({
        url: 'google.com',
      });
      sitemapper.url.should.equal('google.com');
    });

    it('should construct with a timeout', function () {
      sitemapper = new Sitemapper({
        timeout: 1000,
      });
      sitemapper.timeout.should.equal(1000);
    });

    it('should set timeout', function () {
      sitemapper.timeout = 1000;
      sitemapper.timeout.should.equal(1000);
    });

    it('should set url', function () {
      sitemapper.url = 1000;
      sitemapper.url.should.equal(1000);
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
  });

  describe('gzipped sitemaps', function () {
    beforeEach(function () {
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

    // foo.com added HTTPS so this test breaks. TODO: find an insecure site to test with
    it.skip('https://foo.com/sitemap.xml should allow insecure request', function (done) {
      this.timeout(30000);
      const url = 'https://foo.com/sitemap.xml';
      sitemapper.timeout = 10000;
      sitemapper.rejectUnauthorized = true;
      sitemapper
        .fetch(url)
        .then((data) => {
          data.sites.should.be.Array;
          data.errors.should.be.Array;
          data.errors.should.containEql({
            type: 'RequestError',
            message: 'Error occurred: RequestError',
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
    // check for the url that should be excluded in a later test
    it('should prevent false positive', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      // exclude video and image sitemap index urls
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
      // exclude page_id=2
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
