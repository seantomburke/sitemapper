##Sitemap-parser
=================

Parse through sitemaps to get all the urls for your crawler.
`sitemaps

``Simple Implementation

    var sitemap = require("sitemap-parser");

    sitemap.parse("http://www.cbs.com/sitemaps/video/video_sitemap_index.xml", function(err, data){
    		console.log(data);
    		//data
    		//urls
    });

