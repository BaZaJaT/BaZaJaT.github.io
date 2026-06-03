//basemaposm
const osm = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
);
//basemapsat
const satellite = L.tileLayer(
    'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Satellite'
    }
);

const map = L.map('map', {
    center: [48.3285, 21.4463],
    minZoom: 8,
    maxZoom: 14,
    zoom: 9,
    layers: [osm]
});

// dem
const dem = L.tileLayer('projweb_data/dem/{z}/{x}/{y}.png', {

});
dem.addTo(map);

// aspect
const asp = L.tileLayer('projweb_data/aspect/{z}/{x}/{y}.png', {

});

//slope
const slope = L.tileLayer('projweb_data/slope/{z}/{x}/{y}.png', {

})

//vis1
const vis1 = L.tileLayer('projweb_data/vis1/{z}/{x}/{y}.png', {

})

//vis2
const vis2 = L.tileLayer('projweb_data/vis2/{z}/{x}/{y}.png', {

})

// hillshade
const hs = L.tileLayer('projweb_data/hillshade/{z}/{x}/{y}.png', {
});
hs.addTo(map);

const baseMaps = {
    "OpenStreetMap": osm,
    "Műhold": satellite
};

const overlayMaps = {
    "Domborzatmodell": dem,
    "Kitettség": asp,
    "Lejtés": slope,
    "Láthatóság 1": vis1,
    "Láthatóság 2": vis2,
    "Árnyékolás": hs,
};

const layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

fetch('projweb_data/contour.geojson')
    .then(res => res.json())
    .then(data => {

        const cont = L.geoJSON(data, {
            style: {
                color: 'black',
                weight: 2
            },
            onEachFeature: function (feature, layer) {

                const elev = feature.properties.CONTOUR;

                layer.setText(elev + " m", {
                    repeat: false,
                    offset: 10,
                    attributes: {
                        fill: "black",
                        "font-size": "10px",
                        "font-weight": "bold",
                    }
                });
            }
        });

        layerControl.addOverlay(cont, "Szintvonalak");

    });
//points
const pontokData = {
    "type": "FeatureCollection",
    "name": "points",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    "features": [
        {
            "type": "Feature",
            "properties": { "Id": 1 },
            "geometry": {
                "type": "Point",
                "coordinates": [21.445807557016224, 48.569562052644791, 0.0]
            }
        },
        {
            "type": "Feature",
            "properties": { "Id": 2 },
            "geometry": {
                "type": "Point",
                "coordinates": [21.382370707364966, 48.120409498995762, 0.0]
            }
        }
    ]
};

const pontokLayer = L.geoJSON(pontokData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5,
            fillColor: "yellow",
            color: "black",
            weight: 1,
            fillOpacity: 0.8
        });
    },

    onEachFeature: function (feature, layer) {

        layer.bindTooltip(" " + feature.properties.Id, {
            permanent: true,
            direction: "top",
            offset: [0, -10]
        });
    }
});


function updatePoints() {
    if (map.hasLayer(vis1) || map.hasLayer(vis2)) {
        map.addLayer(pontokLayer);
    } else {
        map.removeLayer(pontokLayer);
    }
}

map.on('overlayadd overlayremove', updatePoints);

//Legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend-box');

    div.innerHTML = `
    <img id="legend-img" style="width:auto; height:auto; object-fit: contain;" src="" />
  `;
    div.style.background = "white";
    div.style.padding = "6px";
    div.style.borderRadius = "6px";
    div.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";

    return div;
};

legend.addTo(map);

const legendMap = {
    "Domborzatmodell": "projweb_data/legend/demlegend.png",
    "Kitettség": "projweb_data/legend/aspectlegend.png",
    "Lejtés": "projweb_data/legend/slopelegend.png",
    "Láthatóság 1": "projweb_data/legend/vis1legend.png",
    "Láthatóság 2": "projweb_data/legend/vis2legend.png"
};

function updateLegend() {

    let topLayer = null;
    let layerName = null;

    for (let name in overlayMaps) {
        // hillshade kihagyása
        if (name === "Árnyékolás") continue;
        const layer = overlayMaps[name];

        if (map.hasLayer(layer)) {
            topLayer = layer;
            layerName = name;
        }
    }

    const img = document.getElementById('legend-img');

    if (layerName && legendMap[layerName]) {
        img.src = legendMap[layerName];
        img.style.display = "block";
    } else {
        img.style.display = "none";
    }
}
map.on('overlayadd', updateLegend);
map.on('overlayremove', updateLegend);
updateLegend();
