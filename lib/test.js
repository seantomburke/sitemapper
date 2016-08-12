/* global describe,it */
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _isUrl = require('is-url');

var _isUrl2 = _interopRequireDefault(_isUrl);

var _sitemapperJs = require('./sitemapper.js');

var _sitemapperJs2 = _interopRequireDefault(_sitemapperJs);

var sitemapper = undefined;

describe('Sitemapper', function () {

  beforeEach(function () {
    sitemapper = new _sitemapperJs2['default']();
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
      sitemapper = new _sitemapperJs2['default']({
        url: 'google.com'
      });
      sitemapper.url.should.equal('google.com');
    });

    it('should contruct with a timeout', function () {
      sitemapper = new _sitemapperJs2['default']({
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
    it('http://wp.seantburke.com/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      var url = 'http://wp.seantburke.com/sitemap.xml';
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        data.url.should.equal(url);
        data.sites.length.should.be.above(2);
        (0, _isUrl2['default'])(data.sites[0]).should.be['true'];
        done();
      })['catch'](function (error) {
        return console.error(error);
      });
    });

    it('giberish.giberish should fail silently with an empty array', function (done) {
      this.timeout(30000);
      var url = 'http://giberish.giberish';
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        done();
      })['catch'](function (error) {
        return console.error(error);
      });
    });

    it('https://www.google.com/work/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      var url = 'https://www.google.com/work/sitemap.xml';
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        data.url.should.equal(url);
        data.sites.length.should.be.above(2);
        (0, _isUrl2['default'])(data.sites[0]).should.be['true'];
        done();
      })['catch'](function (error) {
        return console.error(error);
      });
    });

    it('http://www.cnn.com/sitemaps/sitemap-index.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      var url = 'http://www.cnn.com/sitemaps/sitemap-index.xml';
      sitemapper.timeout = 5000;
      sitemapper.fetch(url).then(function (data) {
        data.sites.should.be.Array;
        data.url.should.equal(url);
        data.sites.length.should.be.above(2);
        (0, _isUrl2['default'])(data.sites[0]).should.be['true'];
        done();
      })['catch'](function (error) {
        return console.error(error);
      });
    });
  });

  describe('getSites method', function () {
    it('getSites should be backwards compatible', function (done) {
      this.timeout(30000);
      var url = 'http://wp.seantburke.com/sitemap.xml';
      sitemapper.getSites(url, function (err, sites) {
        sites.should.be.Array;
        (0, _isUrl2['default'])(sites[0]).should.be['true'];
        done();
      });
    });
  });
});//# sourceMappingURL=test.map