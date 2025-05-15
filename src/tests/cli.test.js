const { execFile } = require('child_process');
const path = require('path');
const assert = require('assert');

describe('CLI: sitemapper', function () {
  this.timeout(10000); // Allow up to 10 seconds for network

  it('should print URLs from the sitemap', function (done) {
    const cliPath = path.resolve(__dirname, '../../bin/sitemapper.js');
    const sitemapUrl = 'https://wp.seantburke.com/sitemap.xml';

    execFile('node', [cliPath, sitemapUrl], (error, stdout, stderr) => {
      assert.strictEqual(error, null, `CLI errored: ${stderr}`);
      // Check that output contains at least one expected URL
      const urls = stdout.split(/\s+/).filter((line) => {
        try {
          const parsedUrl = new URL(line);
          return parsedUrl.hostname === 'wp.seantburke.com';
        } catch (e) {
          console.error(e);
          return false;
        }
      });
      assert(
        urls.length > 0,
        'Output should contain at least one URL with the expected hostname.'
      );
      // Optionally, check for the "Found URLs:" header
      assert(
        stdout.includes('Found URLs:'),
        'Output should contain the "Found URLs:" header.'
      );
      done();
    });
  });
});
