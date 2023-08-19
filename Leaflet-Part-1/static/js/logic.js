var map = L.map('map').setView([37.0902, -95.7129], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
  .then(response => response.json())
  .then(data => {
    function getColor(depth) {
      var colors = ['#00FF00', '#ADFF2F', '#FFFF00', '#FFA500', '#FF4500', '#FF0000'];
      return colors.find((color, index) => depth <= [10, 30, 50, 70, 90][index]) || colors[5];
    }

    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        var size = feature.properties.mag * 3;
        var color = getColor(feature.geometry.coordinates[2]);
        return L.circleMarker(latlng, { radius: size, fillColor: color, color: '#000', weight: 1, fillOpacity: 0.8 });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<strong>Magnitude:</strong> ${feature.properties.mag}<br><strong>Location:</strong> ${feature.properties.place}<br><strong>Depth:</strong> ${feature.geometry.coordinates[2]} km`);
      }
    }).addTo(map);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      var div = L.DomUtil.create('div', 'info legend');
      var depths = [-10, 10, 30, 50, 70, 90];
      var labels = depths.map((depth, index) => `<div style="width: 20px; height: 10px; background:${getColor(depth + 1)}; display: inline-block;"></div> ${depth}${depths[index + 1] ? '&ndash;' + depths[index + 1] : '+'} km`);
      div.innerHTML = `<div style="background: white; padding: 10px;">${labels.join('<br>')}</div>`;
      return div;
    };
    legend.addTo(map);
  });