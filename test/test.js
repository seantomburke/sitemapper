
var async = require('async'),
	assert = require("assert"),
	should = require("should"),
	sitemap = require("../lib/sitemap"),
	isurl = require("is-url");

sitemaps = ['http://www.walmart.com/sitemaps.xml', 'http://www.cbs.com/sitemaps.xml'];

(function(){
	sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(err,sites){
				sitemaps = sites;
				sites.should.be.Array;
			});
})();


var sitemaps;
describe('sitemap', function(){
	describe('getSites', function(){
		it('CBS sitemaps should be an array', function(done){
			sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(err,sites){
				sitemaps = sites;
				sites.should.be.Array;
				done();
			});
		});
		it('Walmart sitemaps should be an array', function(done){
			sitemap.getSites("http://www.walmart.com/sitemap_tp1.xml.gz", function(err,sites){
				sitemaps = sites;
				sites.should.be.Array;
				done();
			});
		});
	});
	describe('URL checks', function(){
		for(key in sitemaps)
		{
			(function(site){
				it(site + ' should be a URL', function(){
					isurl(site).should.be.true;
				});
			})(sitemaps[key]);
		}
	});
});