"use strict";

var _sitemapper = _interopRequireDefault(require("../assets/sitemapper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Walmart = new _sitemapper["default"]({
  url: 'https://www.walmart.com/sitemap_browse.xml',
  timeout: 15000,
  // 15 seconds
  progress: true
});
Walmart.fetch().then(function (data) {
  return console.log(data.sites);
}) // eslint-disable-line no-console
["catch"](function (error) {
  return console.log(error);
}); // eslint-disable-line no-console
//# sourceMappingURL=walmart.js.map