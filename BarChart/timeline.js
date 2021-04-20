const margin = {
    left: 50,
    right: 50,
    top: 100,
    bottom: 200
}
const height = 3000 - margin.top - margin.bottom
const width = window.innerWidth - margin.left - margin.right

createModal()
//I am creating the Modal Div structure here to not think about the html now

d3.json('/Scrapper/results.json')
    .then(data => {
        createTimeline(data)
    })

function createTimeline(data) {

    let yearCount = new Map()
    let yearAlbum = new Map()

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].bandAlbums.length; j++) {
            if (!yearCount.has(data[i].bandAlbums[j].albumYear)) {
                yearCount.set(`${data[i].bandAlbums[j].albumYear}`, 1)
            } else {
                yearCount.set(`${data[i].bandAlbums[j].albumYear}`, yearCount.get(`${data[i].bandAlbums[j].albumYear}`) + 1)
            }
            // if (!yearAlbum.has(data[i].bandAlbums[j].albumYear)) {
            //     yearAlbum.set(`${data[i].bandAlbums[j].albumYear}`, [`${data[i].bandAlbums[j].albumName}`])
            // } else {
            //     yearAlbum.set(`${data[i].bandAlbums[j].albumYear}`, yearAlbum.get(`${data[i].bandAlbums[j].albumYear}`).push(`${data[i].bandAlbums[j].albumName}`))
            // }
        }
    }

    yearCount.delete('0000')
    // console.log(yearAlbum)

    const sortedYears = Array.from(yearCount.keys()).sort()
    const sortedValues = Array.from(yearCount.values()).sort()

    const scale = d3.scalePoint()
        .domain(sortedYears)
        .range([height - margin.bottom, 0])

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

    thinCircle = circles.join('circle')
        .attr('cx', x)
        .attr('cy', d => scale(d[0]))
        .attr('r', d => minMaxScale(d[1]))
        .attr('id', (d, i) => 'circleID-' + i)
        .style('fill', 'none')
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .style('stroke-opacity', '0.5')

    circles.join('circle')
        .attr('cx', x)
        .attr('cy', d => scale(d[0]))
        .attr('r', d => minMaxScale(d[1]))
        .attr('id', (d, i) => 'thickCircleID-' + i)
        .style('fill', 'none')
        .style('stroke', 'black')
        .style('stroke-width', '20px')
        .style('stroke-opacity', '0')
        .on("mouseover", mouseOver)
        .on("click", mouseClick)
        .on("mouseout", mouseOut)

    circleText = circles.join('text')
        .attr('x', x)
        .attr('y', d => scale(d[0]))
        .attr('id', (d, i) => 'textID-' + i)
        .text(d => d[0])
        .style('fill', '#fff')
        .style("font-size", 12)
        .style("font-family", 'Lekton')
        .style("alignment-baseline", 'central')
        .style("text-anchor", 'middle')
        .on("mouseover", mouseOver)
        .on("click", mouseClick)
        .on("mouseout", mouseOut)

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
    let numberId = d3.select(this).attr('id').split('-')[1]
    let textID = d3.select(`#textID-${numberId}`)
        .style('fill', 'red')
    let circleId = d3.select(`#circleID-${numberId}`)
        .style('stroke', 'red')

    d3.select(this)
        .append("title")
        .text(d => `${d[1]} albums were released in ${d[0]}`)

    //tooltip
    // https://github.com/Caged/d3-tip/blob/HEAD/docs/index.md

}

function mouseOut() {
    let numberId = d3.select(this).attr('id').split('-')[1]
    let textID = d3.select(`#textID-${numberId}`)
        .style('fill', 'white')
    let circleId = d3.select(`#circleID-${numberId}`)
        .style('stroke', 'white')
}

function mouseClick() {
    // const str = this.querySelector('title').innerHTML.split(' ')
    // const year = str[str.length - 1]
    // //need to use the 'year' filter above to map the albums released on that year.


    let numberId = d3.select(this).attr('id').split('-')[1]
    let circleId = d3.select(`#circleID-${numberId}`)
        .style('stroke-width', '3px')
        .style('stroke-opacity', '1')
        .transition()
        .style('stroke-width', '1px')
        .style('stroke-opacity', '0.5')


    let window = document.querySelector('#modal')
    let bg = document.querySelector('.modal-bg')

    bg.classList.add('bg-active')

    let card = document.createElement('div')
    card.setAttribute('id', `card-${numberId}`)
    window.appendChild(card)

    let contentDiv = document.createElement('div')
    card.appendChild(contentDiv)

    let imageDiv = document.createElement('div')
    card.appendChild(imageDiv)

    let xClose = document.createElement('span')
    xClose.innerHTML = 'X'
    xClose.setAttribute('class', 'close')
    card.appendChild(xClose)
    xClose.addEventListener('click', function(){
        window.innerHTML = ''
        bg.classList.remove('bg-active')
    })


}

function createModal(){
    let domBody = document.querySelector('body')

    let modalDiv = document.createElement('div')
    modalDiv.setAttribute('class', 'modal-bg')
    domBody.appendChild(modalDiv)

    let modalInside = document.createElement('div')
    modalInside.setAttribute('class', 'modal')
    modalInside.setAttribute('id', 'modal')
    modalDiv.appendChild(modalInside)
}