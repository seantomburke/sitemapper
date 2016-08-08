## Sitemap-parser 
[![Build Status](https://travis-ci.org/hawaiianchimp/sitemapper.svg?branch=master)](https://travis-ci.org/hawaiianchimp/sitemapper) [![Monthly Downloads](https://img.shields.io/npm/dm/sitemapper.svg)](https://www.npmjs.com/package/sitemapper)
[![npm version](https://badge.fury.io/js/sitemapper.svg)](https://badge.fury.io/js/sitemapper)
[![dependencies Status](https://david-dm.org/hawaiianchimp/sitemapper/status.svg)](https://david-dm.org/hawaiianchimp/sitemapper)
[![Inline docs](http://inch-ci.org/github/hawaiianchimp/sitemapper.svg?branch=master)](http://inch-ci.org/github/hawaiianchimp/sitemapper)

Parse through sitemaps to get all the urls for your crawler.

#### Simple Implementation
```javascript
var sitemap = require('sitemapper');

sitemap.getSites('http://wp.seantburke.com/sitemap.xml', function(err, sites) {
	if(!err) {
		console.log(sites);
	}
	else {
		console.log(err);
	}
});
```
