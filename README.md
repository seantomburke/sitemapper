## Sitemap-parser
[![Code Scanning](https://github.com/seantomburke/sitemapper/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/seantomburke/sitemapper/actions/workflows/codeql-analysis.yml)
[![NPM Publish](https://github.com/seantomburke/sitemapper/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/seantomburke/sitemapper/actions/workflows/npm-publish.yml)
[![Version Bump](https://github.com/seantomburke/sitemapper/actions/workflows/version-bump.yml/badge.svg?branch=master&event=push)](https://github.com/seantomburke/sitemapper/actions/workflows/version-bump.yml)
[![Test](https://github.com/seantomburke/sitemapper/actions/workflows/test.yml/badge.svg?branch=master&event=push)](https://github.com/seantomburke/sitemapper/actions/workflows/test.yml)
[![Build Status](https://travis-ci.org/seantomburke/sitemapper.svg?branch=master)](https://travis-ci.org/seantomburke/sitemapper)
[![Codecov](https://img.shields.io/codecov/c/github/seantomburke/sitemapper?token=XhiEgaHFWL)](https://codecov.io/gh/seantomburke/sitemapper)
[![CodeFactor](https://www.codefactor.io/repository/github/seantomburke/sitemapper/badge)](https://www.codefactor.io/repository/github/seantomburke/sitemapper)
[![GitHub license](https://img.shields.io/github/license/seantomburke/sitemapper)](https://github.com/seantomburke/sitemapper/blob/master/LICENSE)
[![GitHub release date](https://img.shields.io/github/release-date/seantomburke/sitemapper.svg)](https://github.com/seantomburke/sitemapper/releases)
[![Inline docs](https://inch-ci.org/github/seantomburke/sitemapper.svg?branch=master&style=shields)](https://inch-ci.org/github/seantomburke/sitemapper)
[![LGTM Alerts](https://img.shields.io/lgtm/alerts/github/seantomburke/sitemapper)](https://lgtm.com/projects/g/seantomburke/sitemapper/?mode=list)
[![LGTM Grade](https://img.shields.io/lgtm/grade/javascript/github/seantomburke/sitemapper)](https://lgtm.com/projects/g/seantomburke/sitemapper/context:javascript)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/sitemapper)](https://libraries.io/npm/sitemapper)
[![license](https://img.shields.io/github/license/seantomburke/sitemapper.svg)](https://github.com/seantomburke/sitemapper/blob/main/LICENSE)
[![Monthly Downloads](https://img.shields.io/npm/dm/sitemapper.svg)](https://www.npmjs.com/package/sitemapper)
[![npm version](https://badge.fury.io/js/sitemapper.svg)](https://badge.fury.io/js/sitemapper)
[![release](https://img.shields.io/github/release/seantomburke/sitemapper.svg)](https://github.com/seantomburke/sitemapper/releases/latest)
[![scrutinizer](https://img.shields.io/scrutinizer/quality/g/seantomburke/sitemapper.svg?style=flat-square)](https://scrutinizer-ci.com/g/seantomburke/sitemapper/)

Parse through a sitemaps xml to get all the urls for your crawler.
## Version 2

### Installation
```bash
npm install sitemapper --save
```

### Simple Example
```javascript
const Sitemapper = require('sitemapper');

const sitemap = new Sitemapper();

sitemap.fetch('https://wp.seantburke.com/sitemap.xml').then(function(sites) {
  console.log(sites);
});

```
### Examples in ES6
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

sitemapper.fetch('https://wp.seantburke.com/sitemap.xml')
  .then(({ url, sites }) => console.log(`url:${url}`, 'sites:', sites))
  .catch(error => console.log(error));
```

# Options

You can add options on the initial Sitemapper object when instantiating it.

+ `requestHeaders`: (Object) - Additional Request Headers (e.g. `User-Agent`)
+ `timeout`: (Number) - Maximum timeout in ms for a single URL. Default: 15000 (15 seconds)
+ `url`: (String) - Sitemap URL to crawl
+ `debug`: (Boolean) - Enables/Disables debug console logging. Default: False
+ `concurrency`: (Number) - Sets the maximum number of concurrent sitemap crawling threads. Default: 10
+ `retries`: (Number) - Sets the maximum number of retries to attempt in case of an error response (e.g. 404 or Timeout). Default: 0
+ `rejectUnauthorized`: (Boolean) - If true, it will throw on invalid certificates, such as expired or self-signed ones. Default: True
+ `lastmod`: (Number) - Timestamp of the minimum lastmod value allowed for returned urls
+ `field` : (Object) - An object of fields to be returned from the sitemap. For Example: `{ loc: true, lastmod: true, changefreq: true, priority: true }`. Leaving a field out has the same effect as `field: false`. If not specified sitemapper defaults to returning the 'classic' array of urls.

```javascript

const sitemapper = new Sitemapper({
  url: 'https://art-works.community/sitemap.xml',
  rejectUnauthorized: true,
  timeout: 15000,
  requestHeaders: {
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0'
  }
});

```

An example using all available options:

```javascript

const sitemapper = new Sitemapper({
  url: 'https://art-works.community/sitemap.xml',
  timeout: 15000,
  requestHeaders: {
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:81.0) Gecko/20100101 Firefox/81.0'
  },
  debug: true,
  concurrency: 2,
  retries: 1,
});

```

### Examples in ES5
```javascript
var Sitemapper = require('sitemapper');

var Google = new Sitemapper({
  url: 'https://www.google.com/work/sitemap.xml',
  timeout: 15000 //15 seconds
});

Google.fetch()
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });


// or


var sitemapper = new Sitemapper();

sitemapper.timeout = 5000;
sitemapper.fetch('https://wp.seantburke.com/sitemap.xml')
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

```

## Version 1

```bash
npm install sitemapper@1.1.1 --save
```

### Simple Example

```javascript
var Sitemapper = require('sitemapper');

var sitemapper = new Sitemapper();

sitemapper.getSites('https://wp.seantburke.com/sitemap.xml', function(err, sites) {
    if (!err) {
     console.log(sites);
    }
});
```
