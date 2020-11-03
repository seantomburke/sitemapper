"use strict";

require('async');

require('assert');

require('should');

var isUrl = require('is-url');

var Sitemapper = require('../assets/sitemapper.js');

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
    it('should contruct with a url', function () {
      sitemapper = new Sitemapper({
        url: 'google.com'
      });
      sitemapper.url.should.equal('google.com');
    });
    it('should contruct with a timeout', function () {
      sitemapper = new Sitemapper({
        timeout: 1000
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
      var url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        data.url.should.equal(url);
        data.sites.length.should.be.above(2);
        isUrl(data.sites[0]).should.be["true"];
        done();
      })["catch"](function (error) {
        console.error('Test failed');
        done();
      });
    });
    it('giberish.giberish should fail silently with an empty array', function (done) {
      this.timeout(30000);
      var url = 'http://giberish.giberish';
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        done();
      })["catch"](function (error) {
        console.error('Test failed');
        done();
      });
    });
    it('https://www.google.com/work/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      var url = 'https://www.google.com/work/sitemap.xml';
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        data.url.should.equal(url);
        data.sites.length.should.be.above(2);
        isUrl(data.sites[0]).should.be["true"];
        done();
      })["catch"](function (error) {
        console.error('Test failed');
        done();
      });
    });
    it('https://www.golinks.io/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      var url = 'https://www.golinks.io/sitemap.xml';
      sitemapper.timeout = 5000;
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        data.url.should.equal(url);
        data.sites.length.should.be.above(2);
        isUrl(data.sites[0]).should.be["true"];
        done();
      })["catch"](function (error) {
        console.error('Test failed');
        done();
      });
    });
  });
  describe('getSites method', function () {
    it('getSites should be backwards compatible', function (done) {
      this.timeout(30000);
      var url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper.getSites(url, function (err, sites) {
        sites.should.be.Array;
        isUrl(sites[0]).should.be["true"];
        done();
      });
    });
  });
});
//# sourceMappingURL=test.es5.js.map