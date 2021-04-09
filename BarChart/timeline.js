const margin = {
    left: 50,
    right: 50,
    top: 100,
    bottom: 200
}
const height = window.innerHeight - margin.top - margin.bottom
const width = window.innerWidth - margin.left - margin.right

d3.json('/Scrapper/results.json')
    .then(data => {
        createTimeline(data)
    })

function createTimeline(data) {

    // d3.select('#timeline')
    // .attr('height','5000px')

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
    const sortedYears = Array.from(yearCount.keys()).sort()
    const sortedValues = Array.from(yearCount.values()).sort()

    const scale = d3.scalePoint()
        .domain(sortedYears)
        .range([height-margin.bottom, 0])

    const minMaxScale = d3.scaleLinear()
        .domain([d3.min(sortedValues), d3.max(sortedValues)])
        .range([10, 100])

    let svg = d3.select('#timeline')
        .append('div')
        .classed('svg-container', true)
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed('svg-content-responsive', true)
        .style('background-color','red')
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    let x = width / 2 - margin.left

    let circles = svg.selectAll('circles')
        .data(yearCount);

    circles.join('circle')
        .attr('cx', x)
        .attr('cy', d => scale(d[0]))
        .attr('r', d => minMaxScale(d[1]))

    circles.join('text')
        .attr('x', x + 10)
        .attr('y', d => scale(d[0]))
        .text(d => d[0])
        .style('fill', '#fff')
}