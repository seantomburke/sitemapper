import Sitemapper from '../assets/sitemapper.js';

const sitemapper = new Sitemapper({
  progress: true,
  debug: true,
  timeout: 60000,
});

// const Google = new Sitemapper({
//   url: 'https://www.google.com/work/sitemap.xml',
//   timeout: 15000, // 15 seconds
//   progress: true,
// });

// Google.fetch()
//   .then(data => console.log(data.sites))
//   .catch(error => console.log(error));

sitemapper.timeout = 60000;

sitemapper.fetch('http://wp.seantburke.com/sitemap.xml')
  .then(({ url, sites }) => console.log(`url:${url}`, 'sites:', sites))
  .catch(error => console.log(error));

sitemapper.fetch('https://www.cnn.com/sitemaps/cnn/index.xml')
  .then(data => console.log(data))
  .catch(error => console.log(error));

sitemapper.fetch('http://www.stubhub.com/new-sitemap/us/sitemap-US-en-index.xml')
  .then((data) => console.log(data))
  .catch(error => console.log(error));
