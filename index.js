var Entry = require("./lib/entry");

var CBS = new Entry("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml");
var walmart = new Entry("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml");

console.log(CBS);
console.log(walmart);


console.log(CBS.getSites());
console.log(walmart.getSites());