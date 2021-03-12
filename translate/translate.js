const {
  Translate
} = require('@google-cloud/translate').v2;
const translate = new Translate();
const target = 'en';

const fs = require('fs');
// const data = JSON.parse(fs.readFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results_test.json', 'utf8'));

getAndTranslate(data)

async function getAndTranslate(data) {
  for (b in data) {
    let band = data[b]
    for (a in band.bandAlbums) {
      let album = band.bandAlbums[a]
      for (s in album.albumSongs) {
        let song = album.albumSongs[s]
        let translatedSong = await translateText(song.songName)
        let originalLanguage = await detectLanguage(song.songName)
        // console.log(translatedSong, [originalLanguage[0].language])
        song['orignialLanguage'] = originalLanguage
        song['songEn'] = translatedSong
        fs.writeFileSync('./results-33.json', JSON.stringify(data, null, '\t'))
      }
    }
  }
}

async function translateText(originalString) {
  let [translations] = await translate.translate(originalString, target);
  translations = Array.isArray(translations) ? translations : [translations];
  translations.forEach((translation, i) => {
    // console.log(`${text} => (${target}) ${translation}`);
  });
  // console.log(translations)
  return translations;
}

async function detectLanguage(originalString) {
  let [detections] = await translate.detect(originalString);
  detections = Array.isArray(detections) ? detections : [detections];
  detections.forEach(detection => {
    // console.log(`${detection.input} => ${detection.language}`);
  });
  return detections
}