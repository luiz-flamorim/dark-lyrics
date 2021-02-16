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

        for (let i = 0; i < 10; i++) { //alphabetList.length/2

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

        allUrl = allUrl.flat().filter(item => ~item.indexOf("darklyrics"));
        //I have filtered links not matching to darlyrics.com: 8973 original links to 8734 remaining

        for (let i = 0; i < 10; i++) { //allUrl.length
            let artistPage = await browser.newPage()
            await artistPage.setDefaultNavigationTimeout(0)

            console.log(`Scrapping the band page ${allUrl[i]}`)
            await artistPage.goto(allUrl[i]);

            let bandName = await artistPage.$$eval('div.cont h1', band => band.map(name => name.textContent))

            let albumData = await artistPage.$$eval('div.album', albums => albums.map(album => {
                const nameAndYear = album.querySelector('h2').textContent;
                const albumName = album.querySelector('h2 strong').textContent;

                const aSongs = Array.from(album.querySelectorAll('a')).map(song => {
                    const songName = song.textContent
                    const songUrl = song.href

                    return {
                        songName: songName,
                        songUrl: songUrl
                    }
                })

                return {
                    albumName: albumName.replaceAll('\"',''),
                    albumYear: nameAndYear.match(/\(([^\)]+)\)/).slice(1, 2),
                    albumSongs: aSongs,
                }
            }))

            let band = new Object({
                url: allUrl[i],
                name: bandName[0].replace(' LYRICS', ''),
                albums: albumData
            })

            bands.push(band)
        }


        const fs = require('fs');
        fs.writeFileSync('./results.json', JSON.stringify(bands));

        await browser.close();

    }
}

module.exports = scraperObject;

//-------backup!

// for (a in albumData) {
//     for (b in albumData[a].aSongs) {
//         console.log(albumData[a].aSongs[b])
//     }
// }

// for(a in bands){
//     console.log(bands[a])
// }