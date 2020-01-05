import Sitemapper from '../assets/sitemapper.js';

const Gzip = new Sitemapper({
  url: 'https://www.imot.bg/sitemap/index.xml',
  timeout: 15000, // 15 seconds
  debug: true,
  headers: {
    'Content-type': 'gzip',
  },
  contentType: 'text',
});

Gzip.fetch()
  .then(data => console.log(data.sites)) // eslint-disable-line no-console
  .catch(error => console.log(error)); // eslint-disable-line no-console
