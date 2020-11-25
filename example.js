var Sitemapper = require('sitemapper');

// Instantiate an instance with options
var Google = new Sitemapper({
  url: 'https://www.google.com/work/sitemap.xml',
  debug: false,
  timeout: 15000 //15 seconds
});

// Then fetch
Google.fetch()
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

// Instantiate an instance with no options
var sitemapper = new Sitemapper();
sitemapper.timeout = 5000;

sitemapper.fetch('https://wp.seantburke.com/sitemap.xml')
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

sitemapper.fetch('http://www.cnn.com/sitemaps/sitemap-index.xml')
  .then(function (data) {
    console.log('sites:', data.sites, 'url', data.url);
  })
  .catch(function (error) {
    console.log(error);
  });

sitemapper.fetch('http://www.stubhub.com/new-sitemap/us/sitemap-US-en-index.xml')
  .then(function (data) {
    console.log('sites:', data.sites, 'url', data.url);
  })
  .catch(function (error) {
    console.log(error);
  });

// Version 1.0.0 example which has been deprecated.
sitemapper.getSites('https://wp.seantburke.com/sitemap.xml', function (err, sites) {
  if (!err) {
    console.log(sites);
  }
  else {
    console.log(err);
  }
});

