// Bar graph for runtime by genre
let svg1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let countRef = svg1.append("g");


d3.csv("data/netflix_genre_count.csv").then(function(data) {
    data = data.slice(0, 10)

    let x = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) {return parseInt(d["Count"])})])
            .range([0, graph_1_width - margin.left - margin.right]);

    let y = d3.scaleBand()
            .domain(data.map(function(d) { return d["Genre"] }))
            .range([0, graph_1_height - margin.top - margin.bottom])
            .padding(0.1);

    svg1.append("g").call(d3.axisLeft(y).tickSize(0).tickPadding(10));

    let bars = svg1.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
         .domain(data.map(function(d) { return d["Genre"] }))
         .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), data.length))

    bars.enter()
            .append("rect")
            .merge(bars)
            .attr("fill", function(d) { return color(d["Genre"]) })
            .attr("x", x(0))
            .attr("y", function(d) { return y(d["Genre"])})
            .attr("width", function(d) { return x(d["Count"])})
            .attr("height",  y.bandwidth());

    let counts = countRef.selectAll("text").data(data);

    counts.enter()
            .append("text")
            .merge(counts)
            .attr("x", function(d) {return x(d["Count"]) + 5})
            .attr("y", function(d) {return y(d["Genre"]) + 10})
            .style("text-anchor", "start")
            .style("font-size", 10)
            .text(function(d) {return d["Count"]});

    svg1.append("text")
            .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
                ${(graph_1_height - margin.top - margin.bottom) + 15})`)
            .style("text-anchor", "middle")
            .style("font-size", 13)
            .text("Count");

    svg1.append("text")
            .attr("transform", `translate(-125, ${(graph_1_height - margin.top - margin.bottom) / 2})`)
            .style("text-anchor", "middle")
            .style("font-size", 13)
            .text("Genre");

    svg1.append("text")
            .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, -20)`)
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .text("Number of Titles per Genre");
    });