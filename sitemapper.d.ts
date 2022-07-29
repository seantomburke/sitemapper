export interface SitemapperResponse {
  url: string;
  sites: Array<string>;
  errors: SitemapperErrorData[];
}

export interface SitemapperErrorData {
  type: string;
  url: string;
  retries: number;
}

export interface SitemapperOptions {
  concurrency?: number;
  debug?: boolean;
  gzip?: boolean;
  headers?: Headers;
  lastmod?: number;
  method?: string;
  rejectUnauthorized?: boolean;
  requestHeaders?: {[name: string]: string};
  resolveWithFullResponse?: boolean;
  responseType?: string;
  retries?: number;
  timeout?: number;
  url?: string;
}

declare class Sitemapper {

  timeout: number;

  constructor(options: SitemapperOptions)

  /**
   * Gets the sites from a sitemap.xml with a given URL
   *
   * @param url URL to the sitemap.xml file
   */
  fetch(url?: string): Promise<SitemapperResponse>;
}

export default Sitemapper;
