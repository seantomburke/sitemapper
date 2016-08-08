/* global require,module */

/**
 * Sitemap Parser
 *
 * Copyright (c) 2014 Sean Thomas Burke
 * Licensed under the MIT license.
 * @author Sean Burke <hawaiianchimp@gmail.com>
 */

import xmlParse from 'xml2js-es6-promise';
import request from 'request-promise';
import { Promise } from 'es6-promise';

/**
 * @typedef {Object} Sitemapper
 */
export default class Sitemapper {
  /**
   * Construct the Sitemapper class
   *
   * @params {Object} options to set
   * @params {string} [options.url] - the Sitemap url (e.g http://wp.seantburke.com/sitemap.xml)
   * @params {Timeout} [options.timeout] - @see {timeout}
   */
  constructor(options) {
    const settings = options || {};
    this.url = settings.url;
    this.timeout = settings.timeout || 15000;
    this.timeoutArray = {};
  }

  /**
   * Timeout in milliseconds
   *
   * @typedef {Number} Timeout
   * the number of milliseconds before all requests timeout. The promises will still resolve so
   * you'll still receive parts of the request, but maybe not all urls
   * default is 15000 which is 15 seconds
   *
   * @example 15000 - 15 seconds
   * @returns {Timeout}
   */
  static get timeout() {
    return this.timeout;
  }

  /**
   * Set the timeout
   *
   * @public
   * @param {Timeout} duration
   */
  static set timeout(duration) {
    this.timeout = duration;
  }

  /**
   *
   * @param {string} url - url for making requests. Should be a link to a sitemaps.xml
   * @example http://wp.seantburke.com/sitemap.xml
   */
  static set url(url) {
    this.url = url;
  }

  /**
   * Get the url to parse
   * @returns {string}
   */
  static get url() {
    return this.url;
  }

  /**
   * Requests the URL and uses xmlParse to parse through and find the data
   *
   * @public
   * @param {string} [url] - the Sitemaps url (e.g http://wp.seantburke.com/sitemap.xml)
   * @returns {Promise<ParseData> | Promise<ParseError>}
   */
  parse(url = this.url) {
    const requestOptions = {
      method: 'GET',
      uri: url,
      resolveWithFullResponse: true,
    };

    return new Promise((resolve) => {
      const requester = request(requestOptions)
        .then((response) => {
          if (!response || response.statusCode !== 200) {
            return resolve({ error: response, data: response });
          }
          return xmlParse(response.body);
        })
        .then(data => resolve({ data }))
        .catch(error => resolve({ error, data: {} }));

      this.initializeTimeout(url, requester, resolve);
    });
  }

  /**
   *
   * @param url
   * @param requester
   * @param callback
   */
  initializeTimeout(url, requester, callback) {
    // this resolves in order to allow other requests to continue
    this.timeoutArray[url] = setTimeout(() => {
      requester.cancel();
      callback({
        error: `request timed out after ${this.timeout} milliseconds`,
        data: {},
      });
    }, this.timeout);
  }

  /**
   * Gets the sites from a sitemap.xml with a given URL
   *
   * @param {string} [url] - the Sitemaps url (e.g http://wp.seantburke.com/sitemap.xml)
   * @returns {Promise<SitesData> | Promise<ParseError>}
   */
  getSites(url = this.url) {
    this.url = this.url || url;
    return new Promise((resolve) => this.crawl(url).then(sites => resolve({ url, sites })));
  }

  /**
   * Recursive function that will go through a sitemaps tree and get all the sites
   *
   * @recursive
   * @param {string} url - the Sitemaps url (e.g http://wp.seantburke.com/sitemap.xml)
   * @returns {Array} of sitemap urls
   */
  crawl(url) {
    return new Promise((resolve) => {
      this.parse(url).then((response) => {
        if (response.error) {
          return resolve(response);
        }
        if (response.data && response.data.urlset) {
          const sites = response.data.urlset.url.map(site => site.loc && site.loc[0]);
          return resolve([].concat(sites));
        } else if (response.data.sitemapindex) {
          const sitemap = response.data.sitemapindex.sitemap.map(map => map.loc && map.loc[0]);
          const promiseArray = sitemap.map(site => this.crawl(site));
          return Promise.all(promiseArray).then(results => {
            const sites = results.filter(result => !result.error)
              .reduce((prev, curr) => prev.concat(curr), []);
            return resolve(sites);
          });
        }
        return resolve({ url, response });
      }).catch(error => resolve(error));
    });
  }
}

/**
 * Resolve handler type for the promise in this.parse()
 *
 * @typedef {Object} ParseData
 *
 * @property {Error} error that either comes from `xmlParse` or `request`
 * @property {Object} data
 * @property {string} data.url - URL of sitemap
 * @property {Array} data.urlset - Array of returned URLs
 * @property {string} data.urlset.url - single Url
 * @property {Object} data.sitemapindex - index of sitemap
 * @property {string} data.sitemapindex.sitemap - Sitemap
 */

/**
 * Reject handler type for the promise in this.parse()
 *
 * @typedef {Object} ParseError
 *
 * @property {string} url - url that was being requested
 * @property {Error} error - request error @see npm module 'request'
 * @property {Object} response - request response @see npm module 'request'
 * @property {body} body - body of the request @see npm module 'request'
 */

/**
 * Resolve handler type for the promise in this.parse()
 *
 * @typedef {Object} SitesData
 *
 * @property {string} url - the original url used to query the data
 * @property {Array} sites - an array with the resulting sitemap urls
 *
 **/
