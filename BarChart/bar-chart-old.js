//load the data and parse the results
// d3.json('source')
//     .then(data => functionToTraw(data))

// inside of the function:
// define margins
// define width and height
// create the svg
// create scales
// inside of the results:
// - build the group 'g'for the axis
// - build a function for the bars

// Version 01 -------------------------------------------------------------------

d3.json('/Scrapper/results.json')
    .then(data => drawGraph(data));


function drawGraph(data) {

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
                data[i].bandName = data[i].bandName.replaceAll(strangeChar, '&')
            }
        }

        if (data[i].bandName.matchAll(strangeChar)) {
            data[i].bandName = data[i].bandName.replaceAll(strangeChar, '&')

        }

        bandInitials.push(data[i])

    }

    let rolled = d3.rollup(bandInitials, v => v.length, d => d.bandName.charAt(0))
    let entries = Array.from(rolled, ([key, value]) => ({
        key,
        value
    }))


    const svgBackgroundColor = '#f1f1f1',
        barFillColor = 'grey',
        fontFamily = 'sans-serif';

    const margin = {
            top: 50,
            right: 40,
            bottom: 50,
            left: 40
        },
        width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', svgBackgroundColor)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const maxCount = d3.max(entries, d => d.value);
    let letters = entries.map(d => d.key);
    letters = letters.sort();

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    //create a g element for the bar chart that will hold the axes and the bars
    let barChart = svg.append('g');

    //x-axis - the starting letters - scaleBand
    let x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(letters)
        .padding(0.1)

    let xAxis = barChart.append('g')
        .classed('axis--x', true)
        .call(d3.axisBottom(x))
        .style('font-size', '.5em')
        .style('font-weight', 'regular')
        .style('font-family', fontFamily)
        .attr('transform', 'translate(0,' + chartHeight + ')');

    //y-axis - the counts, so it should go from zero to the max count of the data
    let y = d3.scaleLinear()
        .range([chartHeight, 0])
        .domain([0, maxCount])
        .nice()

    let yAxis = barChart.append('g')
        .classed('axis--y', true)
        .call(d3.axisLeft(y))
        .style('font-size', '.5em')
        .style('font-weight', 'regular')
        .style('font-family', fontFamily);

    barChart
        .selectAll('rect')
        .data(entries)
        .enter()
        .append('rect')
        .attr('fill', barFillColor)
        .attr('x', d => x(d.key))
        .attr('y', d => y(d.value))
        .attr('width', x.bandwidth())
        .attr('height', d => chartHeight - y(d.value))

}




// version 02 ---------------------------------------------------------------


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