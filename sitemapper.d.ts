export interface SitemapperSiteData {
  loc: string;
  lastmod?: string;
  priority?: string;
  changefreq?: string;
  [key: string]: any;
}

export interface SitemapperResponse {
  url: string;
  sites: string[] | SitemapperSiteData[];
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
  lastmod?: number;
  rejectUnauthorized?: boolean;
  requestHeaders?: { [name: string]: string };
  retries?: number;
  timeout?: number;
  url?: string;
  fields?: { [name: string]: boolean };
  proxyAgent?: any;
  exclusions?: RegExp[];
}

declare class Sitemapper {
  timeout: number;
  url: string;
  debug: boolean;
  lastmod: number;
  fields?: { [name: string]: boolean };
  requestHeaders?: { [name: string]: string };
  concurrency?: number;
  retries?: number;
  rejectUnauthorized?: boolean;
  exclusions?: RegExp[];
  proxyAgent?: any;
  timeoutTable: { [url: string]: NodeJS.Timeout };

  constructor(options?: SitemapperOptions);

  private initializeTimeout(url: string, requester: any): void;
  private crawl(url: string, retryIndex?: number): Promise<any>;
  private parse(url: string): Promise<any>;
  isExcluded(url: string): boolean;

  /**
   * Gets the sites from a sitemap.xml with a given URL
   *
   * @param url URL to the sitemap.xml file
   */
  fetch(
    this: Sitemapper & { fields: object },
    url?: string
  ): Promise<
    Omit<SitemapperResponse, 'sites'> & { sites: SitemapperSiteData[] }
  >;
  fetch(
    url?: string
  ): Promise<Omit<SitemapperResponse, 'sites'> & { sites: string[] }>;

  /**
   * @deprecated Use fetch() instead.
   */
  getSites(
    url: string | undefined,
    callback: (err: Error | null, sites: string[]) => void
  ): Promise<void>;
}

export default Sitemapper;
