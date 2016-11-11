var PI = Math.PI;
var pow = Math.pow;
var tan = Math.tan;
var log = Math.log;
var atan = Math.atan;
var exp = Math.exp;
var d3 = require('d3');
var $ = require('jquery');
var ViewportMercator = require('viewport-mercator-project');

mapboxgl.accessToken = 'pk.eyJ1Ijoic2t5amFjayIsImEiOiJjaXRjeXp3bW8wMDY3MnNtaXE1NzI0cDdxIn0.-nlFYGOQQi6fbdY1ii1CYQ';
	var map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/skyjack/citpupza6000d2io0bh6f6to1'
	});
	map.scrollZoom.disable();

	var container = map.getCanvasContainer();
	var svg = d3.select(container).append("svg");
	var dots;

	function mapboxProjection(lonlat) {
		var p = map.project(new mapboxgl.LngLat(lonlat[0], lonlat[1]))
		return [p.x, p.y];
	}

	// we can use viewport-mercator-project to get projection and unprojection functions
	function getVP() {
		var bbox = document.body.getBoundingClientRect();
		var center = map.getCenter();
		var zoom = map.getZoom();
		var vp = ViewportMercator({
			longitude: center.lng,
			latitude: center.lat,
			zoom: zoom,
			width: bbox.width,
			height: bbox.height,
		});
		return vp;
	}

	// // we calculate the scale given mapbox state (derived from viewport-mercator-project's code)
	// // to define a d3 projection
	function getD3() {
		var bbox = document.body.getBoundingClientRect();
		var center = map.getCenter();
		var zoom = map.getZoom();
		// 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
		var scale = (256) * 0.5 / PI * pow(2, zoom);

		var d3projection = d3.geo.mercator()
			.center([center.lng, center.lat])
			.translate([bbox.width/2, bbox.height/2])
			.scale(scale);

		return d3projection;
	}
	//
	// // calculate the original viewport-mercator-project projection
	// var vp = getVP();
	//
	// // calculate the original d3 projection
	var d3Projection = getD3();

	var path = d3.geo.path();



	d3.json("../data/json/output.json", function(error, data) {
		if (error) throw error;
		console.log(data);

		var	dots = svg.selectAll("circle.dot").data(data.locations);

				dots
				.enter()
				.append("circle")
				.classed("d3", true)
				.append("title")
				.text(function(d) { return d.name; });

		// we want to render the same point
		// var point = [42.412732, 12.098551];
		//
		// var d3Circle = svg.append("circle").classed("d3", true);
		function render () {

			d3projection = getD3();
			path.projection(d3Projection);
			console.log('called');

			dots.attr({
	      cx: function(d) {
					console.log(d);
					if (d.coordinates) {
						console.log(d.coordinates.split(',')[0], d3Projection(d.coordinates.split(',')[0])[0]);
						var x = d3Projection(d.coordinates.split(',')[0])[0];
						return x
					}
	      },
	      cy: function(d) {
					if (d.coordinates) {
						var y = d3Projection(d.coordinates.split(',')[1])[1];
		        return y
					}
	      }
      });
		};


		map.on('viewreset', function(){
		render();
		});

		map.on('move', function (){
		render();
		})

		render();

	});
