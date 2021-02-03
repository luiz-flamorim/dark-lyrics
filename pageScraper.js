const scraperObject = {
    url: 'http://www.darklyrics.com',
    async scraper(browser) {
        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0)

        console.log(`Opening ${this.url}`);
        await page.goto(this.url);
        let alphabetList = await page.$$eval('div.listrow a', urls => urls.map(url1 => url1.href))

        page.close()

        let allUrl = []

        for (let i = 0; i < alphabetList.length / 2; i++) {

            let allArtistsPage = await browser.newPage()
            await allArtistsPage.setDefaultNavigationTimeout(0)

            console.log(`Scrapping page ${alphabetList[i]}`);
            await allArtistsPage.goto(alphabetList[i]);

            let artistList2 = await allArtistsPage.$$eval('div.artists.fr a', urls => urls.map(url1 => url1.href))
            let artistList1 = await allArtistsPage.$$eval('div.artists.fl a', urls => urls.map(url1 => url1.href))
            let artistsUrlList = artistList1.concat(artistList2)

            allUrl.push(artistsUrlList)
            // console.log(artistsUrlList);

            allArtistsPage.close()
        }

        allUrl = allUrl.flat()
        console.log(allUrl)

        await browser.close();
    }
}

module.exports = scraperObject;