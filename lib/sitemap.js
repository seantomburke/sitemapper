
'use strict'

var xmlParse = require("xml2js").parseString;
var	request = require('request');
var	_ = require('underscore');

var sitemap = module.exports = Object;

sitemap.setURL = function(url){
	this.url = url;
}

sitemap.parse = function(url, callback){
	this.url = url;
	var self = this;
	request(this.url, function(err, response, body){
		if(!err && response.statusCode == 200){
			xmlParse(body, function(err,data){
					callback(err,data);
			});
		}
		else{
			callback(err, response.statusCode + "Error");
		}
	});
}

sitemap.getSites = function(url, callback){
	var self = this;
	var d,s,error,sites = [];
	console.log(url);
	this.parse(url, function read(err, data){
		if(!err)
		{
			if(d = data.urlset)
			{
				sites = _.flatten(_.pluck(d.url, "loc"));
			}
			else if(s = data.sitemapindex)
			{
				_.each(_.flatten(_.pluck(s.sitemap, "loc")), function(url){
					self.parse(url, read);
					console.log(url);
				})
			}
			else{
				error = "no valid xml";
			}
			callback(error,sites);
		}else{
			console.log(err);
			callback(err,sites);
		}
	});
}
