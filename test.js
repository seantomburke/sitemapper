const axios = require('axios');

axios
.get('https://www.imot.bg/sitemap/week/weekly_sitemap2019-1.xml.gz', {
    headers: {
        'Accept-Encoding': 'gzip',
        'Content-Encoding': 'identity',
    },
    responseType: 'stream',
})
.then(response => {
    console.log(response.headers);

    const chunks = [];

    response.data.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    // Send the buffer or you can put it into a var
    response.data.on("end", function () {
      console.log(chunks.join(''));
    });

});