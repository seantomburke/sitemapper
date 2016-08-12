'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sitemapperJs = require('../sitemapper.js');

var _sitemapperJs2 = _interopRequireDefault(_sitemapperJs);

var Google = new _sitemapperJs2['default']({
  url: 'https://www.google.com/work/sitemap.xml',
  timeout: 15000 });

// 15 seconds
Google.fetch().then(function (data) {
  return console.log(data.sites);
})['catch'](function (error) {
  return console.log(error);
});