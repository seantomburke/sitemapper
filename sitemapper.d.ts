export interface SitemapperResponse {
  url: string;
  sites: string[] | SitemapperResponseSite[];
  errors: SitemapperErrorData[];
}

export type SitemapperResponseSite = { [name in SitemapperField]?: string };

export interface SitemapperErrorData {
  type: string;
  url: string;
  retries: number;
}

export type SitemapperField =
  | 'loc'
  | 'sitemap'
  | 'lastmod'
  | 'changefreq'
  | 'priority'
  | 'image:loc'
  | 'image:title'
  | 'image:caption'
  | 'video:title'
  | 'video:description'
  | 'video:thumbnail_loc';

export type SitemapperFields = { [name in SitemapperField]?: boolean };

export interface SitemapperOptions {
  concurrency?: number;
  debug?: boolean;
  lastmod?: number;
  rejectUnauthorized?: boolean;
  requestHeaders?: { [name: string]: string };
  retries?: number;
  timeout?: number;
  url?: string;
  fields?: SitemapperFields;
  exclusions?: RegExp[];
}

declare class Sitemapper {
  timeout: number;

  constructor(options: SitemapperOptions);

  /**
   * Gets the sites from a sitemap.xml with a given URL
   *
   * @param url URL to the sitemap.xml file
   */
  fetch(url?: string): Promise<SitemapperResponse>;
}

export default Sitemapper;
