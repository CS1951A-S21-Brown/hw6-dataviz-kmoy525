function setYear() {
    let year = document.getElementById("attrInput").value;
    d3.select("#graph2").select("svg").remove();
    setData(year)
}

function setData(year) {
    var svg2 = d3.select("#graph2")
        .append("svg")
        .attr("width", graph_2_width)
        .attr("height", graph_2_height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("data/netflix.csv").then(function(data) {
           data = data.filter(row => row.type == "Movie").filter(row => row.release_year == year);
           runtime_data = data.map(function(d) { return parseInt(d.duration.replace(/\D/g, "")) })
           runtime_data = runtime_data.sort(function(a, b){return a-b})
           if (runtime_data.length > 1) {
                quart = jStat.quartiles(runtime_data)
                q1 = quart[0]
                median = quart[1]
                q3 = quart[2]
           } else {
                q1 = runtime_data[0]
                median = runtime_data[0]
                q3 = runtime_data[0]
           }
           min = q1 - 1.5 * (q3-q1)
           max = q1 + 1.5 * (q3-q1)
           average = runtime_data.reduce((a, b) => a + b, 0)/runtime_data.length
           let x = d3.scaleLinear()
                .domain([0, 250])
                .range([0, graph_2_width - margin.left - margin.right]);


           svg2.append("g")
                .attr("transform", `translate(0, ${graph_2_height - margin.top - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))


           if (data.length > 0) {
           svg2.append("line")
                .attr("x1", x(min))
                .attr("x2", x(max))
                .attr("y1", (graph_2_height - margin.top - margin.bottom)/2)
                .attr("y2", (graph_2_height - margin.top - margin.bottom)/2)
                .attr("stroke", "black")

           rect_width = 100

           svg2.append("rect")
                .attr("x", x(q1))
                .attr("y", (graph_2_height - margin.top - margin.bottom)/2 - rect_width/2)
                .attr("height", rect_width)
                .attr("width", (x(q3)-x(q1)) )
                .attr("stroke", "black")
                .style("fill", "#66a0e2")

           svg2.append("line")
               .attr("x1", x(min))
               .attr("x2", x(min))
               .attr("y1", (graph_2_height - margin.top - margin.bottom)/2 + rect_width/2)
               .attr("y2", (graph_2_height - margin.top - margin.bottom)/2 - rect_width/2)
               .attr("stroke", "black")

           svg2.append("line")
                .attr("x1", x(median))
                .attr("x2", x(median))
                .attr("y1", (graph_2_height - margin.top - margin.bottom)/2 + rect_width/2)
                .attr("y2",(graph_2_height - margin.top - margin.bottom)/2 - rect_width/2)
                .attr("stroke", "black")

           svg2.append("line")
                .attr("x1", x(max))
                .attr("x2", x(max))
                .attr("y1", (graph_2_height - margin.top - margin.bottom)/2 + rect_width/2)
                .attr("y2",(graph_2_height - margin.top - margin.bottom)/2 - rect_width/2)
                .attr("stroke", "black")

           svg2.append("line")
                .attr("x1", x(average))
                .attr("x2", x(average))
                .attr("y1", (graph_2_height - margin.top - margin.bottom)/2 + 75)
                .attr("y2",(graph_2_height - margin.top - margin.bottom)/2 - 75)
                .attr("stroke", "red")

           svg2.append("text")
               .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                    ${(graph_2_height - margin.top - margin.bottom) + 40})`)
               .style("text-anchor", "middle")
               .style("font-size", 13)
               .text("Runtime (minutes)");

           svg2.append("text")
                .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, -20)`)
                .style("text-anchor", "middle")
                .style("font-size", 15)
                .text(`Runtime of Movies Released in ${year}`);

           let tooltip = d3.select("#graph2")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "0.5px")
                .style("padding", "5px");

           let mouseover = function(d) {
               tooltip
                   .html(`${d.title}<br/> Runtime: ${d.duration}`)
                   .style("top", (d3.event.pageY - 100)+"px")
                   .style("left",(d3.event.pageX + 100)+"px")
                   .transition()
                   .duration(200)
                   .style("opacity", 1)
               }

            let mouseleave = function(d) {
               tooltip
                   .transition()
                   .duration(200)
                   .style("opacity", 0)
               }

           let points = svg2.selectAll("points")
               .data(data.filter(row => parseInt(row.duration.replace(/\D/g, "")) >= min)
               .filter(row => parseInt(row.duration.replace(/\D/g, "")) <= max));

           points.enter()
               .append("circle")
               .attr("cx", function(d) {return x(parseInt(d.duration.replace(/\D/g, "")))})
               .attr("cy", function(d) {return (graph_2_height - margin.top - margin.bottom)/2 + rect_width/2
               - Math.random()*rect_width})
               .attr("r", 2.5)
               .attr('fill-opacity', 0.25)
               .on("mouseover", mouseover)
               .on("mouseleave", mouseleave)

       }});
}

setData(2019)