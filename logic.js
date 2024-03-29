// Creating the map object
var myMap = L.map("map", {
  center: [27.96044, -82.30695],
  zoom: 7
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
var geoData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/ACS-ED_2014-2018_Economic_Characteristics_FL.geojson";

var geojson;

// To do:

// Get the data with d3.
d3.json(geoData).then(function(data) {
  // Create a new choropleth layer.
  let chorolayer = L.choropleth(data, {
    // Define which property in the features to use.
    valueProperty: "DP03_16E",

    // Set the color scale.
    colorScale: ["#ffffb2", "#b10026"],
    // The number of breaks in the step range
    steps: 10,
    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
    },
     // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<strong>" + feature.properties.NAME + "</strong><br /><br />Estimated employed pop w/children age 6-17: " + feature.properties.DP03_16E + "<br /><br />Estimated Total Income and Benefits for Families: $" + feature.properties.DP03_75E);
    }

  }).addTo(myMap);
  
  // Set up the legend.

  var legend = L.control({ position: "bottomright" });
    // Add minimum and maximum.
    legend.onAdd = function() {
      // Adding the legend to the map
      let div = L.DomUtil.create("div", "info legend");
      let limits = chorolayer.options.limits;
      let colors = chorolayer.options.colors;
      let labels = [];
      let legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
        "<div class=\"labels\">" +
          "<div class=\"min\">" + limits[0] + "</div>" +
          "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";
      // Adding the title to the legend.
      div.innerHTML = legendInfo;
      // Adding the limits to the legend.
  
      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  legend.addTo(myMap);
});

