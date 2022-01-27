//Intro overlay

function openIntro() {
  document.getElementById("myIntro").style.height = "100%";
  document.querySelector('body').style.overflow = 'hidden';
}

function closeIntro() {
  document.getElementById("myIntro").style.height = "0%";
  document.querySelector('body').style.overflow = 'auto';
}

// load final data initially so page doesn't lag when
// selecting neighborhoods
var HC_FILINGS = [];
$.getJSON("./data/oca_geocoded.geojson", function(data) { //add in housing court data once polished
  HC_FILINGS = data
})


mapboxgl.accessToken = 'pk.eyJ1Ijoid3NoZW55YyIsImEiOiJja2w3YjNvd3YxZnc1Mm5wZWp1MnVqZGh2In0.-wG4LWFGN76Nf-AEigxu2A';

//loading map
var map = new mapboxgl.Map({
  container: 'mapContainer', // container ID
  style: 'mapbox://styles/mapbox/light-v9', // style URL
  center: [-73.92013728138733, 40.71401732482218], // starting position [lng, lat]
  zoom: 10.5 // starting zoom
});

// disable map zoom when using scroll
map.scrollZoom.disable();

// add navigation control in top right
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');


//search bar

// var geocoder = new MapboxGeocoder({
//   accessToken: mapboxgl.accessToken,
//   mapboxgl: mapboxgl
// });
//
// map.addControl(geocoder);

map.on('load', function() {

  // adding base layer of all NYC zipcodes
  map.addSource('allzip', {
    type: 'geojson',
    data: './data/nyc_zip_code_tabulation_areas_polygons.geojson'
  });


  // add outlines for all zips
  map.addLayer({
    'id': 'zips-outlines',
    'type': 'line',
    'source': 'allzip',
    'paint': {
      'line-color': 'gray',
      'line-width': 3
    }
  });

  // adding in layer of just oca
  map.addSource('ocazips', {
    type: 'geojson',
    data: './data/oca_geocoded.geojson'
  });

  //adding in total filings per zip layer
  map.addLayer({
    'id': 'total-filings',
    'source': 'ocazips',
    'type': 'fill',
    'layout': {
      'visibility' : 'none'
    },
    // only include features for which the "isState"
    // property is "true"
    'filter': ['>=', 'oca_sum_zips_total_filings', 0],
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'oca_sum_zips_total_filings'],
        0,
        'white',
        300,
        '#EED322',
        1500,
        '#E6B71E',
        3500,
        '#DA9C20',
        8600,
        '#CA8323',
        35000,
        '#B86B25'
      ],
      'fill-opacity': 0.75
    }
  });

  //adding percent represented
  map.addLayer({
    'id': 'pct-rep',
    'source': 'ocazips',
    'type': 'fill',
    'layout': {
      'visibility' : 'none'
    },
    // only include features for which the "isState"
    // property is "true"
    'filter': ['>=', 'oca_sum_zips_pct_resp_rep', 0],
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'oca_sum_zips_total_filings'],
        0,
        'white',
        20,
        '#EED322',
        40,
        '#E6B71E',
        60,
        '#DA9C20',
        80,
        '#CA8323',
        100,
        '#B86B25'
      ],
      'fill-opacity': 0.75
    }
  });

  //adding percent appeared
  map.addLayer({
    'id': 'pct-app',
    'source': 'ocazips',
    'type': 'fill',
    'layout': {
      'visibility' : 'none'
    },
    // only include features for which the "isState"
    // property is "true"
    'filter': ['>=', 'oca_sum_zips_pct_resp_app', 0],
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'oca_sum_zips_total_filings'],
        0,
        'white',
        20,
        '#EED322',
        40,
        '#E6B71E',
        60,
        '#DA9C20',
        80,
        '#CA8323',
        100,
        '#B86B25'
      ],
      'fill-opacity': 0.75
    }
  });

  //adding total executions
  map.addLayer({
    'id': 'total-exec',
    'source': 'ocazips',
    'type': 'fill',
    'layout': {
      'visibility' : 'none'
    },
    // only include features for which the "isState"
    // property is "true"
    'filter': ['>=', 'oca_sum_zips_total_execution', 0],
    'paint': {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'oca_sum_zips_total_filings'],
        0,
        'white',
        30,
        '#EED322',
        100,
        '#E6B71E',
        200,
        '#DA9C20',
        400,
        '#CA8323',
        2000,
        '#B86B25'
      ],
      'fill-opacity': 0.75
    }
  });


  // add outlines for selected zips
  // map.addSource('highlight-feature', {
  //   'type': 'geojson',
  //   'data': {
  //     'type': 'FeatureCollection',
  //     'features': []
  //   }
  // });
  //
  // map.addLayer({
  //   'id': 'highlight-fill',
  //   'type': 'fill',
  //   'source': 'highlight-feature',
  //   'paint': {
  //     'fill-color': '#eacf47 '
  //   }
  // });
  //
  // map.addLayer({
  //   'id': 'highlight-outline',
  //   'type': 'line',
  //   'source': 'highlight-feature',
  //   'paint': {
  //     'line-width': 3,
  //     'line-opacity': 1,
  //     'line-color': '#e83553'
  //   },
  //   'layout': {
  //     'line-join': 'bevel'
  //   }
  // });

});
//
// After the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {
  // If these 4 layers were not added to the map, abort
  // if (!map.getLayer('total-filings') || !map.getLayer('pct-rep') || !map.getLayer('pct-app') || !map.getLayer('total-exex')) {
  //   return;
  // }

  // Enumerate ids of the layers.
  const toggleableLayerIds = ['total-filings', 'pct-rep', 'pct-app', 'total-exec'];

  // Set up the corresponding toggle button for each layer.
  for (const id of toggleableLayerIds) {
    // Skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }

    // Create a link.
    const link = document.createElement('a');
    link.id = id;
    link.href = '#';
    link.textContent = id;
    link.className = 'active';

    // Show or hide layer when the toggle is clicked.
    link.onclick = function(e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(
        clickedLayer,
        'visibility'
      );

      // Toggle layer visibility by changing the layout object's visibility property.
      if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        this.className = 'active';
        map.setLayoutProperty(
          clickedLayer,
          'visibility',
          'visible'
        );
      }
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);
  }
});

//Mouse cursor will change to a pointer when over something clickable
// map.on('mouseenter', 'mci-lots', function() {
//   map.getCanvas().style.cursor = 'pointer';
// });
// map.on('mouseleave', 'mci-lots', function() {
//   map.getCanvas().style.cursor = '';
// });
