var sitemap = require('sitemapper');

sitemap.getSites('http://wp.seantburke.com/sitemap.xml', function(err, sites) {
    if(!err) {
        console.log(sites);
    }
    else {
        console.log(err);
    }
});
