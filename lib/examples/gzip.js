"use strict";

var _sitemapper = _interopRequireDefault(require("../assets/sitemapper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Gzip = new _sitemapper["default"]({
  url: 'https://www.imot.bg/sitemap/index.xml',
  timeout: 15000,
  // 15 seconds
  debug: true,
  headers: {
    'Content-type': 'gzip'
  },
  contentType: 'text'
});
Gzip.fetch().then(function (data) {
  return console.log(data.sites);
}) // eslint-disable-line no-console
["catch"](function (error) {
  return console.log(error);
}); // eslint-disable-line no-console
//# sourceMappingURL=gzip.js.map