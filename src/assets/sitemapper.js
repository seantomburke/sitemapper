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
    request(this.url, (err, response, body) => {
      if (response.statusCode === 200) {
        xmlParse.parseString(body, (err, data) => {
          callback(err, data);
        });
      } else {
        callback(err, {err, response, body});
      }
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
    let self = this;
    this.parse(url, function read(err, data) {
      let error;
      let sites = [];
      const sUrlSize = 1;
      let parseCount = 0;

      if (!err && data) {
        if (data.urlset) {
          sites.push(_.flatten(_.pluck(data.urlset.url, 'loc')));
          sites = _.flatten(sites);
          parseCount++;
          if (parseCount === sUrlSize) {
            callback(error, sites);
          }
        } else if (data.sitemapindex) {
          const sitemapUrls = _.flatten(_.pluck(data.sitemapindex.sitemap, 'loc'));
          _.each(sitemapUrls, (url) => {
            self.parse(url, read);
          }, this);
        } else {
          callback(err, sites);
        }
      } else {
        callback(err, sites);
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
