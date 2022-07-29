import Sitemapper from 'sitemapper';

(async () => {
  const sitemapper = new Sitemapper();

  const Google = new Sitemapper({
    url: 'https://www.google.com/work/sitemap.xml',
    debug: false,
    timeout: 15000, // 15 seconds
  });

  try {
    const data = await Google.fetch();
    console.log(data.sites);
  } catch(error) {
    console.log(error);
  }

  sitemapper.timeout = 5000;

  try {
    const { url, sites } = await sitemapper.fetch('https://wp.seantburke.com/sitemap.xml');
    console.log(`url:${url}`, 'sites:', sites);
  } catch(error) {
    console.log(error)
  }

  try {
    const { url, sites } = await sitemapper.fetch('http://www.cnn.com/sitemaps/sitemap-index.xml');
    console.log(`url:${url}`, 'sites:', sites);
  } catch(error) {
    console.log(error)
  }

  try {
    const { url, sites } = await sitemapper.fetch('http://www.stubhub.com/new-sitemap/us/sitemap-US-en-index.xml');
    console.log(`url:${url}`, 'sites:', sites);
  } catch(error) {
    console.log(error)
  }
})();
