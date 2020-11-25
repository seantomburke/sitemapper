import Sitemapper from '../assets/sitemapper';

// Instantiate an instance
const sitemapper = new Sitemapper({
  url: 'https://www.walmart.com/sitemap_topic.xml', // url to crawl
  timeout: 10000, // 10 seconds
  debug: false, // don't show debug logs
});

(async () => {
  try {
    const data = await sitemapper.fetch();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
})();
