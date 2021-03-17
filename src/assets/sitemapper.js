/**
 * Sitemap Parser
 *
 * Copyright (c) 2020 Sean Thomas Burke
 * Licensed under the MIT license.
 * @author Sean Burke <@seantomburke>
 */

import { parseStringPromise } from 'xml2js';
import got from 'got';
import zlib from 'zlib';
import Url from 'url';
import path from 'path';

/**
 * @typedef {Object} Sitemapper
 */
export default class Sitemapper {
  /**
   * Construct the Sitemapper class
   *
   * @params {Object} options to set
   * @params {string} [options.url] - the Sitemap url (e.g https://wp.seantburke.com/sitemap.xml)
   * @params {Timeout} [options.timeout] - @see {timeout}
   *
   * @example let sitemap = new Sitemapper({
   *   url: 'https://wp.seantburke.com/sitemap.xml',
   *   timeout: 15000
   *  });
   */
  constructor(options) {
    const settings = options || { 'requestHeaders': {} };
    this.url = settings.url;
    this.timeout = settings.timeout || 15000;
    this.timeoutTable = {};
    this.requestHeaders = settings.requestHeaders;
    this.debug = settings.debug;
    this.insecure = settings.insecure || false;
  }

  /**
   * Gets the sites from a sitemap.xml with a given URL
   *
   * @public
   * @param {string} [url] - the Sitemaps url (e.g https://wp.seantburke.com/sitemap.xml)
   * @returns {Promise<SitesData>}
   * @example sitemapper.fetch('example.xml')
   *  .then((sites) => console.log(sites));
   */
  async fetch(url = this.url) {
    let sites = [];
    try {
      // crawl the URL
      sites = await this.crawl(url);
    } catch (e) {
      if (this.debug) {
        console.error(e);
      }
    }

    // If we run into an error, don't throw, but instead return an empty array
    return {
      url,
      sites,
    };
  }

  /**
   * Get the timeout
   *
   * @example console.log(sitemapper.timeout);
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
   * @example sitemapper.timeout = 15000; // 15 seconds
   */
  static set timeout(duration) {
    this.timeout = duration;
  }

  /**
   *
   * @param {string} url - url for making requests. Should be a link to a sitemaps.xml
   * @example sitemapper.url = 'https://wp.seantburke.com/sitemap.xml'
   */
  static set url(url) {
    this.url = url;
  }

  /**
   * Get the url to parse
   * @returns {string}
   * @example console.log(sitemapper.url)
   */
  static get url() {
    return this.url;
  }

  /**
   * Setter for the debug state
   * @param {Boolean} option - set whether to show debug logs in output.
   * @example sitemapper.debug = true;
   */
  static set debug(option) {
    this.debug = option;
  }

  /**
   * Getter for the debug state
   * @returns {Boolean}
   * @example console.log(sitemapper.debug)
   */
  static get debug() {
    return this.debug;
  }

  /**
   * Requests the URL and uses parseStringPromise to parse through and find the data
   *
   * @private
   * @param {string} [url] - the Sitemaps url (e.g https://wp.seantburke.com/sitemap.xml)
   * @returns {Promise<ParseData>}
   */
  async parse(url = this.url) {
    // setup the response options for the got request
    const requestOptions = {
      method: 'GET',
      resolveWithFullResponse: true,
      gzip: true,
      responseType: 'buffer',
      headers: this.requestHeaders,
      https: {
        rejectUnauthorized: Boolean(this.insecure)
      }
    };

    try {
      // create a request Promise with the url and request options
      const requester = got(url, requestOptions);

      // initialize the timeout method based on the URL, and pass the request object.
      this.initializeTimeout(url, requester);

      // get the response from the requester promise
      const response = await requester;

      // if the response does not have a successful status code then clear the timeout for this url.
      if (!response || response.statusCode !== 200) {
        clearTimeout(this.timeoutTable[url]);
        return { error: response.error, data: response };
      }

      let responseBody;

      if (this.isGzip(url)) {
        responseBody = await this.decompressResponseBody(response.body);
      } else {
        responseBody = response.body;
      }

      // otherwise parse the XML that was returned.
      const data = await parseStringPromise(responseBody);

      // return the results
      return { error: null, data };
    } catch (error) {
      // If the request was canceled notify the user of the timeout
      if (error.name === 'CancelError') {
        return {
          error: `Request timed out after ${this.timeout} milliseconds for url: '${url}'`,
          data: error
        };
      }

      // Otherwise notify of another error
      return {
        error: error.error,
        data: error
      };
    }
  }

  /**
   * Timeouts are necessary for large xml trees. This will cancel the call if the request is taking
   * too long, but will still allow the promises to resolve.
   *
   * @private
   * @param {string} url - url to use as a hash in the timeoutTable
   * @param {Promise} requester - the promise that creates the web request to the url
   */
  initializeTimeout(url, requester) {
    // this will throw a CancelError which will be handled in the parent that calls this method.
    this.timeoutTable[url] = setTimeout(() => requester.cancel(), this.timeout);
  }

