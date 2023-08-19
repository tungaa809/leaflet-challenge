// Create the Leaflet map
  var map = L.map('map').setView([37.0902, -95.7129], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Add a tile layer for the map background 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Fetch the GeoJSON data
var geoDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'; 

fetch(geoDataUrl)
  .then(response => response.json())
  .then(data => {
    // Function to get color based on earthquake depth
    function getColor(depth) {
      var colorScale = [
        '#00FF00', // Green
        '#ADFF2F', // Yellow-Green
        '#FFFF00', // Yellow
        '#FFA500', // Orange
        '#FF4500', // Red-Orange
        '#FF0000' // Red
      ];

      if (depth <= 10) return colorScale[0];
      if (depth <= 30) return colorScale[1];
      if (depth <= 50) return colorScale[2];
      if (depth <= 70) return colorScale[3];
      if (depth <= 90) return colorScale[4];
      return colorScale[5];
    }

    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Calculate marker size based on magnitude
        var magnitude = feature.properties.mag;
        var markerSize = magnitude * 3; 

        // Calculate marker color based on depth
        var depth = feature.geometry.coordinates[2]; 
        var markerColor = getColor(depth);

        return L.circleMarker(latlng, {
          radius: markerSize,
          fillColor: markerColor,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        // Add a popup with information
        layer.bindPopup(
          `<strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Location:</strong> ${feature.properties.place}<br><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`
        );
      }
    }).addTo(map);

    // Create legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var depths = [-10, 10, 30, 50, 70, 90]; 
      var labels = [],
        from, to;

      for (var i = 0; i < depths.length; i++) {
        from = depths[i];
        to = depths[i + 1];

        var colorBox = `<div style="width: 20px; height: 10px; background:${getColor(from + 1)}; display: inline-block;"></div>`;
        var depthLabel = `${from}${to ? '&ndash;' + to : '+'} km`;

        labels.push(
          `<div>${colorBox} ${depthLabel}</div>`
        );
      }

      div.innerHTML = `<div style="background: white; padding: 10px;">${labels.join('')}</div>`;

      return div;
    };

    // Add legend to the map
    legend.addTo(map);
  });