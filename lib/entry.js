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
	request(sitemap_url, this.parseSiteMap);
	console.log("Entry",this);
	var self = this;

	this.getSites = function() {
		var d,s;
		console.log("getSites",self);
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

	this.parseSiteMap = function(error, response, body){
		console.log("parseSiteMap",this);
		if(!error && response.statusCode == 200){
				xmlParse(body, this.storeXML);
			}
	};

	this.storeXML = function(err,data){
		console.log("storeXML",this);
		if(!err){
			self.setXML(data || {});
			console.log(this);
		}else{console.log(err);}
	}

	this.setXML = function(xml)
	{
		self.xml = xml;
	}
}


module.exports = Entry;