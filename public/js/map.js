

    
    const key = mapKey;
    
    const attribution = new ol.control.Attribution({
    collapsible: false,
    });
    
    const source = new ol.source.TileJSON({
    url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`, // source URL
    tileSize: 512,
    crossOrigin: 'anonymous'
    });
    
    const map = new ol.Map({
    layers: [
    new ol.layer.Tile({
    source: source
    })
    ],
    controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
    target: 'map',
    view: new ol.View({
    constrainResolution: true,
    center: ol.proj.fromLonLat(coordinates), // starting position [lng, lat]
    zoom: 10 // starting zoom
    })
    });


    console.log(coordinates);
   // Convert coordinates from [lng, lat] to map projection
const point = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
});

// Optional: Custom marker icon
point.setStyle(new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    src: 'https://cdn.mapmarker.io/api/v1/pin?text=📍&size=50' // or your own icon URL
  })
}));

// Add marker to a vector source and layer
const vectorSource = new ol.source.Vector({
  features: [point]
});

const markerLayer = new ol.layer.Vector({
  source: vectorSource
});

// Add the marker layer to your map
map.addLayer(markerLayer);

// Optional: pan the map to the marker
map.getView().setCenter(ol.proj.fromLonLat(coordinates));
