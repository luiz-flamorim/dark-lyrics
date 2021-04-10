const margin = {
    left: 50,
    right: 50,
    top: 100,
    bottom: 200
}
const height = 3000 - margin.top - margin.bottom
const width = window.innerWidth - margin.left - margin.right

d3.json('/Scrapper/results.json')
    .then(data => {
        createTimeline(data)
    })

function createTimeline(data) {

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
    yearCount.delete('0000')
    // console.log(yearCount)

    const sortedYears = Array.from(yearCount.keys()).sort()
    const sortedValues = Array.from(yearCount.values()).sort()

    const scale = d3.scalePoint()
        .domain(sortedYears)
        .range([height - margin.bottom, 0])

    // const scale = d3.scaleTime()
    //     .domain(sortedYears)
    //     .range([height - margin.bottom, 0])

    const minMaxScale = d3.scaleLinear()
        .domain([d3.min(sortedValues), d3.max(sortedValues)])
        .range([10, 200])

    let svg = d3.select('#timeline')
        .append('div')
        .classed('svg-container', true)
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .classed('svg-content-responsive', true)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    let x = width / 2 - margin.left

    let circles = svg.selectAll('circles')
        .data(yearCount);

    circles.join('circle')
        .attr('cx', x)
        .attr('cy', d => scale(d[0]))
        .attr('r', d => minMaxScale(d[1]))
        .style('fill', 'none')
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .style('stroke-opacity', '0.5')
        .on("mouseover", mouseOver)
        .on("mouseout", mouseOut)

    circles.join('text')
        .attr('x', x)
        .attr('y', d => scale(d[0]))
        .text(d => d[0])
        .style('fill', '#fff')
        .style("font-size", 12)
        .style("font-family", 'Lekton')
        .style("alignment-baseline", 'central')
        .style("text-anchor", 'middle')

    const tooltip = d3.select("#timeline")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("padding", "10px")

}

function mouseOver() {
    d3.select(this)
        .style('stroke', 'red')
        .append("title")
        .text(d => `${d[1]} albums were released in ${d[0]}`)
}

function mouseOut() {
    d3.select(this)
        .style('stroke', 'white')
}

//tooltip
// https://github.com/Caged/d3-tip/blob/HEAD/docs/index.md