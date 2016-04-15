var d3 = require('d3');
var $ = require('jquery');

(function() {

  var width = 960;
  var height = 500;

var force = d3.layout.force()
    .charge(-200)
    .linkDistance(40)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("../test.json", function(error, graph) {
  if (error) throw error;

  var nodeById = d3.map();

  graph.nodes.forEach(function(node) {
    nodeById.set(node.id, node);
  });

  graph.links.forEach(function(link) {
    link.source = nodeById.get(link.source);
    link.target = nodeById.get(link.target);
  });

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 6)
      .style("fill", function(d) { return d.id; })
      .call(force.drag);

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
