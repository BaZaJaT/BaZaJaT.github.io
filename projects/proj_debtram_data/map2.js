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
    center: [47.5555, 21.6243],
    minZoom: 12,
    maxZoom: 18,
    zoom: 13,
    layers: [satellite]
});

const baseMaps = {
    "OpenStreetMap": osm,
    "Műhold": satellite
};

const overlayMaps = {
};

const layerControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

const layers = [
    {
        file: '1.geojson',
        name: "1-es vonal",
        style: {
            color: 'yellow',
            weight: 4
        },
    },
    {
        file: '3.geojson',
        name: "3-as vonal",
        style: {
            color: 'red',
            weight: 4
        },
    },
    {
        file: '4.geojson',
        name: "4-es vonal",
        style: {
            color: 'blue',
            weight: 4
        },
    },
    {
        file: '5.geojson',
        name: "5-ös vonal",
        style: {
            color: 'magenta',
            weight: 4
        },
    },
    {
        file: '6.geojson',
        name: "6-os vonal",
        style: {
            color: 'orange',
            weight: 4
        },
    },
    {
        file: '7.geojson',
        name: "7-es vonal",
        style: {
            color: 'green',
            weight: 4
        },
    },
    {
        file: '0.geojson',
        name: "Üzemi vágány",
        style: {
            color: 'black',
            weight: 3
        },
    },
];

const geoLayers = {};

layers.forEach(layer => {
    const lines = L.geoJSON(null, {
        style: layer.style,
    });
    geoLayers[layer.file] = lines;
    lines.addTo(map);
    layerControl.addOverlay(lines, layer.name);
});

layers.forEach(layer => {
    fetch(`proj_debtram_data/lines/${layer.file}`)
        .then(res => res.json())
        .then(data => {
            geoLayers[layer.file].addData(data);
        });
});