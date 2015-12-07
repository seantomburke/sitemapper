## Sitemap-parser [![Build Status](https://travis-ci.org/hawaiianchimp/sitemap-parser.svg?branch=master)](https://travis-ci.org/hawaiianchimp/sitemap-parser)

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
