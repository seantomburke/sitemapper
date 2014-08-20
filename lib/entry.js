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
	this.xml = {};
	request(sitemap_url, this.parseSiteMap);
}

Entry.prototype.getSites = function() {
	var d,s;
	if(d = this.xml.urlset)
	{
		return _.flatten(_.pluck(d.url, "loc"));
	}
	else if(s = this.xml.sitemapindex)
	{
		_.each(_.flatten(_.pluck(s.sitemap, "loc")), function(url){
			return Entry(url).getSites();
		})
	}
	else{
		console.log("error");
	}
};

Entry.prototype.parseSiteMap = function(error, response, body){
	if(!error && response.statusCode == 200){
			xmlParse(body, this.storeXML);
		}
};

Entry.prototype.storeXML = function(err,data){
	if(!err){
		this.xml = data || {};
	}else{console.log(err);}
}


module.exports = Entry;