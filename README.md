<!-- Header image with dark/light theme support -->
<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://capsule-render.vercel.app/api?type=venom&height=300&color=gradient&text=Sitemapper&section=header&reversal=false&textBg=false&fontColor=DDDDDD&desc=A%20powerful%20XML%20sitemap%20parser%20for%20Node.js&descAlignY=66&fontAlignY=45&animation=fadeIn&descSize=24"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://capsule-render.vercel.app/api?type=venom&height=300&color=gradient&text=Sitemapper&section=header&reversal=false&textBg=false&fontColor=22222&desc=A%20powerful%20XML%20sitemap%20parser%20for%20Node.js&descAlignY=66&fontAlignY=45&animation=fadeIn&descSize=24"
  />
  <img
    alt="Sitemapper - A powerful XML sitemap parser for Node.js"
    src="https://capsule-render.vercel.app/api?type=venom&height=300&color=gradient&text=Sitemapper&section=header&reversal=false&textBg=false&fontColor=22222&desc=A%20powerful%20XML%20sitemap%20parser%20for%20Node.js&descAlignY=66&fontAlignY=45&animation=fadeIn&descSize=24"
    width="100%"
  />
</picture>

<div align="center">

[![Test](https://github.com/seantomburke/sitemapper/actions/workflows/test.yml/badge.svg?branch=master&event=push)](https://github.com/seantomburke/sitemapper/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/seantomburke/sitemapper?token=XhiEgaHFWL)](https://codecov.io/gh/seantomburke/sitemapper)
[![npm version](https://badge.fury.io/js/sitemapper.svg)](https://badge.fury.io/js/sitemapper)
[![Monthly Downloads](https://img.shields.io/npm/dm/sitemapper.svg)](https://www.npmjs.com/package/sitemapper)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/sitemapper)](https://libraries.io/npm/sitemapper)
[![License MIT](https://img.shields.io/github/license/seantomburke/sitemapper)](https://github.com/seantomburke/sitemapper/blob/master/LICENSE)

</div>

## 📋 Overview

Sitemapper is a Node.js module that makes it easy to parse XML sitemaps. It supports single sitemaps, sitemap indexes with multiple sitemaps, and various sitemap formats including image and video sitemaps.

## 🚀 Installation

```bash
# Using npm
npm install sitemapper --save

# Using yarn
yarn add sitemapper

# Using pnpm
pnpm add sitemapper
```

## 🏃‍♂️ Quick Start

### Module Usage

```javascript
import Sitemapper from 'sitemapper';

const sitemap = new Sitemapper({
  timeout: 10000, // 10 second timeout
});

sitemap
  .fetch('https://gosla.sh/sitemap.xml')
  .then(({ url, sites }) => {
    console.log('Sites: ', sites);
  })
  .catch((error) => console.error(error));
```

### CLI Usage

You can also use Sitemapper directly from the command line:

```bash
# Using npx
npx sitemapper https://gosla.sh/sitemap.xml
```

## 💻 Examples

### Promise Example

```javascript
import Sitemapper from 'sitemapper';

const sitemap = new Sitemapper();

sitemap
  .fetch('https://wp.seantburke.com/sitemap.xml')
  .then(({ url, sites }) => {
    console.log(`Sitemap URL: ${url}`);
    console.log(`Found ${sites.length} URLs`);
    console.log(sites);
  })
  .catch((error) => console.error(error));
```

### Async/Await Example

```javascript
import Sitemapper from 'sitemapper';

async function parseSitemap() {
  const Google = new Sitemapper({
    url: 'https://www.google.com/work/sitemap.xml',
    timeout: 15000, // 15 seconds
    concurrency: 10,
  });

  try {
    const { sites } = await Google.fetch();
    console.log(`Found ${sites.length} URLs in the sitemap`);
    console.log(sites);
  } catch (error) {
    console.error('Error fetching sitemap:', error);
  }
}

parseSitemap();
```

### Advanced Example with Proxy

```javascript
import Sitemapper from 'sitemapper';
import { HttpsProxyAgent } from 'hpagent';

const sitemapper = new Sitemapper({
  url: 'https://gosla.sh/sitemap.xml',
  timeout: 30000,
  concurrency: 5,
  retries: 2,
  debug: true,
  proxyAgent: new HttpsProxyAgent({
    proxy: 'http://localhost:8080',
  }),
  requestHeaders: {
    'User-Agent': 'Mozilla/5.0 (compatible; SitemapperBot/1.0)',
  },
  fields: {
    loc: true,
    lastmod: true,
    sitemap: true,
  },
});

sitemapper
  .fetch()
  .then(({ sites }) => console.log(sites))
  .catch((error) => console.error(error));
```

### Example with globalTimeout

```javascript
import Sitemapper from 'sitemapper';

const sitemap = new Sitemapper({
  url: 'https://example.com/sitemap.xml',
  globalTimeout: 10 * 60 * 1000, // Stop entire crawl after 10 minutes
  timeout: 5000, // Per-request timeout
  concurrency: 10,
});

sitemap
  .fetch()
  .then(({ sites, errors }) => {
    console.log('Sites:', sites);
    console.log('Errors:', errors);
  })
  .catch((err) => {
    console.error('Crawl aborted:', err);
  });
```

The globalTimeout feature ensures that the entire sitemap crawling process will automatically stop after the specified time. This prevents the crawler from running indefinitely in case of irregular or deeply nested sitemap structures, helping you get partial results without risking hangs or infinite loops.

## ⚙️ Configuration Options

Sitemapper can be customized with the following options:

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td>String</td>
      <td><code>undefined</code></td>
      <td>The URL of the sitemap to parse</td>
    </tr>
    <tr>
      <td><code>timeout</code></td>
      <td>Number</td>
      <td><code>15000</code></td>
      <td>Maximum timeout in milliseconds for each request</td>
    </tr>
    <tr>
      <td><code>globalTimeout</code></td>
      <td>Number</td>
      <td><code>undefined</code></td>
      <td>Optional timout parameter in milliseconds which denotes the timeout of the entire process. By default it will be undefined , if no value is specified.</td>
    </tr>
    <tr>
      <td><code>concurrency</code></td>
      <td>Number</td>
      <td><code>10</code></td>
      <td>Maximum number of concurrent requests when crawling multiple sitemaps</td>
    </tr>
    <tr>
      <td><code>retries</code></td>
      <td>Number</td>
      <td><code>0</code></td>
      <td>Number of retry attempts for failed requests</td>
    </tr>
    <tr>
      <td><code>debug</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>Enable debug logging</td>
    </tr>
    <tr>
      <td><code>rejectUnauthorized</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>Reject invalid SSL certificates (like self-signed or expired)</td>
    </tr>
    <tr>
      <td><code>requestHeaders</code></td>
      <td>Object</td>
      <td><code>{}</code></td>
      <td>Additional HTTP headers to include with requests</td>
    </tr>
    <tr>
      <td><code>lastmod</code></td>
      <td>Number</td>
      <td><code>undefined</code></td>
      <td>Only return URLs with lastmod timestamp newer than this value</td>
    </tr>
    <tr>
      <td><code>proxyAgent</code></td>
      <td>HttpProxyAgent | HttpsProxyAgent</td>
      <td><code>undefined</code></td>
      <td>Instance of <code>hpagent</code> for proxy support</td>
    </tr>
    <tr>
      <td><code>exclusions</code></td>
      <td>Array&lt;RegExp&gt;</td>
      <td><code>[]</code></td>
      <td>Array of regex patterns to exclude URLs from results</td>
    </tr>
    <tr>
      <td><code>fields</code></td>
      <td>Object</td>
      <td><code>undefined</code></td>
      <td>Specify which fields to include in the results (see below)</td>
    </tr>
  </tbody>
</table>

### Available Fields

**Important**: When using the `fields` option, the return format changes from an array of URL strings to an array of objects containing your selected fields.

For the `fields` option, specify which fields to include by setting them to `true`:

<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>loc</code></td>
      <td>URL location of the page</td>
    </tr>
    <tr>
      <td><code>sitemap</code></td>
      <td>URL of the sitemap containing this URL (useful for sitemap indexes)</td>
    </tr>
    <tr>
      <td><code>lastmod</code></td>
      <td>Date of last modification</td>
    </tr>
    <tr>
      <td><code>changefreq</code></td>
      <td>How frequently the page is likely to change</td>
    </tr>
    <tr>
      <td><code>priority</code></td>
      <td>Priority of this URL relative to other URLs</td>
    </tr>
    <tr>
      <td><code>image:loc</code></td>
      <td>URL location of the image (for image sitemaps)</td>
    </tr>
    <tr>
      <td><code>image:title</code></td>
      <td>Title of the image (for image sitemaps)</td>
    </tr>
    <tr>
      <td><code>image:caption</code></td>
      <td>Caption of the image (for image sitemaps)</td>
    </tr>
    <tr>
      <td><code>video:title</code></td>
      <td>Title of the video (for video sitemaps)</td>
    </tr>
    <tr>
      <td><code>video:description</code></td>
      <td>Description of the video (for video sitemaps)</td>
    </tr>
    <tr>
      <td><code>video:thumbnail_loc</code></td>
      <td>Thumbnail URL of the video (for video sitemaps)</td>
    </tr>
  </tbody>
</table>

#### Example Default Output (without fields)

```javascript
// Returns an array of URL strings
[
  'https://wp.seantburke.com/?p=234',
  'https://wp.seantburke.com/?p=231',
  'https://wp.seantburke.com/?p=185',
];
```

#### Example Output with Fields

```javascript
// Returns an array of objects
[
  {
    loc: 'https://wp.seantburke.com/?p=234',
    lastmod: '2015-07-03T02:05:55+00:00',
    priority: 0.8,
  },
  {
    loc: 'https://wp.seantburke.com/?p=231',
    lastmod: '2015-07-03T01:47:29+00:00',
    priority: 0.8,
  },
];
```

## 🧩 CLI Usage

Sitemapper includes a simple CLI tool for basic sitemap parsing directly from the command line:

```bash
npx sitemapper <sitemap-url>
```

### Example

```bash
npx sitemapper https://gosla.sh/sitemap.xml
```

#### Output

The CLI will display the sitemap URL and list all URLs found in the sitemap:

```
Sitemap URL: https://gosla.sh/sitemap.xml

Found URLs:
1. https://gosla.sh/page1
2. https://gosla.sh/page2
3. https://gosla.sh/page3
...
```

### CLI Options

Currently, the CLI supports the `--timeout` parameter to set the request timeout in milliseconds:

```bash
npx sitemapper https://gosla.sh/sitemap.xml --timeout=5000
```

> **Note**: The CLI implementation is basic and does not yet support all options available in the JavaScript API. More advanced features like fields filtering, concurrency control, and different output formats require using the JavaScript API directly.

## 🤝 Contributing

Contributions from experienced engineers are highly valued. When contributing, please consider:

### Guidelines

- Maintain backward compatibility where possible
- Consider performance implications, particularly for large sitemaps
- Add TypeScript types
- Add tests for your change
- Update documentation and examples
- Check for typos
- Code should pass ESLint, Prettier, Spell Check and TypeScript checks
- Try not to bloat the main dependencies with new packages, dev dependencies are fine
- If adding packages, make sure to run `npm install` with the latest NPM version to update package-lock.json

### Pull Request Process

- PRs should be focused on a single concern/feature
- Include sufficient context in the PR description
- Reference any relevant issues
- Run `npm test` locally to verify your changes pass the test
  - Sometimes the tests will fail since they reference real world sitemaps. Try running it again.
- PRs will not run github actions by default, they need to be run manually by @seantomburke

For substantial changes, consider opening an issue for discussion before implementation.

> **Note**: The CI pipeline enforces TypeScript type checking, linting rules, formatting standards, and test coverage thresholds.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
