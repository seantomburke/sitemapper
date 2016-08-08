var Sitemapper = require('sitemapper');

var sitemap = new Sitemapper();

var Google = new Sitemapper({
  url: 'https://www.google.com/work/sitemap.xml',
  timeout: 15000 //15 seconds
});

Google.fetch()
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  });

sitemapper.timeout = 5000;

sitemapper.fetch('http://wp.seantburke.com/sitemap.xml')
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
