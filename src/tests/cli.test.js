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
      assert(
        stdout.includes('https://wp.seantburke.com/'),
        'Output should contain at least the base URL.'
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
