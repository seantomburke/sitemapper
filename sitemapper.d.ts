export interface SitemapperResponse {
  url: string;
  sites: string[];
  errors: SitemapperErrorData[];
}

export interface SitemapperErrorData {
  type: string;
  url: string;
  retries: number;
}

export interface SitemapperOptions {
  url?: string;
  timeout?: number;
  requestHeaders?: {[name: string]: string};
  debug?: boolean;
  concurrency?: number;
  retries?: number;
  rejectUnauthorized?: boolean;
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
