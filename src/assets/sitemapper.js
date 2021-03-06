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
import pLimit from 'p-limit';

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
   * @params {boolean} [options.debug] - Enables/Disables additional logging
   * @params {integer} [options.concurrency] - The number of concurrent sitemaps to crawl (e.g. 2 will crawl no more than 2 sitemaps at the same time)
   * @params {integer} [options.retries] - The maximum number of retries to attempt when crawling fails (e.g. 1 for 1 retry, 2 attempts in total)
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
    this.concurrency = settings.concurrency || 10;
    this.retries = settings.retries || 0;
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
    // initialize empty variables
    let results = {
      url: '',
      sites: [],
      errors: [],
    };

    // attempt to set the variables with the crawl
    try {
      // crawl the URL
      results = await this.crawl(url);
    } catch (e) {
      // show errors that may occur
      if (this.debug) {
        console.error(e);
      }
    }

    return {
      url,
      sites: results.sites || [],
      errors: results.error || [],
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
   * @param {integer} retryIndex - Number of retry attempts fro this URL (e.g. 0 for 1st attempt, 1 for second attempty etc.)
   * @returns {Promise<SitesData>}
   */
  async crawl(url, retryIndex = 0) {
    try {
      const { error, data } = await this.parse(url);
      // The promise resolved, remove the timeout
      clearTimeout(this.timeoutTable[url]);

      if (error) {
        // Handle errors during sitemap parsing / request
        // Retry on error until you reach the retry limit set in the settings
        if (retryIndex < this.retries) {
          if (this.debug) {
            console.log (`(Retry attempt: ${retryIndex + 1} / ${this.retries}) ${url} due to ${data.name} on previous request`);
          }
          return this.crawl(url, retryIndex + 1);
        }

        if (this.debug) {
          console.error(`Error occurred during "crawl('${url}')":\n\r Error: ${error}`);
        }

        // Fail and log error
        return {
          sites: [],
          errors: [{
            type: data.name,
            url,
            retries: retryIndex,
          }]
        };

      } else if (data && data.urlset && data.urlset.url) {
        // Handle URLs found inside the sitemap
        if (this.debug) {
          console.debug(`Urlset found during "crawl('${url}')"`);
        }
        const sites = data.urlset.url.map(site => site.loc && site.loc[0]);
        return {
          sites,
          errors: []
        }

      } else if (data && data.sitemapindex) {
        // Handle child sitemaps found inside the active sitemap
        if (this.debug) {
          console.debug(`Additional sitemap found during "crawl('${url}')"`);
        }
        // Map each child url into a promise to create an array of promises
        const sitemap = data.sitemapindex.sitemap.map(map => map.loc && map.loc[0]);

        // Parse all child urls within the concurrency limit in the settings
        const limit = pLimit(this.concurrency);
        const promiseArray = sitemap.map(site => limit(() => this.crawl(site)));

        // Make sure all the promises resolve then filter and reduce the array
        const results = await Promise.all(promiseArray);
        const sites = results
          .filter(result => (result.errors.length == 0))
          .reduce((prev, curr) => prev.concat(curr.sites), []);
        const errors = results
          .filter(result => result.errors)
          .reduce((prev, curr) => prev.concat(curr.errors), []);

        return {
          sites,
          errors,
        };
      }

      // Retry on error until you reach the retry limit set in the settings
      if (retryIndex < this.retries) {
        if (this.debug) {
          console.log (`(Retry attempt: ${retryIndex + 1} / ${this.retries}) ${url} due to ${data.name} on previous request`);
        }
        return this.crawl(url, retryIndex + 1);
      }
      if (this.debug) {
        console.error(`Unknown state during "crawl('${url})'":`, error, data);
      }

      // Fail and log error
      return {
        sites: [],
        errors: [{
          url,
          type: data.name || 'UnknownStateError',
          retries: retryIndex
        }]
      };

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
 *   error: 'There was an error!'
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
 * @property {ErrorDataArray} errors
 * @example {
 *   url: 'https://linkedin.com/sitemap.xml',
 *   sites: [
 *     'https://linkedin.com/project1',
 *     'https://linkedin.com/project2'
 *   ],
 *   errors: [
 *      {
 *        type: 'CancelError',
 *        url: 'https://www.walmart.com/sitemap_tp1.xml',
 *        retries: 0
 *      },
 *      {
 *        type: 'HTTPError',
 *        url: 'https://www.walmart.com/sitemap_tp2.xml',
 *        retries: 0
 *      },
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

/**
 * An array of Error data objects
 *
 * @typedef {ErrorData[]} ErrorDataArray
 * @example [
 *    {
 *      type: 'CancelError',
 *      url: 'https://www.walmart.com/sitemap_tp1.xml',
 *      retries: 0
 *    },
 *    {
 *      type: 'HTTPError',
 *      url: 'https://www.walmart.com/sitemap_tp2.xml',
 *      retries: 0
 *    },
 * ]
 */

/**
 * An object containing details about the errors which occurred during the crawl
 *
 * @typedef {Object} ErrorData
 *
 * @property {string} type - The error type which was returned
 * @property {string} url - The sitemap URL which returned the error
 * @property {Number} errors - The total number of retries attempted after receiving the first error
 * @example {
 *    type: 'CancelError',
 *    url: 'https://www.walmart.com/sitemap_tp1.xml',
 *    retries: 0
 * }
 */
