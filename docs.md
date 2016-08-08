# Sitemapper

[src/assets/sitemapper.js:18-178](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L18-L178 "Source code on GitHub")

**Parameters**

-   `options`  

## constructor

[src/assets/sitemapper.js:31-36](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L31-L36 "Source code on GitHub")

Construct the Sitemapper class

**Parameters**

-   `options`  

**Examples**

```javascript
let sitemap = new Sitemapper({
                                url: 'http://wp.seantburke.com/sitemap.xml',
                                timeout: 15000
                              });
```

## crawl

[src/assets/sitemapper.js:149-177](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L149-L177 "Source code on GitHub")

Recursive function that will go through a sitemaps tree and get all the sites

**Parameters**

-   `url` **string** the Sitemaps url (e.g <http://wp.seantburke.com/sitemap.xml>)

Returns **Promise&lt;SitesArray&gt; or Promise&lt;ParseData&gt;** 

## getSites

[src/assets/sitemapper.js:137-140](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L137-L140 "Source code on GitHub")

Gets the sites from a sitemap.xml with a given URL

**Parameters**

-   `url` **[string]** the Sitemaps url (e.g <http://wp.seantburke.com/sitemap.xml>)

**Examples**

```javascript
sitemapper.getSites('example.xml')
                   .then((sites) => console.log(sites));
```

Returns **Promise&lt;SitesData&gt;** 

## initializeTimeout

[src/assets/sitemapper.js:117-127](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L117-L127 "Source code on GitHub")

Timeouts are necessary for large xml trees. This will cancel the call if the request is taking
too long, but will still allow the promises to resolve.

**Parameters**

-   `url` **string** url to use as a hash in the timeoutTable
-   `requester` **Promise** the promise that creates the web request to the url
-   `callback` **Function** the resolve method is used here to resolve the parent promise

## parse

[src/assets/sitemapper.js:86-107](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L86-L107 "Source code on GitHub")

Requests the URL and uses xmlParse to parse through and find the data

**Parameters**

-   `url` **[string]** the Sitemaps url (e.g <http://wp.seantburke.com/sitemap.xml>)

Returns **Promise&lt;ParseData&gt;** 

## timeout

[src/assets/sitemapper.js:55-58](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L55-L58 "Source code on GitHub")

Set the timeout

**Parameters**

-   `duration` **Timeout** 

**Examples**

```javascript
sitemapper.timeout = 15000; // 15 seconds
```

## timeout

[src/assets/sitemapper.js:44-46](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L44-L46 "Source code on GitHub")

Get the timeout

**Examples**

```javascript
console.log(sitemapper.timeout);
```

Returns **Timeout** 

## url

[src/assets/sitemapper.js:75-77](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L75-L77 "Source code on GitHub")

Get the url to parse

**Examples**

```javascript
console.log(sitemapper.url)
```

Returns **string** 

## url

[src/assets/sitemapper.js:65-68](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L65-L68 "Source code on GitHub")

**Parameters**

-   `url` **string** url for making requests. Should be a link to a sitemaps.xml

**Examples**

```javascript
sitemapper.url = 'http://wp.seantburke.com/sitemap.xml'
```

# ParseData

[src/assets/sitemapper.js:18-178](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L18-L178 "Source code on GitHub")

Resolve handler type for the promise in this.parse()

**Properties**

-   `error` **Error** that either comes from `xmlParse` or `request` or custom error
-   `data` **Object** 
    -   `data.url` **string** URL of sitemap
    -   `data.urlset` **Array** Array of returned URLs
        -   `data.urlset.url` **string** single Url
    -   `data.sitemapindex` **Object** index of sitemap
        -   `data.sitemapindex.sitemap` **string** Sitemap

# SitesArray

[src/assets/sitemapper.js:18-178](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L18-L178 "Source code on GitHub")

An array of urls

# SitesData

[src/assets/sitemapper.js:18-178](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L18-L178 "Source code on GitHub")

Resolve handler type for the promise in this.parse()

**Properties**

-   `url` **string** the original url used to query the data
-   `sites` **SitesArray** 

# Timeout

[src/assets/sitemapper.js:18-178](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L18-L178 "Source code on GitHub")

Timeout in milliseconds

# xmlParse

[src/assets/sitemapper.js:11-11](https://github.com/hawaiianchimp/sitemapper/blob/bcfe784d1e9da13fcbeb1d0ddb025087abaceb8e/src/assets/sitemapper.js#L11-L11 "Source code on GitHub")

Sitemap Parser

Copyright (c) 2014 Sean Thomas Burke
Licensed under the MIT license.
