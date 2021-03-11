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

let originalLanguage = getOriginalTitles(data)

updateJson()

async function updateJson(){
  const traslatedSongs = await translateText(originalLanguage)
  // traslatedSongs.forEach(song => )
  console.log(traslatedSongs)
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
  // console.log('Detections:');
  detections.forEach(detection => {
    // console.log(`${detection.input} => ${detection.language}`);
  });
  return detections
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