# Sitemapper

[src/assets/sitemapper.js:19-194](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L19-L194 "Source code on GitHub")

**Parameters**

-   `options`  

## constructor

[src/assets/sitemapper.js:32-37](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L32-L37 "Source code on GitHub")

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

## fetch

[src/assets/sitemapper.js:48-51](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L48-L51 "Source code on GitHub")

Gets the sites from a sitemap.xml with a given URL

**Parameters**

-   `url` **[string]** the Sitemaps url (e.g <http://wp.seantburke.com/sitemap.xml>)

**Examples**

```javascript
sitemapper.fetch('example.xml')
                   .then((sites) => console.log(sites));
```

Returns **Promise&lt;SitesData&gt;** 

## getSites

[src/assets/sitemapper.js:188-193](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L188-L193 "Source code on GitHub")

Gets the sites from a sitemap.xml with a given URL

**Parameters**

-   `url`   (optional, default `this.url`)

## timeout

[src/assets/sitemapper.js:70-72](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L70-L72 "Source code on GitHub")

Set the timeout

**Parameters**

-   `duration` **Timeout** 

**Examples**

```javascript
sitemapper.timeout = 15000; // 15 seconds
```

## timeout

[src/assets/sitemapper.js:59-61](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L59-L61 "Source code on GitHub")

Get the timeout

**Examples**

```javascript
console.log(sitemapper.timeout);
```

Returns **Timeout** 

## url

[src/assets/sitemapper.js:88-90](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L88-L90 "Source code on GitHub")

Get the url to parse

**Examples**

```javascript
console.log(sitemapper.url)
```

Returns **string** 

## url

[src/assets/sitemapper.js:79-81](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L79-L81 "Source code on GitHub")

**Parameters**

-   `url` **string** url for making requests. Should be a link to a sitemaps.xml

**Examples**

```javascript
sitemapper.url = 'http://wp.seantburke.com/sitemap.xml'
```

# ParseData

[src/assets/sitemapper.js:19-194](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L19-L194 "Source code on GitHub")

Resolve handler type for the promise in this.parse()

**Properties**

-   `error` **Error** that either comes from `xmlParse` or `request` or custom error
-   `data` **Object** 
    -   `data.url` **string** URL of sitemap
    -   `data.urlset` **Array** Array of returned URLs
        -   `data.urlset.url` **string** single Url
    -   `data.sitemapindex` **Object** index of sitemap
        -   `data.sitemapindex.sitemap` **string** Sitemap

**Examples**

```javascript
{
       error: "There was an error!"
       data: {
         url: 'linkedin.com',
         urlset: [{
           url: 'www.linkedin.com/project1'
         },[{
           url: 'www.linkedin.com/project2'
         }]
       }
}
```

# SitesArray

[src/assets/sitemapper.js:19-194](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L19-L194 "Source code on GitHub")

An array of urls

**Examples**

```javascript
[
           'www.google.com',
           'www.linkedin.com'
         ]
```

# SitesData

[src/assets/sitemapper.js:19-194](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L19-L194 "Source code on GitHub")

Resolve handler type for the promise in this.parse()

**Properties**

-   `url` **string** the original url used to query the data
-   `sites` **SitesArray** 

**Examples**

```javascript
{
         url: 'linkedin.com/sitemap.xml',
         sites: [
           'linkedin.com/project1',
           'linkedin.com/project2'
           ]
```

# Timeout

[src/assets/sitemapper.js:19-194](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L19-L194 "Source code on GitHub")

Timeout in milliseconds

# xmlParse

[src/assets/sitemapper.js:11-11](https://github.com/hawaiianchimp/sitemapper/blob/a91e18a19ef26b53870bfb3db9d2c6b4d3ad87ae/src/assets/sitemapper.js#L11-L11 "Source code on GitHub")

Sitemap Parser

Copyright (c) 2014 Sean Thomas Burke
Licensed under the MIT license.
