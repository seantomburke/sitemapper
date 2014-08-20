var sitemap = require("./lib/sitemap");

sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(sites){
	console.log(sites);
});

sitemap.getSites("http://www.cnn.com/sitemaps/sitemap-index.xml", function(err,sites){
 	console.log(sites);
 });

sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(err,sites){
 	console.log(sites);
 });

sitemap.getSites("http://www.walmart.com/sitemap_tp.xml", function(err,sites){
 	console.log(sites);
 });