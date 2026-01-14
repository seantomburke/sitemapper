import 'async';
import 'assert';
import 'should';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple function to validate URLs using the URL object
function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

import Sitemapper from '../../lib/assets/sitemapper.js';
import { SitemapperResponse } from '../../sitemapper.js';
let sitemapper: Sitemapper;

describe('Local File Parsing', function () {
  beforeEach(() => {
    sitemapper = new Sitemapper();
  });

  describe('isLocalFile method', function () {
    it('should return false for HTTP URLs', () => {
      sitemapper.isLocalFile('http://example.com/sitemap.xml').should.be.false;
    });

    it('should return false for HTTPS URLs', () => {
      sitemapper.isLocalFile('https://example.com/sitemap.xml').should.be.false;
    });

    it('should return false for non-existent file paths', () => {
      sitemapper.isLocalFile('/non/existent/file.xml').should.be.false;
    });

    it('should return true for existing local files', () => {
      const testFile = path.join(__dirname, 'test-sitemap.xml');
      sitemapper.isLocalFile(testFile).should.be.true;
    });

    it('should return false for empty or null input', () => {
      sitemapper.isLocalFile('').should.be.false;
      sitemapper.isLocalFile(null as any).should.be.false;
      sitemapper.isLocalFile(undefined as any).should.be.false;
    });
  });

  describe('Local sitemap file parsing', function () {
    it('should parse a local sitemap.xml file', function (done) {
      const testFile = path.join(__dirname, 'test-sitemap.xml');
      sitemapper
        .fetch(testFile)
        .then((data) => {
          data.sites.should.be.Array;
          data.url.should.equal(testFile);
          data.sites.length.should.equal(3);
          data.sites.should.containEql('https://example.com/');
          data.sites.should.containEql('https://example.com/page1');
          data.sites.should.containEql('https://example.com/page2');
          data.sites.forEach((site) => {
            isUrl(site as string).should.be.true;
          });
          done();
        })
        .catch((error) => {
          console.error('Test failed:', error);
          done(error);
        });
    });

    it('should handle local sitemapindex files', function (done) {
      const testFile = path.join(__dirname, 'test-sitemap-index.xml');
      sitemapper
        .fetch(testFile)
        .then((data) => {
          data.sites.should.be.Array;
          data.url.should.equal(testFile);
          // Note: This will attempt to fetch the child sitemaps as URLs
          // which may fail, but the structure should be parsed
          done();
        })
        .catch((error) => {
          console.error('Test failed:', error);
          done(error);
        });
    });

    it('should work with fields option for local files', function (done) {
      const testFile = path.join(__dirname, 'test-sitemap.xml');
      const sitemapperWithFields = new Sitemapper({
        fields: {
          loc: true,
          lastmod: true,
          priority: true,
          changefreq: true,
        },
      });

      sitemapperWithFields
        .fetch(testFile)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.length.should.equal(3);

          const firstSite = data.sites[0] as any;
          firstSite.should.have.property('loc').which.is.a.String();
          firstSite.should.have.property('lastmod').which.is.a.String();
          firstSite.should.have.property('priority').which.is.a.Number();
          firstSite.should.have.property('changefreq').which.is.a.String();

          firstSite.loc.should.equal('https://example.com/');
          firstSite.priority.should.equal(1);
          firstSite.changefreq.should.equal('monthly');

          const secondSite = data.sites[1] as any;
          secondSite.should.have.property('loc').which.is.a.String();
          secondSite.should.have.property('lastmod').which.is.a.String();
          secondSite.should.have.property('priority').which.is.a.Number();
          secondSite.should.have.property('changefreq').which.is.a.String();

          secondSite.loc.should.equal('https://example.com/page1');
          secondSite.priority.should.equal(0.8);
          secondSite.changefreq.should.equal('weekly');

          done();
        })
        .catch((error) => {
          console.error('Test failed:', error);
          done(error);
        });
    });

    it('should handle lastmod filtering for local files', function (done) {
      const testFile = path.join(__dirname, 'test-sitemap.xml');
      // Set lastmod to a timestamp after 2023-01-02
      const sitemapperWithLastmod = new Sitemapper({
        lastmod: new Date('2023-01-02T12:00:00+00:00').getTime(),
      });

      sitemapperWithLastmod
        .fetch(testFile)
        .then((data) => {
          data.sites.should.be.Array;
          // Should only include URLs with lastmod >= 2023-01-02T12:00:00
          data.sites.length.should.equal(1); // Only page2 qualifies
          data.sites.should.containEql('https://example.com/page2');
          done();
        })
        .catch((error) => {
          console.error('Test failed:', error);
          done(error);
        });
    });

    it('should handle exclusions for local files', function (done) {
      const testFile = path.join(__dirname, 'test-sitemap.xml');
      const sitemapperWithExclusions = new Sitemapper({
        exclusions: [/page1/],
      });

      sitemapperWithExclusions
        .fetch(testFile)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.length.should.equal(2);
          data.sites.should.containEql('https://example.com/');
          data.sites.should.containEql('https://example.com/page2');
          data.sites.should.not.containEql('https://example.com/page1');
          done();
        })
        .catch((error) => {
          console.error('Test failed:', error);
          done(error);
        });
    });

    it('should handle non-existent local files gracefully', function (done) {
      const nonExistentFile = path.join(__dirname, 'non-existent.xml');
      sitemapper
        .fetch(nonExistentFile)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.length.should.equal(0);
          data.errors.should.be.Array;
          data.errors.length.should.be.greaterThan(0);
          done();
        })
        .catch((error) => {
          console.error('Test failed:', error);
          done(error);
        });
    });

    it('should handle gzipped local files', function (done) {
      // Create a gzipped version of the test sitemap
      const testFile = path.join(__dirname, 'test-sitemap.xml');
      const gzippedFile = path.join(__dirname, 'test-sitemap.xml.gz');

      const content = fs.readFileSync(testFile);
      const gzippedContent = zlib.gzipSync(content);
      fs.writeFileSync(gzippedFile, gzippedContent);

      sitemapper
        .fetch(gzippedFile)
        .then((data) => {
          data.sites.should.be.Array;
          data.sites.length.should.equal(3);
          data.sites.should.containEql('https://example.com/');
          data.sites.should.containEql('https://example.com/page1');
          data.sites.should.containEql('https://example.com/page2');

          // Clean up
          fs.unlinkSync(gzippedFile);
          done();
        })
        .catch((error) => {
          // Clean up even on failure
          if (fs.existsSync(gzippedFile)) {
            fs.unlinkSync(gzippedFile);
          }
          console.error('Test failed:', error);
          done(error);
        });
    });
  });
});
