## Sitemap-parser

[![Code Scanning](https://github.com/seantomburke/sitemapper/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/seantomburke/sitemapper/actions/workflows/codeql-analysis.yml)
[![NPM Publish](https://github.com/seantomburke/sitemapper/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/seantomburke/sitemapper/actions/workflows/npm-publish.yml)
[![Version Bump](https://github.com/seantomburke/sitemapper/actions/workflows/version-bump.yml/badge.svg?branch=master&event=push)](https://github.com/seantomburke/sitemapper/actions/workflows/version-bump.yml)
[![Test](https://github.com/seantomburke/sitemapper/actions/workflows/test.yml/badge.svg?branch=master&event=push)](https://github.com/seantomburke/sitemapper/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/seantomburke/sitemapper?token=XhiEgaHFWL)](https://codecov.io/gh/seantomburke/sitemapper)
[![CodeFactor](https://www.codefactor.io/repository/github/seantomburke/sitemapper/badge)](https://www.codefactor.io/repository/github/seantomburke/sitemapper)
[![GitHub license](https://img.shields.io/github/license/seantomburke/sitemapper)](https://github.com/seantomburke/sitemapper/blob/master/LICENSE)
[![GitHub release date](https://img.shields.io/github/release-date/seantomburke/sitemapper.svg)](https://github.com/seantomburke/sitemapper/releases)
[![Inline docs](https://inch-ci.org/github/seantomburke/sitemapper.svg?branch=master&style=shields)](https://inch-ci.org/github/seantomburke/sitemapper)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/sitemapper)](https://libraries.io/npm/sitemapper)
[![license](https://img.shields.io/github/license/seantomburke/sitemapper.svg)](https://github.com/seantomburke/sitemapper/blob/main/LICENSE)
[![Monthly Downloads](https://img.shields.io/npm/dm/sitemapper.svg)](https://www.npmjs.com/package/sitemapper)
[![npm version](https://badge.fury.io/js/sitemapper.svg)](https://badge.fury.io/js/sitemapper)
[![release](https://img.shields.io/github/release/seantomburke/sitemapper.svg)](https://github.com/seantomburke/sitemapper/releases/latest)
[![scrutinizer](https://img.shields.io/scrutinizer/quality/g/seantomburke/sitemapper.svg?style=flat-square)](https://scrutinizer-ci.com/g/seantomburke/sitemapper/)

Parse through a sitemaps xml to get all the urls for your crawler.

## Installation

```bash
npm install sitemapper --save
```

## Simple Example

```javascript
const Sitemapper = require('sitemapper');

const sitemap = new Sitemapper();

sitemap.fetch('https://wp.seantburke.com/sitemap.xml').then(function (sites) {
  console.log(sites);
});
```

## Examples

```javascript
import Sitemapper from 'sitemapper';

(async () => {
  const Google = new Sitemapper({
    url: 'https://www.google.com/work/sitemap.xml',
    timeout: 15000, // 15 seconds
  });

  try {
    const { sites } = await Google.fetch();
    console.log(sites);
  } catch (error) {
    console.log(error);
  }
})();

// or

const sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper
  .fetch('https://wp.seantburke.com/sitemap.xml')
  .then(({ url, sites }) => console.log(`url:${url}`, 'sites:', sites))
  .catch((error) => console.log(error));
```

## Options

You can add options on the initial Sitemapper object when instantiating it.

- `requestHeaders`: (Object) - Additional Request Headers (e.g. `User-Agent`)
- `timeout`: (Number) - Maximum timeout in ms for a single URL. Default: 15000 (15 seconds)
- `url`: (String) - Sitemap URL to crawl
- `debug`: (Boolean) - Enables/Disables debug console logging. Default: False
- `concurrency`: (Number) - Sets the maximum number of concurrent sitemap crawling threads. Default: 10
- `retries`: (Number) - Sets the maximum number of retries to attempt in case of an error response (e.g. 404 or Timeout). Default: 0
- `rejectUnauthorized`: (Boolean) - If true, it will throw on invalid certificates, such as expired or self-signed ones. Default: True
- `lastmod`: (Number) - Timestamp of the minimum lastmod value allowed for returned urls
- `proxyAgent`: (HttpProxyAgent|HttpsProxyAgent) - instance of npm "hpagent" HttpProxyAgent or HttpsProxyAgent to be passed to npm "got"
- `exclusions`: (Array<RegExp>) - Array of regex patterns to exclude URLs from being processed
- `fields`: (Object) - An object of fields to be returned from the sitemap. Leaving a field out has the same effect as `<field>: false`. If not specified sitemapper defaults to returning the 'classic' array of urls. Available fields:
  - `loc`: (Boolean) - The URL location of the page
  - `sitemap`: (Boolean) - The URL of the sitemap containing the URL, useful if <sitemapindex> was used in the sitemap
  - `lastmod`: (Boolean) - The date of last modification of the page
  - `changefreq`: (Boolean) - How frequently the page is likely to change
  - `priority`: (Boolean) - The priority of this URL relative to other URLs on your site
  - `image:loc`: (Boolean) - The URL location of the image (for image sitemaps)
  - `image:title`: (Boolean) - The title of the image (for image sitemaps)
  - `image:caption`: (Boolean) - The caption of the image (for image sitemaps)
  - `video:title`: (Boolean) - The title of the video (for video sitemaps)
  - `video:description`: (Boolean) - The description of the video (for video sitemaps)
  - `video:thumbnail_loc`: (Boolean) - The thumbnail URL of the video (for video sitemaps)

For Example:

```
fields: {
  loc: true,
  lastmod: true,
  changefreq: true,
  priority: true,
}
```

Leaving a field out has the same effect as `<field>: false`. If not specified sitemapper defaults to returning the 'classic' array of urls.

An example using all available options:

```javascript
import { HttpsProxyAgent } from 'hpagent';

const sitemapper = new Sitemapper({
  requestHeaders: {
    'User-Agent':
      'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0',
  },
  timeout: 15000,
  url: 'https://art-works.community/sitemap.xml',
  debug: true,
  concurrency: 2,
  retries: 1,
  lastmod: 1600000000000,
  proxyAgent: new HttpsProxyAgent({
    proxy: 'http://localhost:8080',
  }),
  exclusions: [/\/v1\//, /scary/],
  rejectUnauthorized: false,
  fields: {
    loc: true,
    lastmod: true,
    priority: true,
    changefreq: true,
    sitemap: true,
  },
});
```
