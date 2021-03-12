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
  const translatedSongs = await translateText(originalLanguage)
  // console.log(translatedSongs)
  translatedSongs.forEach(song => console.log(song))

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

async function getOriginalTitles(data) {
  let foreignTitles = []
  data.forEach(band => {
    band.bandAlbums.forEach(album => {
      album.albumSongs.forEach(song => {
        foreignTitles.push(song.songName)

        // create a new attribute for the name in english
        // translate the song name using the google function
        // push the new song name to the new attribute

        // create a new attribute for the original language
        // check the original language using the google function
        // push the original language to the new atribute
      });
    });
  })
  // console.log(foreignTitles)
  return foreignTitles
}