/*
 * Sitemap Parser
 *
 * Copyright (c) 2014 Sean Thomas Burke
 * Licensed under the MIT license.
 */

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
			callback(err, "Error");
		}
	});
}

sitemap.getSites = function(url, callback){
	var self = this;
	var d,s,error,sites = [];
	this.parse(url, function read(err, data){
		if(!err)
		{
			if(d = data.urlset)
			{
				sites.push(_.flatten(_.pluck(d.url, "loc")));
				sites = _.flatten(sites);
				callback(error,sites);
			}
			else if(s = data.sitemapindex)
			{
				_.each(_.flatten(_.pluck(s.sitemap, "loc")), function(url){
					self.parse(url, read);
				})
			}
			else{
				error = "no valid xml";
			}
		}else{
			error = err;
			//callback(err,sites);
		}
	});
}