  /**
   * Recursive function that will go through a sitemaps tree and get all the sites
   *
   * @private
   * @recursive
   * @param {string} url - the Sitemaps url (e.g https://wp.seantburke.com/sitemap.xml)
   * @returns {Promise<SitesArray> | Promise<ParseData>}
   */
  async crawl(url) {
    try {
      const { error, data } = await this.parse(url);
      // The promise resolved, remove the timeout
      clearTimeout(this.timeoutTable[url]);

      if (error) {
        if (this.debug) {
          console.error(`Error occurred during "crawl('${url}')":\n\r Error: ${error}`);
        }
        // Fail silently
        return [];
      } else if (data && data.urlset && data.urlset.url) {
        if (this.debug) {
          console.debug(`Urlset found during "crawl('${url}')"`);
        }
        const sites = data.urlset.url.map(site => site.loc && site.loc[0]);
        return [].concat(sites);
      } else if (data && data.sitemapindex) {
        if (this.debug) {
          console.debug(`Additional sitemap found during "crawl('${url}')"`);
        }
        // Map each child url into a promise to create an array of promises
        const sitemap = data.sitemapindex.sitemap.map(map => map.loc && map.loc[0]);
        const promiseArray = sitemap.map(site => this.crawl(site));

        // Make sure all the promises resolve then filter and reduce the array
        const results = await Promise.all(promiseArray);
        const sites = results
          .filter(result => !result.error)
          .reduce((prev, curr) => prev.concat(curr), []);

        return sites;
      }

      if (this.debug) {
        console.error(`Unknown state during "crawl('${url})'":`, error, data);
      }

      // Fail silently
      return [];
    } catch (e) {
      if (this.debug) {
        this.debug && console.error(e);
      }
    }
  }


  /**
   * Gets the sites from a sitemap.xml with a given URL
   *
   * @deprecated
   * @param {string} url - url to query
   * @param {getSitesCallback} callback - callback for sites and error
   * @callback
    */
  async getSites(url = this.url, callback) {
    console.warn(  // eslint-disable-line no-console
      '\r\nWarning:', 'function .getSites() is deprecated, please use the function .fetch()\r\n'
    );

    let err = {};
    let sites = [];
    try {
      const response = await this.fetch(url);
      sites = response.sites;
    } catch (error) {
      err = error;
    }
    return callback(err, sites);
  }

  /**
   * Check to see if the url is a gzipped url
   *
   * @param {string} url - url to query
   * @returns {Boolean}
   */
  isGzip(url) {
    const parsed = Url.parse(url);
    const ext = path.extname(parsed.path);
    return ext === '.gz';
  }

  /**
   * Decompress the gzipped response body using zlib.gunzip
   *
   * @param {Buffer} body - body of the gzipped file
   * @returns {Boolean}
   */
  decompressResponseBody(body) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(body);
      zlib.gunzip(buffer, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

/**
 * Callback for the getSites method
 *
 * @callback getSitesCallback
 * @param {Object} error - error from callback
 * @param {Array} sites - an Array of sitemaps
 */

/**
 * Timeout in milliseconds
 *
 * @typedef {Number} Timeout
 * the number of milliseconds before all requests timeout. The promises will still resolve so
 * you'll still receive parts of the request, but maybe not all urls
 * default is 15000 which is 15 seconds
 */

/**
 * Resolve handler type for the promise in this.parse()
 *
 * @typedef {Object} ParseData
 *
 * @property {Error} error that either comes from `parseStringPromise` or `got` or custom error
 * @property {Object} data
 * @property {string} data.url - URL of sitemap
 * @property {Array} data.urlset - Array of returned URLs
 * @property {string} data.urlset.url - single Url
 * @property {Object} data.sitemapindex - index of sitemap
 * @property {string} data.sitemapindex.sitemap - Sitemap
 * @example {
 *   error: "There was an error!"
 *   data: {
 *     url: 'https://linkedin.com',
 *     urlset: [{
 *       url: 'https://www.linkedin.com/project1'
 *     },[{
 *       url: 'https://www.linkedin.com/project2'
 *     }]
 *   }
 * }
 */

/**
 * Resolve handler type for the promise in this.parse()
 *
 * @typedef {Object} SitesData
 *
 * @property {string} url - the original url used to query the data
 * @property {SitesArray} sites
 * @example {
 *   url: 'https://linkedin.com/sitemap.xml',
 *   sites: [
 *     'https://linkedin.com/project1',
 *     'https://linkedin.com/project2'
 *   ]
 * }
 */

/**
 * An array of urls
 *
 * @typedef {String[]} SitesArray
 * @example [
 *   'https://www.google.com',
 *   'https://www.linkedin.com'
 * ]
 */
