"use strict";

var _sitemapper = _interopRequireDefault(require("../assets/sitemapper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sitemapper = new _sitemapper["default"]({
  progress: true,
  debug: true,
  timeout: 60000
}); // const Google = new Sitemapper({
//   url: 'https://www.google.com/work/sitemap.xml',
//   timeout: 15000, // 15 seconds
//   progress: true,
// });
// Google.fetch()
//   .then(data => console.log(data.sites))
//   .catch(error => console.log(error));

sitemapper.timeout = 60000;
sitemapper.fetch('http://wp.seantburke.com/sitemap.xml').then(function (_ref) {
  var url = _ref.url,
      sites = _ref.sites;
  return console.log("url:".concat(url), 'sites:', sites);
})["catch"](function (error) {
  return console.log(error);
});
sitemapper.fetch('https://www.cnn.com/sitemaps/cnn/index.xml').then(function (data) {
  return console.log(data);
})["catch"](function (error) {
  return console.log(error);
});
sitemapper.fetch('http://www.stubhub.com/new-sitemap/us/sitemap-US-en-index.xml').then(function (data) {
  return console.log(data);
})["catch"](function (error) {
  return console.log(error);
});
//# sourceMappingURL=index.js.map