import Sitemapper from '../assets/sitemapper';

// Instantiate an instance
const sitemapper = new Sitemapper({
  url: 'https://www.walmart.com/sitemap_topic.xml',
  timeout: 100,
  debug: false,
});

(async () => {
  try {
    const data = await sitemapper.fetch();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
})();
