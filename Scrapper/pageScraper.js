// run it on terminal: 'npm start run'

const scraperObject = {
    url: 'http://www.darklyrics.com',
    async scraper(browser) {

        let allUrl = []
        let bands = []
        let errors = []

        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0)
        //Collecting the alphabet list of links
        console.log(`Opening ${this.url}`);
        await page.goto(this.url);
        let alphabetList = await page.$$eval('div.listrow a', urls => urls.map(url1 => url1.href))
        page.close()

        // loop through the alphavet list to collect all the band links - there are 2 elements, that's why the lenght '/2'
        for (let i = 0; i < alphabetList.length / 2; i++) {
            let allArtistsPage = await browser.newPage()
            await allArtistsPage.setDefaultNavigationTimeout(0)

            // Image and CSS request interceptors - blocking them to improve the performance
            page.on('request', request => {
                if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
                    request.abort();
                else
                    request.continue();
            });
            console.log(`index ${i} | Scrapping page ${alphabetList[i]}`);
            await allArtistsPage.goto(alphabetList[i]);
            let artistList2 = await allArtistsPage.$$eval('div.artists.fr a', urls => urls.map(url1 => url1.href))
            let artistList1 = await allArtistsPage.$$eval('div.artists.fl a', urls => urls.map(url1 => url1.href))
            let artistsUrlList = artistList1.concat(artistList2)
            allUrl.push(artistsUrlList)

            allArtistsPage.close()
        }

        //Filter the band links to darklyrics only: from 8973 original links to 8734 remaining
        allUrl = allUrl.flat().filter(item => ~item.indexOf("darklyrics"));

        //loop thrugh the band links, returnng a band element with all the information inside
        for (let i = 0; i < allUrl.length; i++) {
            let artistPage = await browser.newPage()
            await artistPage.setDefaultNavigationTimeout(0)

            console.log(`index ${i} | Scrapping the band page ${allUrl[i]}`)
            await artistPage.goto(allUrl[i]);

            //try/ catch as some of the links will throw errors
            try {
                let bandName = await artistPage.$$eval('div.cont h1', band => band.map(name => name.textContent))
                let albumData = await artistPage.$$eval('div.album', albums => albums.map(album => {

                    let nameAndYear = album.querySelector('h2').textContent
                    if (!nameAndYear.includes('(\([0-9 a-z]{4}\))')) {
                        nameAndYear += '(0000)'
                    }

                    let albumName;
                    try {
                        albumName = album.querySelector('h2 strong').textContent
                    } catch (error) {
                        albumName = album.querySelector('h2').textContent;
                    }

                    let albumType
                    try {
                        albumType = album.textContent.split(':')[0]
                    } catch (error) {
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
                        albumYear: nameAndYear.match(/([0-9]{4})/).slice(1, 2)[0],
                        albumSongs: aSongs,
                    }
                }))
                let band = new Object({
                    bandName: bandName[0].replace(' LYRICS', ''),
                    bandUrl: allUrl[i],
                    bandAlbums: albumData
                })
                bands.push(band)
                artistPage.close()

            } catch (error) {
                //collecting errors as well in the same band element
                console.log('Error: ' + allUrl[i])
                let band = new Object({
                    bandUrl: allUrl[i],
                    error: error
                })
                errors.push(band)
                artistPage.close()
            }
            //writing the results to JSON
            const fs = require('fs');
            fs.writeFileSync('./results.json', JSON.stringify(bands, null, '\t'));
            fs.writeFileSync('./errors.json', JSON.stringify(errors, null, '\t'));
        }
        await browser.close();
    }
}
module.exports = scraperObject;