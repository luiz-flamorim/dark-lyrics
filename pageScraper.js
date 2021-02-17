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
        let errors = []

        for (let i = 0; i < alphabetList.length / 2; i++) {
        // for (let i = 0; i < 1; i++) {
            let allArtistsPage = await browser.newPage()
            await allArtistsPage.setDefaultNavigationTimeout(0)

            console.log(`index ${i} | Scrapping page ${alphabetList[i]}`);
            await allArtistsPage.goto(alphabetList[i]);

            let artistList2 = await allArtistsPage.$$eval('div.artists.fr a', urls => urls.map(url1 => url1.href))
            let artistList1 = await allArtistsPage.$$eval('div.artists.fl a', urls => urls.map(url1 => url1.href))
            let artistsUrlList = artistList1.concat(artistList2)

            allUrl.push(artistsUrlList)

            allArtistsPage.close()
        }

        allUrl = allUrl.flat().filter(item => ~item.indexOf("darklyrics"));
        //I have filtered links not matching to darlyrics.com: 8973 original links to 8734 remaining

        for (let i = 0; i < allUrl.length; i++) {
        // for (let i = 0; i < 1; i++) {
            let artistPage = await browser.newPage()
            await artistPage.setDefaultNavigationTimeout(0)

            console.log(`index ${i} | Scrapping the band page ${allUrl[i]}`)
            await artistPage.goto(allUrl[i]);

            //Checking if there is content in the page
            let isPageValid = await artistPage.$$eval('div.cont h2', band => band.map(name => name.textContent))

            if (!isPageValid[0].includes('not found')) {

                let bandName = await artistPage.$$eval('div.cont h1', band => band.map(name => name.textContent))

                let albumData = await artistPage.$$eval('div.album', albums => albums.map(album => {

                    let nameAndYear = album.querySelector('h2').textContent
                    if (!nameAndYear.includes('(')) {
                        nameAndYear += '(no data)'
                    }

                    let albumName
                    if (album.querySelector('h2 strong')) {
                        albumName = album.querySelector('h2 strong').textContent;
                    } else {
                        albumName = album.querySelector('h2').textContent;
                    }

                    let albumType
                    if(album.textContent.includes(':')){
                        albumType = album.textContent.split(':')[0]
                    } else {
                        albumType = '(no data)'
                    }

                    const aSongs = Array.from(album.querySelectorAll('a')).map(song => {
                        const songName = song.textContent
                        const songUrl = song.href
                        return {
                            songName: songName,
                            songUrl: songUrl
                        }
                    })
                    return {
                        albumName: albumName.replaceAll('\"', ''),
                        albumType: albumType.replaceAll('\n', ''),
                        albumYear: nameAndYear.match(/\(([^\)]+)\)/).slice(1, 2)[0],
                        albumSongs: aSongs,
                    }
                }))
                let band = new Object({
                    bandName: bandName[0].replace(' LYRICS', ''),
                    bandUrl: allUrl[i],
                    bandAlbums: albumData
                })
                bands.push(band)
            } else {
                console.log('Error: ' + allUrl[i])
                errors.push(allUrl[i])
            }
            const fs = require('fs');
            fs.writeFileSync('./results.json', JSON.stringify(bands, null, '\t'));
            fs.writeFileSync('./errors.json', JSON.stringify(errors, null, '\t'));
            // console.log(JSON.stringify(bands, null, '\t'))
        }
        await browser.close();
    }
}

module.exports = scraperObject;