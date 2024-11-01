// Initialize map
var map = L.map('map').setView([7.0, -1.09], 7);

// Add OSM tile layer to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Adding several basemaps to Leaflet
var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Region Layer Style
var regionStyle = {
    color: "blue",
    fillColor: "darkslategray",
    opacity: 0.3,
    weight: 1
}

// Greater Accra Layer Style
var accraStyle = {
    color: "red",
    fillColor: "White",
    opacity: 0.5,
    weight: 2
}

// Define marker cluster group
var markers = L.markerClusterGroup(
    {
        iconCreateFunction: function(cluster) {
            // Customize the color of the cluster markers here
            var childCount = cluster.getChildCount();
            var color = 'green'; // Set your desired color (e.g., blue)
    
            // Define a class for each cluster size if needed
            var c = ' marker-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }
    
            return new L.DivIcon({
                html: `<div style="background-color:${color}"><span>${childCount}</span></div>`,
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40) // Adjust size as needed
            });
        }
    }
);

// Define custom icon for farms
var farmIcon = L.icon({
    iconUrl: 'Img/plantation_8769904.png', // Replace with your PNG image path
    iconSize: [26, 26], // Adjust the size as needed
    iconAnchor: [13, 26], // Adjust anchor point depending on icon size
    popupAnchor: [0, -26] // Adjust popup anchor point
});

// Add GeoJSON layers to map
var regionlayer = L.geoJson(region, {
    style: regionStyle,
    onEachFeature: function(feature, layer) {
        layer.bindPopup(feature.properties.region);
    }
}).addTo(map);

// Add GeoJSON layers to map with clustering
var farmslayer = L.geoJson(farms, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: farmIcon }); // Use the custom icon here
    },
    onEachFeature: function(feature, layer) {
        var label = `<b>Farm Location:</b> ${feature.properties.Location}<br>`;
        label += `<b>Farm Size:</b> ${feature.properties.Farms}<br>`;
        if (feature.properties.image) {
            label += `<a href="${feature.properties.image}" target="_blank"><img src="${feature.properties.image}" alt="${feature.properties.Location}" width="200px"></a><br>`;
        }
        layer.bindPopup(label);
    }
});

// Add the farms layer to the marker cluster group
markers.addLayer(farmslayer);

// Add the marker cluster group to the map
map.addLayer(markers);

// Basemaps
var baseLayers = {
    "OpenStreetMap": osm,
    "Google Street Map": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain
};

// Layers
var overlays = {
    "Ghana Regions": regionlayer,
    "Farm Locations": markers
};

// Add layer control to map
L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map);

// Add Leaflet browser print control to map
L.control.browserPrint({ position: 'topleft' }).addTo(map);

// Add mouse move coordinates
map.on("mousemove", function(e) {
    $("#coordinate").html(`Lat:${e.latlng.lat.toFixed(4)}, Lng:${e.latlng.lng.toFixed(4)}`);
});

// Add scale to map
L.control.scale().addTo(map);
