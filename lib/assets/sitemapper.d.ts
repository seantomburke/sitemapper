/**
 * Sitemap Parser
 *
 * Copyright (c) 2020 Sean Thomas Burke
 * Licensed under the MIT license.
 * @author Sean Burke <@seantomburke>
 */
/// <reference types="node" />
import { SitemapperOptions } from '../../sitemapper';
/**
 * @typedef {Object} Sitemapper
 */
export default class Sitemapper {
    url: string;
    timeout: number;
    timeoutTable: Object;
    requestHeaders: any;
    debug: boolean;
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
    constructor(options?: SitemapperOptions);
    /**
     * Gets the sites from a sitemap.xml with a given URL
     *
     * @public
     * @param {string} [url] - the Sitemaps url (e.g https://wp.seantburke.com/sitemap.xml)
     * @returns {Promise<SitesData>}
     * @example sitemapper.fetch('example.xml')
     *  .then((sites) => console.log(sites));
     */
    fetch(url?: string): Promise<{
        url: string;
        sites: string[];
    }>;
    /**
     * Get the timeout
     *
     * @example console.log(sitemapper.timeout);
     * @returns {Timeout}
     */
    static get timeout(): Number;
    /**
     * Set the timeout
     *
     * @public
     * @param {Timeout} duration
     * @example sitemapper.timeout = 15000; // 15 seconds
     */
    static set timeout(duration: Number);
    /**
     *
     * @param {string} url - url for making requests. Should be a link to a sitemaps.xml
     * @example sitemapper.url = 'https://wp.seantburke.com/sitemap.xml'
     */
    static set url(url: string);
    /**
     * Get the url to parse
     * @returns {string}
     * @example console.log(sitemapper.url)
     */
    static get url(): string;
    /**
     * Setter for the debug state
     * @param {Boolean} option - set whether to show debug logs in output.
     * @example sitemapper.debug = true;
     */
    static set debug(option: boolean);
    /**
     * Getter for the debug state
     * @returns {Boolean}
     * @example console.log(sitemapper.debug)
     */
    static get debug(): boolean;
    /**
     * Requests the URL and uses parsestringPromise to parse through and find the data
     *
     * @private
     * @param {string} [url] - the Sitemaps url (e.g https://wp.seantburke.com/sitemap.xml)
     * @returns {Promise<ParseData>}
     */
    parse(url?: string): Promise<{
        error: any;
        data: any;
    }>;
    /**
     * Timeouts are necessary for large xml trees. This will cancel the call if the request is taking
     * too long, but will still allow the promises to resolve.
     *
     * @private
     * @param {string} url - url to use as a hash in the timeoutTable
     * @param {Promise} requester - the promise that creates the web request to the url
     */
    initializeTimeout(url: string, requester: {
        cancel: Function;
    }): void;
    /**
     * Recursive function that will go through a sitemaps tree and get all the sites
     *
     * @private
     * @recursive
     * @param {string} url - the Sitemaps url (e.g https://wp.seantburke.com/sitemap.xml)
     * @returns {Promise<SitesArray> | Promise<ParseData>}
     */
    crawl(url: string): Promise<Array<string>>;
    /**
     * Gets the sites from a sitemap.xml with a given URL
     *
     * @deprecated
     * @param {string} url - url to query
     * @param {getSitesCallback} callback - callback for sites and error
     * @callback
      */
    getSites(url: string, callback: any): Promise<any>;
    /**
     * Check to see if the url is a gzipped url
     *
     * @param {string} url - url to query
     * @returns {Boolean}
     */
    isGzip(url: string): boolean;
    /**
     * Decompress the gzipped response body using zlib.gunzip
     *
     * @param {Buffer} body - body of the gzipped file
     * @returns {Boolean}
     */
    decompressResponseBody(body: Buffer): Promise<Buffer>;
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
 * @property {Error} error that either comes from `parsestringPromise` or `got` or custom error
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
 * @typedef {string[]} SitesArray
 * @example [
 *   'https://www.google.com',
 *   'https://www.linkedin.com'
 * ]
 */
