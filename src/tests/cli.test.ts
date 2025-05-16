import { execFile } from 'child_process';
import * as path from 'path';
import * as assert from 'assert';
import { describe, it } from 'mocha';

describe('CLI: sitemapper', function (this: Mocha.Suite) {
  this.timeout(10000); // Allow up to 10 seconds for network

  it('should print URLs from the sitemap', function (done: Mocha.Done) {
    const cliPath: string = path.resolve(__dirname, '../../bin/sitemapper.js');
    const sitemapUrl: string = 'https://wp.seantburke.com/sitemap.xml';

    // @ts-ignore - TypeScript has trouble with Node.js execFile overloads
    execFile('node', [cliPath, sitemapUrl], (error, stdout, stderr) => {
      assert.strictEqual(error, null, `CLI errored: ${stderr}`);
      // Check that output contains at least one expected URL
      const urls: string[] = stdout.split(/\s+/).filter((line: string) => {
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
