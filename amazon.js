let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');
let got = require('got');

async function scrape() {
    const url = "https://www.amazon.co.uk/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=hermes";
    const html = await got(url);
    const $ = cheerio.load(html.body);
    jsonframe($); // initializes the plugin

    var frame = {
        items : {
            _s : ".s-item-container",
            _d : [{
                "title" : ".s-access-title",
                "price" : ".s-price",
                "seller" : ".a-color-secondary+ .a-color-secondary"
            }]
        } 
    };
    
    var data = $('body').scrape(frame);
    
    for (let item of data.items) {
        console.log(item.title + ", sold by " + item.seller + ", price:" + item.price);
    }
}

scrape();

