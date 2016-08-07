/*global require,module*/

/*
 * Sitemap Parser
 *
 * Copyright (c) 2014 Sean Thomas Burke
 * Licensed under the MIT license.
 */

import xmlParse from 'xml2js';
import request from 'request';
import _ from 'underscore';

class Sitemapper {

  /**
   * Sets the URL of the Class
   * @param {URL} url - the Sitemaps url (e.g http://wp.seantburke.com/sitemap.xml)
   */
  setURL(url) {
    this.url = url;
  }

  /**
   * Requests the URL and uses xmlParse to parse through and find the data
   *
   * @param {URL} url - the Sitemaps url (e.g http://wp.seantburke.com/sitemap.xml)
   * @param {parseCallback} callback - The callback that handles the response.
   */
  parse(url, callback) {
    this.url = url;
    request(this.url, function (err, response, body) {
      if (!err && response.statusCode === 200) {
        xmlParse.parseString(body, function (err, data) {
          callback(err, data);
        });
        return;
      } else if (!err) {
        err = new Error('Sitemapper: Server returned a non-200 status');
      }
      callback(err, 'Error');
    });
  }

  /**
   * This callback is displayed as a global member.
   * @callback parseCallback
   * @param {Error} error that either comes from `xmlParse` or `request`
   * @param {Object} data
   * @param {URL} data.url - URL of sitemap
   * @param {Array} data.urlset - Array of returned URLs
   * @param {String} data.urlset.url - single Url
   * @param {Object} data.sitemapindex - index of sitemap
   * @param {String} data.sitemapindex.sitemap - Sitemap
   */

  /**
   *
   * @param {URL} url - the Sitemaps url (e.g http://wp.seantburke.com/sitemap.xml)
   * @param {getSitesCallback} callback
   */
  getSites(url, callback) {
    this.parse(url, function read(err, data) {
      var self = this;
      var error;
      var sites = [];
      var sUrlSize = 1;
      var parseCount = 0;

      if (!err && data) {
        if (data.urlset) {
          sites.push(_.flatten(_.pluck(data.urlset.url, 'loc')));
          sites = _.flatten(sites);
          parseCount++;
          if (parseCount === sUrlSize) {
            callback(error, sites);
          }
        } else if (data.sitemapindex) {
          var sitemapUrls = _.flatten(_.pluck(data.sitemapindex.sitemap, 'loc'));
          sUrlSize = _.size(sitemapUrls);
          _.each(sitemapUrls, function (url) {
            self.parse(url, read);
          });
        } else {
          // error = 'no valid xml';
          callback(err, sites);
        }
      } else {
        error = err;
        callback(error, sites);
      }
    });
  }

  /**
   * This callback is displayed as a global member.
   * @callback getSitesCallback
   * @param {Error} error that either comes from `xmlParse` or `request`
   * @param {Object} data
   */
}

export default new Sitemapper();
