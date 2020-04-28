import React from 'react';
import DeckGL from '@deck.gl/react';
import {LineLayer} from '@deck.gl/layers';
import {StaticMap, Layer} from 'react-map-gl'
import {MapView, FirstPersonView} from '@deck.gl/core'
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiY2hwbzEyMyIsImEiOiJjam1jYmtjbWEwMDQyM3RqeGh3c3llaDhtIn0.pwvAqkOvtyY1scYXngowvg';

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51]
};

const INITIAL_VIEW_STATE = {
  longitude: -73.900486007,
  latitude: 40.856351227,
  zoom: 6.6,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

const elevationScale = {min: 1, max: 50};


// Data to be used by the LineLayer
const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

function App(props) {
	const {data, radius = 1000, upperPercentile = 100, coverage = 1} = props;

	const layers = [
		new LineLayer({id: 'line-layer', data})
	]
	
	const hexagonLayer = [
		new HexagonLayer({
			id: 'heatmap',
			colorRange,
			coverage: 0.7,
			data,
			elevationRange: [0, 3000],
			elevationScale: data && data.length ? 50 : 0,
			extruded: true,
			getPosition: d => d,
			radius,
			onHover: props.onHover,
      pickable: Boolean(props.onHover),
			upperPercentile,
			material,

			transitions: {
				elevationScale: 3000
			}
		})
	];
 
	const mapStyle = 'mapbox://styles/mapbox/dark-v10'

  return (
		<DeckGL 
      initialViewState={INITIAL_VIEW_STATE} 
      layers={hexagonLayer} 
			effects={[lightingEffect]}
      controller={true}
    >
      <StaticMap 
        reuseMaps
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} 
        preventStyleDiffing={true}
        mapStyle={mapStyle}
      />
    </DeckGL>
  );
}

export default App;
