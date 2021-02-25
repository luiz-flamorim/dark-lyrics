
    let chartWidth = document.querySelector(".glass").offsetWidth
    let chartHeight = document.querySelector(".glass").offsetHeight
    let margin = {
        top: 20,
        right: 25,
        bottom: 30,
        left: 25,
    }
    let width = chartWidth - margin.left - margin.right;
    let height = chartHeight - margin.top - margin.bottom;

d3.json('/Scrapper/results.json')
    .then(data => buildChart(data, width, height))
    .catch((error) => {
        throw error;
    });

    window.addEventListener('resize', (e) => {
        chartWidth = document.querySelector(".glass").offsetWidth
        buildChart(data, width, height)
    })

function buildChart(data, width, height) {

    //Q: how to make this relative to the CSS styles?
    let animationSpeed = 1000;

    let svg = d3.select('#chart1')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //Create the scales - fixed values
    let x = d3.scaleBand()
        .range([0, width])
        .padding(0.15)

    let y = d3.scaleLinear()
        .range([height, 0])

    let entries = initialLetters(data)
    let maxCount = d3.max(entries, d => d.value)
    let letters = entries.map(d => d.key).sort()

    x.domain(letters) //add domain to scales: values that will vary
    y.domain([0, maxCount])
        .nice() //rounds up the value for the axis

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
            .transition()
            .delay(animationSpeed / 10)
            .duration(animationSpeed)
            .attr('y', d => y(d.value))
            .attr('height', d => height - y(d.value))

        bar.append('text')
            .attr('class', 'textbar')
            .attr('style', 'color: #fff')
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

// FUNCTIONS
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