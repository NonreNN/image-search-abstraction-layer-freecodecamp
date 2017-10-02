const express = require('express');
const request = require('request');

const app = express();

const googleAPIKey = process.env.GOOGLE

let recentlySearch = []

app.get('/api/imagesearch/:search', function(req, res) {
    recentlySearch.push(req.params.search);
    let search = `https://www.googleapis.com/customsearch/v1?key=${googleAPIKey}&cx=012086283050852391430:eybjsxiukte&searchType=image&start=${req.query.offset}&q=${req.params.search}`
    request(search, function (error, response, body) {
        let bodyJSON = JSON.parse(body);
        let completed = []
        bodyJSON.items.forEach(function(element) {
            let obj = {url : element.link, snippet : element.snippet, thumbnail : element.image.thumbnailLink, context : element.image.contextLink}
            completed.push(obj)
        }, this);
        res.json(completed)         
    });   
});

app.get('/api/recently', function(req, res) {
    res.json({recently : recentlySearch});
});

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send('Search Image: https://debonair-street.glitch.me/api/imagesearch/cats?offset=10 \nrecently: https://debonair-street.glitch.me/api/recently')
});

app.listen(process.env.PORT || 3000);
