import Sitemapper from '../sitemapper.js';

const sitemapper = new Sitemapper();

const Google = new Sitemapper({
  url: 'https://www.google.com/work/sitemap.xml',
  timeout: 15000, // 15 seconds
});

Google.getSites()
  .then(data => console.log(data.sites))
  .catch(error => console.log(error));

sitemapper.timeout = 5000;

sitemapper.getSites('http://wp.seantburke.com/sitemap.xml')
  .then(({ url, sites }) => console.log(`url:${url}`, 'sites:', sites))
  .catch(error => console.log(error));

sitemapper.getSites('http://www.cnn.com/sitemaps/sitemap-index.xml')
  .then(data => console.log(data))
  .catch(error => console.log(error));

sitemapper.getSites('http://www.stubhub.com/new-sitemap/us/sitemap-US-en-index.xml')
  .then((data) => console.log(data))
  .catch(error => console.log(error));
