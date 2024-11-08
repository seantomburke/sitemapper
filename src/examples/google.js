import Sitemapper from '../assets/sitemapper.js';

const Google = new Sitemapper({
  url: 'https://www.google.com/work/sitemap.xml',
  debug: false,
  timeout: 15000, // 15 seconds
});

Google.fetch()
  .then((data) => console.log(data.sites)) // eslint-disable-line no-console
  .catch((error) => console.log(error)); // eslint-disable-line no-console
