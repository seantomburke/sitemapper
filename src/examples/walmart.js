import Sitemapper from '../assets/sitemapper.js';

const Walmart = new Sitemapper({
  url: 'https://www.walmart.com/sitemap_browse.xml',
  timeout: 15000, // 15 seconds
  progress: true,
});

Walmart.fetch()
  .then(data => console.log(data.sites)) // eslint-disable-line no-console
  .catch(error => console.log(error)); // eslint-disable-line no-console
