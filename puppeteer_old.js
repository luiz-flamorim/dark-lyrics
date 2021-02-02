const puppeteer = require('puppeteer')

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '19'];
const rawUrl = 'http://www.darklyrics.com/'
let bandUrls = [];

for (let i = 0; i <= alphabet.length; i++) {
    let url = rawUrl + alphabet[i] + '.html'

    scrape(url);

}

const fs = require('fs');
fs.writeFileSync('./results.json', bandUrls);

async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url)

    const loadUrl = await page.$$eval('.artists a', urls => urls.map(url1 => url1.href));
    const getUrl = JSON.stringify(loadUrl);
    bandUrls.push(getUrl)

    console.log(bandUrls)

    // const fs = require('fs');
    // fs.writeFileSync('./results.json', getUrl);

    await browser.close();
}


//BACKUP! - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// this gets all the hrefs on the page
// const hrefs = await page.evaluate(
//     () => Array.from(
//         document.querySelectorAll('a[href]'),
//         a => a.getAttribute('href')
//     ))
// let bandUrl = JSON.stringify(hrefs)

//this is to get all the band names on the two columns
// const [el1] = await page.$x('//*[@id="main"]/div[5]/div/div[3]');
// const nameCol1 = await el1.getProperty('textContent');
// const artistColumn1 = await nameCol1.jsonValue();

// const [el3] = await page.$x('//*[@id="main"]/div[5]/div/div[2]');
// const nameCol2 = await el3.getProperty('textContent');
// const artistColumn2 = await nameCol2.jsonValue();

// let bandNamesToParse = (artistColumn1 + artistColumn2).split("\n");
// let parsedBands = [];

// for (let i = 0; i < bandNamesToParse.length; i++) {
//     let bands = {
//         "artist": bandNamesToParse[i],
//     }
//     if (bandNamesToParse[i] != "") {
//         parsedBands.push(bands)
//     }
// }