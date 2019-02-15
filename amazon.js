let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');
let got = require('got');

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

class Scraper {
    constructor(frame) {
        this.frame = frame;
    }

    async scrape(url) {
        const html = await got(url);
        const $ = cheerio.load(html.body);
        jsonframe($); // initializes the plugin
        let data = $('body').scrape(this.frame);
        let resp = new ScrapeResponse();
        //console.log(data);
        for (let item of data.items) {
            resp.items.push(new ScrapeItem(item.title, item.seller, item.price));
        }
        return resp;
    }
}

async function doScrape(url, frame) {

    let scraper = new Scraper(frame);
    let resp = await scraper.scrape(url);

    console.log("\nScraped " + resp.items.length + " items from " + frame.domain);

    for (var i = 0; i < resp.items.length; i++) {
        let item = resp.items[i];
        console.log("TITLE: " + item.title + "\n\tSELLER: " + item.seller + "\n\tPRICE: " + item.price);
    }
}

let amazonFrame = {
    domain : "amazon.co.uk",
    items : {
        _s : ".s-item-container",
        _d : [{
            "title" : ".s-access-title",
            "price" : ".s-price",
            "seller" : ".a-color-secondary+ .a-color-secondary"
        }]
    }
};

let ebayFrame = {
    domain : "ebay.com",
    items : {
        _s: ".clearfix",
        _d : [{
            "title" : ".s-item__title",
            "seller" : ".s-item__itemLocation",
            "price" : ".s-item__price"
        }]
    }
}

doScrape("https://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=hermes", amazonFrame);

doScrape("https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313.TR12.TRC2.A0.H0.Xipad.TRS0&_nkw=ipad&_sacat=0", ebayFrame);