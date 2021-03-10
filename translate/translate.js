// Imports the Google Cloud client library
const {
  Translate
} = require('@google-cloud/translate').v2;
const translate = new Translate();
let text = '';
const target = 'en';
const fs = require('fs');
// const data = JSON.parse(fs.readFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('/Users/luizamorim/Desktop/darklyrics/Scrapper/results_test.json', 'utf8'));

translateToJson(data)

async function translateToJson(data) {
  let originalLanguage = getOriginalTitles(data)
  let enSongName =  originalLanguage.forEach(song => {
  //   let s = song.toString()
  let result =  translateText(song)
  
})

console.log(result)

}

// detectLanguage();
// translateText();

async function translateText(originalString) {
  let [translations] = await translate.translate(originalString, target);
  translations = Array.isArray(translations) ? translations : [translations];
  // console.log('Translations:');
  translations.forEach((translation, i) => {
    // console.log(`${text} => (${target}) ${translation}`);
    return translation;
  });
}

async function detectLanguage() {
  let [detections] = await translate.detect(text);
  detections = Array.isArray(detections) ? detections : [detections];
  // console.log('Detections:');
  detections.forEach(detection => {
    console.log(`${detection.input} => ${detection.language}`);
  });
}

function getOriginalTitles(data) {
  let foreignTitles = []
  data.forEach(band => {
    band.bandAlbums.forEach(album => {
      album.albumSongs.forEach(song => {
        foreignTitles.push(song.songName)
      });
    });
  })
  // console.log(foreignTitles)
  return foreignTitles
}