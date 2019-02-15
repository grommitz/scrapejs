let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');
let got = require('got');


class ScrapeRequest {
    constructor(uri, frame) {
        this.uri = uri;
        this.frame = frame;
    }
}

class ScrapeItem {
    constructor(title, seller, price) {
        this.title = title;
        this.seller = seller;
        this.price = price;
    }
}

class ScrapeResponse {
    constructor() {
        this.items = [];
    }
}

async function scrape(req, resp) {

    const html = await got(req.uri);
    const $ = cheerio.load(html.body);
    jsonframe($); // initializes the plugin


    var data = $('body').scrape(req.frame);
    //console.log(data);

    for (let item of data.items) {
        resp.items.push(new ScrapeItem(item.title, item.seller, item.price));
    }
}

async function doScrape(req, resp) {

    await scrape(req, resp);
    console.log("Scraped " + resp.items.length + " items:");

    for (var i = 0; i < resp.items.length; i++) {
        let item = resp.items[i];
        console.log("TITLE: " + item.title + "\n\tSELLER: " + item.seller + "\n\tPRICE: " + item.price);
    }
}

var amazonFrame = {
    items : {
        _s : ".s-item-container",
        _d : [{
            "title" : ".s-access-title",
            "price" : ".s-price",
            "seller" : ".a-color-secondary+ .a-color-secondary"
        }]
    }
};

let resp = new ScrapeResponse();

doScrape(new ScrapeRequest("https://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=hermes",
    amazonFrame), resp);
