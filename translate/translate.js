// Need to setup the cloud client library authentication: export GOOGLE_APPLICATION_CREDENTIALS="(json location)"

const {
  Translate
} = require('@google-cloud/translate').v2;
const translate = new Translate();
const target = 'en';

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results.json', 'utf8'));

getAndTranslate(data)

async function getAndTranslate(data) {
  for (b in data) {
    let band = data[b]
    console.log()
    console.log(`:::::::::: translating band: ${band.bandName} - ${Math.round((b/data.length)*100)}%`)
    for (a in band.bandAlbums) {
      let album = band.bandAlbums[a]
      for (s in album.albumSongs) {
        let song = album.albumSongs[s]
        if (!song.orignialLanguage) { // this checks  and skip the file if the song has the originalLanguage object exists
          let originalLanguage = await detectLanguage(song.songName)
          if (originalLanguage[0].language !== 'en') {
            let translatedSong = await translateText(song.songName)
            console.log(`:: translation: ${song.songName}`)
            song['orignialLanguage'] = originalLanguage
            song['songEn'] = translatedSong
            fs.writeFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results.json', JSON.stringify(data, null, '\t'))
          } else {
            console.log(`- song: ${song.songName}`)
            song['orignialLanguage'] = {
              "language": "en",
              "confidence": '',
              "input": song.songName
            }
            song['songEn'] = song.songName
            fs.writeFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results.json', JSON.stringify(data, null, '\t'))
          }
        }
      }
    }
  }
}

async function translateText(originalString) {
  let [translations] = await translate.translate(originalString, target);
  translations = Array.isArray(translations) ? translations : [translations];
  return translations;
}

async function detectLanguage(originalString) {
  let [detections] = await translate.detect(originalString);
  detections = Array.isArray(detections) ? detections : [detections];
  return detections
}