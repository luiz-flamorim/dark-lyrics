# DarkLyrics

this is a live README file, so I will be updating it with the new info =D

## Intro

Dark Lyrics is a project that I created to study JavaScript in two aspects: scraping data and then visualising it. I am doing this work with the incredible Christina Levengood @lvngd. She has accepted not only to mentor me throguh this journey, but also in using her Developers super powers (and patience! a lot of patience!) to bring this idea to life.

**I am in any way using this for any commercial purposes**, so I would expect anyone interested in doing it so to contact the website owners. My only interest is to learn how to code and visualise data - Please see the license section below.

## The process
I have chosen [DarkLyrics](http://www.darklyrics.com) as it is a good repository for metal bands. It's quite impressive the volume of information of this website, and also the organisation they keep. it has allowed me to scrape the data in a quite easy way, as everything was quite in place.

I have used Puppeteer as the main tool for scrapping as it works such as a robot: it opens a hiddens instance of Chromium and then navigates into the links tagging the different elements on the DOM. I have build it on four steps:
1- Get the A-Z list of band pages
2- loop through the list to get the links of each band
3- loop through each band link to build an object with the information
4- record the object in a JSON file

## License
[MIT](https://choosealicense.com/licenses/mit/)
Please notice this license is in regards to the code I have written, as I have no ownership of the content of the DarkLyrics website. Please contact the website owners to discuss any usage of its data.