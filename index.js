var sitemap = require('./lib/sitemapper.js');

sitemap.getSites('http://wp.seantburke.com/sitemap.xml', function (err, sites) {
  console.log('http://wp.seantburke.com/sitemap.xml');
  if (!err) {
    console.log(sites);
  } else {
    console.log(err);
  }
});

sitemap.getSites('http://www.cnn.com/sitemaps/sitemap-index.xml', function (err, sites) {
  if (!err)console.log(sites); else console.log(err);
});

sitemap.getSites('http://www.walmart.com/sitemap_ip.xml', function (err, sites) {
  if (!err)console.log(sites); else console.log(err);
});

sitemap.getSites('http://www.rakuten.com/sitemapxml/sitemapindex.xml', function (err, sites) {
  if (!err)console.log(sites); else console.log(err);
});

