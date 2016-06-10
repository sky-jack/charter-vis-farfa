var d3 = require('d3');
  var $ = require('jquery');

  (function() {

    var width = 960,
        height = 500;

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.json("../data/json/output.json", function(error, graph) {
      if (error) throw error;
      var edges = [];
       graph.charters.forEach(function(e) {
            //iterate through each granter
            if (e.benefactor_id && e.granter_id) {
              e.benefactor_id.forEach(function(b) {
                e.granter_id.forEach(function(g) {
                    var sourceNode = graph.agents.filter(function(n) {
                        return n.person_id === g;
                    })[0];
                    var targetNode =  graph.agents.filter(function(n) {
                            return n.person_id === b;
                        })[0];
                    console.log('sn:', sourceNode);
                    if (sourceNode && targetNode) {
                      edges.push({
                          source: sourceNode,
                          target: targetNode,
                          value: "1"
                      });
                    }
                });
              });
            }
      });
      console.log('edges:', edges);

      force
          .nodes(graph.agents)
          .links(edges)
          .start();

      var link = svg.selectAll(".link")
          .data(edges)
        .enter().append("line")
          .attr("class", "link")
          .style("stroke-width", 2);

      var node = svg.selectAll(".node")
          .data(graph.agents)
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .style("fill", function(d) { return color(d.group); })
          .call(force.drag)
          .on("mouseover", function(d) {
                div.transition()
               .duration(200)
               .style("opacity", .9);
               div.html(d.name)
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
             div.transition()
             .duration(500)
             .style("opacity", 0);
          });


      node.append("title")
          .text(function(d) { return d.name; });
      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      });
    });
  }).call(this);
