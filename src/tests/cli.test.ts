import { execFile } from 'child_process';
import * as path from 'path';
import { describe, it } from 'mocha';

describe('CLI: sitemapper', function (this: Mocha.Suite) {
  this.timeout(10000); // Allow up to 10 seconds for network

  it('should print URLs from the sitemap', function (done: Mocha.Done) {
    // Use a relative path from current working directory instead of __dirname
    const cliPath: string = path.resolve(process.cwd(), 'bin/sitemapper.js');
    const sitemapUrl: string = 'https://wp.seantburke.com/sitemap.xml';

    // @ts-ignore - TypeScript has trouble with Node.js execFile overloads
    execFile('node', [cliPath, sitemapUrl], (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }

      // Just check that we have some output and the expected header
      const output = stdout.toString();
      if (output.includes('Found URLs:')) {
        done();
      } else {
        done(new Error('Expected CLI output to contain "Found URLs:" header'));
      }
    });
  });
});
