const scraperObject = {
    url: 'http://www.darklyrics.com',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0)

        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        let alphabetList = await page.$$eval('div.listrow a', urls => urls.map(url1 => url1.href))
        // console.log(alphabetList);

        page.close()

        for (let i = 0; i<alphabetList.length/2; i++) {

            let allArtists = await browser.newPage()
            await allArtists.setDefaultNavigationTimeout(0)

            console.log(`i = ${i} - Navigating to ${alphabetList[i]}...`);
            await allArtists.goto(alphabetList[i]);

            let artistList2 = await allArtists.$$eval('div.artists.fr a', urls => urls.map(url1 => url1.href))
            let artistList1 = await allArtists.$$eval('div.artists.fl a', urls => urls.map(url1 => url1.href))
            let allUrls = artistList1.concat(artistList2)

            console.log(allUrls);

            allArtists.close()
        }

        await browser.close();
    }
}

module.exports = scraperObject;