import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';
import locationIconAtlas from './data/location-icon-atlas.png'
import locationIconMapping from './data/location-icon-mapping.json'

import IconClusterLayer from './icon-cluster-layer';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2hwbzEyMyIsImEiOiJjam1jYmtjbWEwMDQyM3RqeGh3c3llaDhtIn0.pwvAqkOvtyY1scYXngowvg' // eslint-disable-line

// Source data CSV
const DATA_URL = 'https://data.cityofnewyork.us/resource/varh-9tsp.json'

const MAP_VIEW = new MapView({repeat: true});
const INITIAL_VIEW_STATE = {
  longitude: -73.949,
  latitude: 40.65,
  zoom: 9.5,
  minZoom: 5,
  maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

/* eslint-disable react/no-deprecated */
export default class Pins extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      hoveredObject: null,
      expandedObjects: null
    };
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderhoveredItems = this._renderhoveredItems.bind(this);
  }

  _onHover(info) {
    if (this.state.expandedObjects) {
      return;
    }

    const {x, y, object} = info;
    this.setState({x, y, hoveredObject: object});
  }

  _onClick(info) {
    const {showCluster = true} = this.props;
    const {x, y, objects, object} = info;

    if (object && showCluster) {
      this.setState({x, y, expandedObjects: objects || [object]});
    } else {
      this._closePopup();
    }
  }

  _closePopup() {
    if (this.state.expandedObjects) {
      this.setState({expandedObjects: null, hoveredObject: null});
    }
  }

  _renderhoveredItems() {
    const {x, y, hoveredObject, expandedObjects} = this.state;

    if (expandedObjects) {
      return (
        <div className="tooltip interactive" style={{color: 'white', left: x+'px', top: y+'px'}}>
          {expandedObjects.map(({objectid, name, location, city, location_t}) => {
            return (
              <div key={objectid}>
                <h5>{name}</h5>
                <div>Location: {location || 'unknown'}</div>
                <div>City: {city}</div>
                <div>Type: {location_t}</div>
              </div>
            );
          })}
        </div>
      );
    }

    if (!hoveredObject) {
      return null;
    }

    return hoveredObject.cluster ? (
      <div className="tooltip" style={{color:'white', display: 'block', left: x+'px', top: y+'px'}}>
        <h5>{hoveredObject.point_count} records</h5>
      </div>
    ) : (
      <div className="tooltip" style={{color: 'white', display: 'block', left: x+'px', top: y+'px'}}>
        <h5>
          {hoveredObject.name} {hoveredObject.year ? `(${hoveredObject.year})` : ''}
        </h5>
      </div>
    );
  }

  _renderLayers() {
    const {
      data = DATA_URL,
      iconMapping = locationIconMapping,
      iconAtlas = locationIconAtlas,
      showCluster = false
    } = this.props;

    const layerProps = {
      data,
      pickable: true,
      getPosition: d => d.the_geom.coordinates,
      iconAtlas,
      iconMapping,
      onHover: this._onHover
    };

    const layer = showCluster
      ? new IconClusterLayer({...layerProps, id: 'icon-cluster', sizeScale: 60})
      : new IconLayer({
          ...layerProps,
          id: 'icon',
          getIcon: d => 'marker',
          sizeUnits: 'meters',
          sizeScale: 2000,
          sizeMinPixels: 6
        });

    return [layer];
  }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

    return (
      <DeckGL
        layers={this._renderLayers()}
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        onViewStateChange={this._closePopup}
        onClick={this._onClick}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />

        {this._renderhoveredItems}
      </DeckGL>
    );
  }
}

