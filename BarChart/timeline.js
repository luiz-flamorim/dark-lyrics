const height = window.innerHeight
const width = window.innerWidth

d3.json('/Scrapper/results.json')
    .then(data => {
        createTimeline(data)
    })

function createTimeline(data) {

    // const svg = d3.select('#dots')
    //     .attr("viewBox", [0, 0, width, height]);

    let yearCount = new Map();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].bandAlbums.length; j++) {
            if (!yearCount.has(data[i].bandAlbums[j].albumYear)) {
                yearCount.set(`${data[i].bandAlbums[j].albumYear}`, 1)
            } else {
                yearCount.set(`${data[i].bandAlbums[j].albumYear}`, yearCount.get(`${data[i].bandAlbums[j].albumYear}`) + 1)
            }
        }
    }
    // const sortedYears = Array.from(yearCount.key).sort()

    
    // const years = yearCount.map(d => d.key)
    
    
    // console.log(yearCount)
    console.log(yearCount.forEach(d => d.get(d)))

// const scale = d3.scalePoint()
//     .domain(config.domain)
//     .range(config.range)
//     .padding(config.padding)
//     .round(config.round)

}