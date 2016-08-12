'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sitemapperJs = require('../sitemapper.js');

var _sitemapperJs2 = _interopRequireDefault(_sitemapperJs);

var sitemapper = new _sitemapperJs2['default']();

var Google = new _sitemapperJs2['default']({
  url: 'https://www.google.com/work/sitemap.xml',
  timeout: 15000 });

// 15 seconds
Google.fetch().then(function (data) {
  return console.log(data.sites);
})['catch'](function (error) {
  return console.log(error);
});

sitemapper.timeout = 5000;

sitemapper.fetch('http://wp.seantburke.com/sitemap.xml').then(function (_ref) {
  var url = _ref.url;
  var sites = _ref.sites;
  return console.log('url:' + url, 'sites:', sites);
})['catch'](function (error) {
  return console.log(error);
});

sitemapper.fetch('http://www.cnn.com/sitemaps/sitemap-index.xml').then(function (data) {
  return console.log(data);
})['catch'](function (error) {
  return console.log(error);
});

sitemapper.fetch('http://www.stubhub.com/new-sitemap/us/sitemap-US-en-index.xml').then(function (data) {
  return console.log(data);
})['catch'](function (error) {
  return console.log(error);
});