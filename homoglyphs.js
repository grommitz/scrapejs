let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');
let got = require('got');

async function scrape() {
    const url = "http://homoglyphs.net/?text=&unicodepos=1&lang=en";
    const html = await got(url);
    const $ = cheerio.load(html.body);
    jsonframe($); // initializes the plugin

    var frame = {
        chars : {
            _s : "tr.hglistod, tr.hglistev",
            _d : [{
                "char" : "td.charleft",
                "homoglyphs" : [ "td.char, td.upos" ]
            }]
        } 
    };
    
    var data = $('body').scrape(frame);

    for (let ch of data.chars) {
        var chr = ch.char;
        var upos = ch.homoglyphs.shift();
        var homs = ch.homoglyphs.filter(s => s.trim() != ""); // remove the blanks
        //console.log("char = " + chr + " (" + upos + "), homoglyphs = " + homs);
        var charsonly = [];
        for (var i=0; i<homs.length; i = i+2) {
            charsonly.push(homs[i]);
        }
        console.log(chr + "," + charsonly);
    }
}

scrape();

