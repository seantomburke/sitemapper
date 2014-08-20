/*!
 * SiteMap Entry
 * Copyright(c) 2014 Sean Thomas Burke
 * MIT Licensed
 */

var xmlParse = require("xml2js").parseString,
	request = require('request'),
	_ = require('underscore');


function Entry(sitemap_url){
	this.sitemap_url = sitemap_url;
	self = this
	request(sitemap_url, function(error, response, body){
		console.log(body);
		if(!error && response.statusCode == 200){
			xmlParse(body, function(err,data){
				this.xml = self.parseXML(data) || {};
			});
		}
	});
}


Entry.prototype.parseXML = function(data) {
	var d,s;
	if(d = data.urlset)
	{
		this.sites = _.flatten(_.pluck(d.url, "loc"));
		console.log(this.sites);
	}
	else if(s = data.sitemapindex)
	{
		_.each(_.flatten(_.pluck(s.sitemap, "loc")), function(el){
			new Entry(el);
		})
	}
	
};

module.exports = Entry;