//how to make this relative to the CSS styles?
let unit = 10
let animationSpeed = 1000;

let margin = {
    top: unit*3,
    right: unit*5,
    bottom: unit*15,
    left: unit*5,
}

let width = unit * 90 - margin.left - margin.right;
let height = unit * 50 - margin.top - margin.bottom;

let svg = d3.select('#chart1')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleBand()
    .range([0, width])
    .padding(0.15)

let y = d3.scaleLinear()
    .range([height, 0])

d3.json('/Scrapper/results.json')
    .then((data) => {

        let entries = initialLetters(data)

        const maxCount = d3.max(entries, d => d.value);
        let letters = entries.map(d => d.key);
        letters = letters.sort();

        x.domain(letters)
        y.domain([0, maxCount])
            .nice() // rounds up the value for the axis

        svg.append('g') // y axis
            .call(d3.axisLeft(y))
            .attr('class','text-axis')


        svg.append('g') // x axis
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('class','text-axis')
            .attr('text-anchor', 'middle')

        createBars(entries)

    }).catch((error) => {
        throw error;
    })


// FUNCTIONS
function createBars(data) {

    svg.selectAll('.bar-group')
        .data(data, d => d.key)
        .join(
            enter => {
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
                    .duration(animationSpeed)
                    .attr('y', d => y(d.value))
                    .attr('height', d => height - y(d.value))

                bar.append('text')
                    .text(d => d.value)
                    .attr('x', d => x(d.key) + (x.bandwidth() / 2))
                    .attr('y', d => y(d.value) - 5)
                    .attr('text-anchor', 'middle')
                    .attr('class','text-bar')
                    .style('opacity', 0)
                    .transition()
                    .delay(animationSpeed/3)
                    .duration(animationSpeed/5)
                    .style('opacity', 1)
            }
        )
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
    return entries;
}