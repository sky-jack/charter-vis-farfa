
var d3 = require('d3');
var $ = require('jquery');

mapboxgl.accessToken = 'pk.eyJ1Ijoic2t5amFjayIsImEiOiJjaXRjeXp3bW8wMDY3MnNtaXE1NzI0cDdxIn0.-nlFYGOQQi6fbdY1ii1CYQ';

	//Setup mapbox-gl map
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'mapbox://styles/skyjack/citpupza6000d2io0bh6f6to1',
		center: [12.316972, 42.270889],
		zoom: 9,

	})
	map.scrollZoom.disable()
	map.addControl(new mapboxgl.NavigationControl());

	// Setup our svg layer that we can manipulate with d3
	var container = map.getCanvasContainer()
	var svg = d3.select(container).append("svg")

	// we calculate the scale given mapbox state (derived from viewport-mercator-project's code)
	// to define a d3 projection
	function getD3() {
		var bbox = document.body.getBoundingClientRect();
		var center = map.getCenter();
		var zoom = map.getZoom();
		console.log(center, zoom);
		// 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
		var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);

		var d3projection = d3.geo.mercator()
			.center([center.lng, center.lat])
			.translate([bbox.width/2, bbox.height/2])
			.scale(scale);

		return d3projection;
	}
	// calculate the original d3 projection
	var d3Projection = getD3();

	var path = d3.geo.path()

	var url = "../testOutput2.json";
	d3.json(url, function(err, data) {

		var points = data;
		///var points = topojson.feature(data, data.objects.london_stations)
		console.log(points.features);
		//console.log(data[0], getLL(data[0]), project(data[0]))
		var dots = svg.selectAll("circle.dot")
			.data(points.locations)

		dots.enter().append("circle").classed("dot", true)
		.attr("r", 1)
		.style({
			fill: "#0082a3",
			"fill-opacity": 0.6,
			stroke: "#004d60",
			"stroke-width": 1
		})
		.transition().duration(1000)
		.attr("r", 6);




		function render() {
			d3Projection = getD3();
			path.projection(d3Projection)

			dots
			.attr({
				cx: function(d) {
					if (d.coordinates.length > 0) {
						var x = d3Projection(d.coordinates)[0];
						return x
					}
				},
				cy: function(d) {
				  if (d.coordinates.length > 0) {
						var y = d3Projection(d.coordinates)[1];
						return y
					}
				},
			});
			var labels = 	dots.append("svg:text")
			.attr({
					"class": "node-label",
					'dy': 24,
					"text-anchor": "middle"
			})
			.text(function(d) { return d.location_name; });


					  console.log(labels);
		}

		// re-render our visualization whenever the view changes
		map.on("viewreset", function() {
			render()
		})
		map.on("move", function() {
			render()
		})

		// render our initial visualization
		render()
	})
