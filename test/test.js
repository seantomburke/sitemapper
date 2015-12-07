
var async = require('async'),
	assert = require("assert"),
	should = require("should"),
	sitemap = require("../lib/sitemap"),
	isurl = require("is-url");

var sitemaps = ['http://www.walmart.com/sitemaps.xml', 'http://www.cbs.com/sitemaps.xml'];

(function(){
	sitemap.getSites("http://www.cbs.com/sitemaps/show/show_siteMap_index.xml", function(err,sites){
				if(sites){
					sitemaps = sites;
					sites.should.be.Array;
				}
				else if(err){
					console.log(err);
				}
			});
})();

var sitemaps;
describe('sitemap', function(){
	describe('getSites', function(){
		
		it('CBS sitemaps should be an array', function(done){
			this.timeout(30000);
			sitemap.getSites("http://www.cbs.com/sitemaps/image/photo_sitemap_index.xml", function(err,sites){
				if(sites){
					sitemaps = sites;
					sites.should.be.Array;
					done();
				}
				else if(err){
					console.log(err);
					done();
				}
			});
		});
		
		it('Seantburke.com sitemaps should be an array', function(done){
			this.timeout(30000);
			sitemap.getSites("http://wp.seantburke.com/sitemap.xml", function(err,sites){
				if(sites){
					sitemaps = sites;
					sites.should.be.Array;
					done();
				}
				else if(err){
					console.log(err);
					done();
				}
			});
		});
	});
	
	describe('URL checks', function(){
		for(var key in sitemaps)
		{
			(function(site){
				it(site + ' should be a URL', function(){
					isurl(site).should.be.true;
				});
			})(sitemaps[key]);
		}
	});
});
