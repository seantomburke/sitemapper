import 'async';
import 'assert';
import 'should';
import isUrl from 'is-url';

import Sitemapper from '../assets/sitemapper.js';
let sitemapper;

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

    it('should contruct with a url', () => {
      sitemapper = new Sitemapper({
        url: 'google.com',
      });
      sitemapper.url.should.equal('google.com');
    });

    it('should contruct with a timeout', () => {
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
  });

  describe('fetch Method resolves sites to array', function () {
    it('https://wp.seantburke.com/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      const url = 'https://wp.seantburke.com/sitemap.xml';
      sitemapper.fetch(url)
        .then(data => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(2);
          isUrl(data.sites[0]).should.be.true;
          done();
        })
        .catch(error => {
          console.error('Test failed');
          done();
        });
    });

    it('giberish.giberish should fail silently with an empty array', function (done) {
      this.timeout(30000);
      const url = 'http://giberish.giberish';
      sitemapper.fetch(url)
        .then(data => {
          data.sites.should.be.Array;
          done();
        })
        .catch(error => {
          console.error('Test failed');
          done();
        });
    });

    it('https://www.google.com/work/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      const url = 'https://www.google.com/work/sitemap.xml';
      sitemapper.fetch(url)
        .then(data => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(2);
          isUrl(data.sites[0]).should.be.true;
          done();
        })
        .catch(error => {
          console.error('Test failed');
          done();
        });
    });

    it('https://www.golinks.io/sitemap.xml sitemaps should be an array', function (done) {
      this.timeout(30000);
      const url = 'https://www.golinks.io/sitemap.xml';
      sitemapper.timeout = 5000;
      sitemapper.fetch(url)
        .then(data => {
          data.sites.should.be.Array;
          data.url.should.equal(url);
          data.sites.length.should.be.above(2);
          isUrl(data.sites[0]).should.be.true;
          done();
        })
        .catch(error => {
          console.error('Test failed');
          done();
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
