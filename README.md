##Sitemap-parser

Parse through sitemaps to get all the urls for your crawler.

####Simple Implementation
```javascript
    var sitemap = require('sitemapper');

	sitemap.getSites('http://www.cbs.com/sitemaps/show/show_siteMap_index.xml', function(err, sites){
		if(!err){
			console.log(sites);
		}
		else {
			console.log(err);
		}
	});
```
