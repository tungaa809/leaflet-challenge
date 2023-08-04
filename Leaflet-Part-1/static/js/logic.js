// Function to fetch earthquake data from the GeoJSON feed
async function fetchEarthquakeData() {
  const link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  try {
    const response = await fetch(link);
    const data = await response.json();
    return data.features;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Function to create the Leaflet map
function createMap() {
  const map = L.map('map').setView([37.0902, -95.7129], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  return map;
 
}

// Function to create earthquake markers and popups
function createMarkersAndPopups(earthquakeData, map) {
  for (const earthquake of earthquakeData) {
    const { geometry, properties } = earthquake;
    const lat = geometry.coordinates[1];
    const lon = geometry.coordinates[0];
    const mag = properties.mag;
    const depth = geometry.coordinates[2];
    const place = properties.place;
    const time = new Date(properties.time).toLocaleString();

    const markerOptions = {
      radius: mag * 5,
      fillColor: getColor(mag),
      color: getColor(mag),
      weight: 1,
      opacity: 0.8,
      fillOpacity: 0.35
    };

    const marker = L.circleMarker([lat, lon], markerOptions)
      .bindPopup(
        `<h3>Where: ${place}</h3><hr><p>${time}</p><br><h2>Magnitude: ${mag}</h2><br>Depth: ${depth} km`
      )
      .addTo(map);
  }
}

// Function to set color based on magnitude
function getColor(mag) {
  switch (true) {
    case (1 <= mag < 2.5): return "#90EE90";
    case (2.5 <= mag < 4.0): return "#35BC00";
    case (4 <= mag < 5.5): return "#BCBC00";
    case (5.5 <= mag < 8): return "#BC3500";
	case (mag >= 8.0): return "#BC0000";
    default: return "#E2FFAE";
  }
}
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [1.0, 2.5, 4.0, 5.5, 8.0],
        labels = [];

    // loop through density intervals
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

// Fetch the earthquake data and create the map when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  const earthquakeData = await fetchEarthquakeData();
  const map = createMap();
  createMarkersAndPopups(earthquakeData, map);
});

 
