/*!
 * SiteMap Entry
 * Copyright(c) 2014 Sean Thomas Burke
 * MIT Licensed
 */

var xmlParse = require("xml2js").parseString,
	request = require('request'),
	_ = require('underscore');


function Entry(url){
	this.url = url;
	request(url, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log(body);
			this.xml = xmlParse(body, function(err,data){
				var urlset = data.urlset;
				console.log(urlset.$);
				var urls = _.pluck(data, 'loc');
				console.log(urls);
			});
		}
	});
} 

Entry.prototype.get = function(url) {
	
};

module.exports = Entry;