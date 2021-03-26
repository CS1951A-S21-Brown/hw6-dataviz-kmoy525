let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("data/netflix_cast.csv").then(function(data) {
    const nodes_set = new Set()
    for (i = 0; i < data.length; i++) {
        nodes_set.add(data[i].source)
        nodes_set.add(data[i].target)
    }
    nodes_array = Array.from(nodes_set)
    let nodes = []
    for (i = 0; i < nodes_array.length; i++) {
        nodes.push({"id": nodes_array[i]});
    }

    let tooltip = d3.select("#graph3")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "0.5px")
            .style("padding", "5px");

    let mouseover = function(d) {
        tooltip
            .html(`${d.id}`)
            .style("top", (d3.event.pageY - 100) +"px")
            .style("left",(d3.event.pageX - 850)+"px")
            .transition()
            .duration(200)
            .style("opacity", 0.9)
       }

    let mouseleave = function(d) {
       tooltip
           .transition()
           .duration(200)
           .style("opacity", 0)
        }

    let simulation = d3.forceSimulation()
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-225))
        .force("center", d3.forceCenter((graph_3_width - margin.left - margin.right)/ 2,
            (graph_3_height - margin.top - margin.bottom) / 2));

    let link = svg3.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    let node = svg3.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")

    node.append("circle")
        .attr("r", 13)
        .style("fill", "#81c2c3")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)

    simulation.nodes(nodes).on("tick", ticked);
    simulation.force("link").links(data);

    svg3.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, -20)`)
        .style("text-anchor", "middle")
        .style("font-size", 15)
        .text(`Most Common Actors and their Collaborations`);

    function ticked() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    }
});

