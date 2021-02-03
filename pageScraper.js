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
        let bands = []

        for (let i = 0; i < alphabetList.length / 2; i++) {

            let allArtistsPage = await browser.newPage()
            await allArtistsPage.setDefaultNavigationTimeout(0)

            console.log(`Scrapping page ${alphabetList[i]}`);
            await allArtistsPage.goto(alphabetList[i]);

            let artistList2 = await allArtistsPage.$$eval('div.artists.fr a', urls => urls.map(url1 => url1.href))
            let artistList1 = await allArtistsPage.$$eval('div.artists.fl a', urls => urls.map(url1 => url1.href))
            let artistsUrlList = artistList1.concat(artistList2)

            allUrl.push(artistsUrlList)

            allArtistsPage.close()
        }

        allUrl = allUrl.flat()
        //check if the urls are from darklyrics
        
        for (let i = 0; i < 5; i++) { //replace 1 per allUrl.length
            let artistPage = await browser.newPage()
            await artistPage.setDefaultNavigationTimeout(0)
            
            console.log(`Scrapping the band page ${allUrl[i]}`)
            await artistPage.goto(allUrl[i]);
            
            let bandName = await artistPage.$$eval('div.cont h1', band => band.map(name => name.textContent))
            let albumName = await artistPage.$$eval('div.album h2', band => band.map(name => name.textContent))
            
            let band = new Object({
                url: allUrl[i],
                name: bandName[0].replace(' LYRICS',''),
                album: albumName
            })

            bands.push(band)
        }

        console.log(bands)

        await browser.close();
        
    }
}

module.exports = scraperObject;