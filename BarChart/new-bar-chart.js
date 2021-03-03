let width = document.querySelector(".glass").offsetWidth
let height = document.querySelector(".glass").offsetHeight
let margin = {
    top: height / 10,
    right: width / 20,
    bottom: height / 10,
    left: width / 20,
}
let charWidth = width - margin.left - margin.right;
let charHeight = height - margin.top - margin.bottom;

d3.json('/Scrapper/results.json')
    .then(data => {
        buildChart(data, charWidth, charHeight)

        window.addEventListener('resize', (e) => {
            d3.select('svg').remove()
            let width = document.querySelector(".glass").offsetWidth
            margin = {
                top: height / 10,
                right: width / 20,
                bottom: height / 10,
                left: width / 20,
            }
            charWidth = width - margin.left - margin.right;;
            buildChart(data, charWidth, charHeight)
        })
    })
    .catch((error) => {
        throw error;
    });

function buildChart(data, width, height) {

    let animationSpeed = 1000
    let entries = initialLetters(data)
        .sort((x, y) => d3.descending(x.value, y.value))
    let letters = entries.map(d => d.key)
    let maxCount = d3.max(entries, d => d.value)

    let svg = d3.select('#chart1')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //scales
    let x = d3.scaleBand()
        .range([0, width])
        .padding(0.15)
        .domain(letters)

    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, maxCount])
        .nice()

    svg.append('g') // x axis
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('text-anchor', 'middle')

    svg.selectAll('.bar-group')
        .data(entries, d => d.key)
        .join(enter => {
            let bar = enter.append('g')
                .attr('class', 'bar-group')
                .style('opacity', 1)

            bar.append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.key))
                .attr('y', d => y(0))
                .attr('width', x.bandwidth())
                .attr('height', 0)
                .attr("rx", 2)
                .on("mouseover", mouseOver)
                .on("mouseout", mouseOut)
                .transition()
                .delay(animationSpeed / 10)
                .duration(animationSpeed)
                .attr('y', d => y(d.value))
                .attr('height', d => height - y(d.value))

            bar.append('text')
                .classed('textbar', true)
                .attr('x', d => x(d.key) + (x.bandwidth() / 2))
                .attr('text-anchor', 'middle')
                .attr("y", d => {
                    return height;
                })
                .attr("height", 0)
                .style('opacity', 0)
                .transition()
                .duration(animationSpeed)
                .text(d => d.value)
                .attr('y', d => y(d.value) - 10)
                .style('opacity', 1)
        })
}

function initialLetters(data) {
    data = data.filter(v => v.bandName != null)
    let bandInitials = []
    //RegEX for replacing THE and STRANGE CHARACTERS
    for (let i = 0; i < data.length; i++) {
        let the = /(the )/gi;
        let strangeChar = /[^a-z0-9]/gi

        // Checking f the name contains 'The ', then replace it with ''.
        if (data[i].bandName.matchAll(the)) {
            data[i].bandName = data[i].bandName.replaceAll(the, '')
            if (data[i].bandName.matchAll(strangeChar)) {
                data[i].bandName = data[i].bandName.replaceAll(strangeChar, '#')
            }
        }
        if (data[i].bandName.matchAll(strangeChar)) {
            data[i].bandName = data[i].bandName.replaceAll(strangeChar, '#')
        }
        bandInitials.push(data[i])
    }
    let rolled = d3.rollup(bandInitials, v => v.length, d => d.bandName.charAt(0))
    let entries = Array.from(rolled, ([key, value]) => ({
        key,
        value
    }))
    return entries
}

function mouseOver() {
    d3.select(this)
        .classed('bar', false)
        .classed('bar-select', true)
}

function mouseOut() {
    d3.select(this)
        .classed('bar', true)
        .classed('bar-select', false)
}