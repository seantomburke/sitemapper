##Sitemap-parser

=================
Parse through sitemaps to get all the urls for your crawler.

####Simple Implementation

    var sitemap = require("sitemap-parser");

	sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(err, sites){
		console.log(err, sites);
	});

