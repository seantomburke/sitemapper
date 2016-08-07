/*global describe*/
var async = require('async'),
  assert = require('assert'),
  should = require('should'),
  sitemapper = require('./sitemapper.js'),
  isurl = require('is-url');

var sitemaps = ['http://www.walmart.com/sitemaps.xml', 'http://www.cbs.com/sitemaps.xml'];

(function () {
  sitemapper.getSites('https://www.google.com/work/sitemap.xml', function (err, sites) {
    if (sites) {
      sitemaps = sites;
      sites.should.be.Array;
    } else {
      console.log(err);
    }
  });
})();

var sitemaps;
describe('sitemap', function () {
  describe('getSites', function () {

    it('Google sitemaps should be an array', function (done) {
      this.timeout(30000);
      sitemapper.getSites('https://www.google.com/work/sitemap.xml', function (err, sites) {
        if (sites) {
          sitemaps = sites;
          sites.should.be.Array;
          sites.length.should.be.above(2);
        } else {
          console.log(err);
        }
        done();
      });
    });

    it('Seantburke.com sitemaps should be an array', function (done) {
      this.timeout(30000);
      sitemapper.getSites('http://wp.seantburke.com/sitemap.xml', function (err, sites) {
        if (sites) {
          sitemaps = sites;
          sites.should.be.Array;
          sites.length.should.be.above(2);
        } else {
          console.log(err);
        }
        done();
      });
    });
  });

  describe('URL checks', function () {
    for (var key in sitemaps) {
      (function (site) {
        it(site + ' should be a URL', function () {
          isurl(site).should.be.true;
        });
      })(sitemaps[key]);
    }
  });

  describe('Sitemapper class', function () {
    it('should have parse method', () => {
      sitemapper.parse.should.be.Function;
    });

    it('should have getSites method', function () {
      sitemapper.getSites.should.be.Function;
    });
  });
});
