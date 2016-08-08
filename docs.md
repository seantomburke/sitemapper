# Sitemapper

[src/assets/sitemapper.js:17-68](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L17-L68 "Source code on GitHub")

**Parameters**

-   `url`  

## constructor

[src/assets/sitemapper.js:23-25](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L23-L25 "Source code on GitHub")

Construct the Sitemapper class

**Parameters**

-   `url` **[string]** Url to be parsed

## getSites

[src/assets/sitemapper.js:51-66](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L51-L66 "Source code on GitHub")

Gets the sites with a given URL

**Parameters**

-   `url` **[string]** the Sitemaps url (e.g <http://wp.seantburke.com/sitemap.xml>)

Returns **Promise&lt;SitesData&gt; or Promise&lt;ParseError&gt;** 

## parse

[src/assets/sitemapper.js:34-43](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L34-L43 "Source code on GitHub")

Requests the URL and uses xmlParse to parse through and find the data

**Parameters**

-   `url` **[string]** the Sitemaps url (e.g <http://wp.seantburke.com/sitemap.xml>)

Returns **Promise&lt;ParseData&gt; or Promise&lt;ParseError&gt;** 

# ParseData

[src/assets/sitemapper.js:70-70](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L70-L70 "Source code on GitHub")

Resolve handler type for the promise in this.parse()

**Properties**

-   `error` **Error** that either comes from `xmlParse` or `request`
-   `data` **Object** 
    -   `data.url` **string** URL of sitemap
    -   `data.urlset` **Array** Array of returned URLs
        -   `data.urlset.url` **string** single Url
    -   `data.sitemapindex` **Object** index of sitemap
        -   `data.sitemapindex.sitemap` **string** Sitemap

# ParseError

[src/assets/sitemapper.js:70-70](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L70-L70 "Source code on GitHub")

Reject handler type for the promise in this.parse()

**Properties**

-   `url` **string** url that was being requested
-   `error` **Error** request error @see npm module 'request'
-   `response` **Object** request response @see npm module 'request'
-   `body` **body** body of the request @see npm module 'request'

# SitesData

[src/assets/sitemapper.js:70-70](https://github.com/hawaiianchimp/sitemapper/blob/2f23a4354a8f268b05b35db9ba4edf8ee63e8ce4/src/assets/sitemapper.js#L70-L70 "Source code on GitHub")

Resolve handler type for the promise in this.parse()

**Properties**

-   `url` **string** the original url used to query the data
-   `sites` **Array** an array with the resulting sitemap urls
