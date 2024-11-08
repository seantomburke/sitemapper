require('async');
require('assert');
require('should');
const isUrl = require('is-url');

const Sitemapper = require('../../lib/assets/sitemapper.js');
var sitemapper;

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
});
