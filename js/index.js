(function() {

  var d3 = require('d3');
  var $ = require('jquery');

  $(function() {
    var myNetwork;
    myNetwork = Network();

    return d3.json("data/call_me_al.json", function(json) {
    return myNetwork("#vis", json);
  });


}).call(this);
