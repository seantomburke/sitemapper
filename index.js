var sitemap = require("./lib/sitemap");

// sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(err, sites){
// 	if(!err)console.log(sites);else console.log(err);
// });

// sitemap.getSites("http://www.cnn.com/sitemaps/sitemap-index.xml", function(err,sites){
//  	if(!err)console.log(sites);else console.log(err);
// });

sitemap.getSites("http://www.walmart.com/sitemap_ip.xml", function(err,sites){
 	if(!err)console.log(sites);else console.log(err);
});

// sitemap.getSites("http://www.rakuten.com/sitemapxml/sitemapindex.xml", function(err,sites){
//  	if(!err)console.log(sites);else console.log(err);
// });

