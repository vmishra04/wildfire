import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";
import ReactMapboxGl from "react-mapbox-gl";
import api from "./api.js";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoianJteSIsImEiOiJjazA5MXQwdngwNDZhM2lxOHFheTlieHM3In0.1Jh_NjL_Nu3YYeMUOZvmrA"
});

class Home extends Component {

  constructor(props) {
    super(props);
    this.inputPlaces = React.createRef();
    this.mapRef = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.loadedMap = this.loadedMap.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      suggestions: [],
      place: null,
      center: [-118.832169, 34.030823],
      placeName: null,
      locked: true,
    }
  }

  componentDidMount() {
    
  }

  handleInput() {
    if(this.inputPlaces.value==="") {
      this.setState({
        suggestions: [],
      })
    }
    else {
      api.search(this.inputPlaces.value).then(response => {
        this.setState({
          suggestions: response.data.features
        })
      });
    }
  }

  handleSelection(object) {
    this.setState({
      place: object,
      suggestions: [],
      placeName: object.place_name,
      center: object.center,
      locked: false,
    })
  }

  loadedMap(map) {
    this.setState({
      map: map,
    })
    var layers = map.getStyle().layers;
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }

    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
      }
    }, labelLayerId);
  }

  mapClick(map, event) {
    if(this.state.locked===true) return;
    var features = map.queryRenderedFeatures(event.point);
    api.search(`${this.state.center[0]},${this.state.center[1]}`).then(response => {
        this.setState({
          place: response.data.features[0],
          center: this.state.center,
          placeName: response.data.features[0].place_name,
        })
      });
    this.setState({
      locked: true,
      center: features[0].geometry.coordinates[0][0],
    });
    map.removeLayer('3d-buildings');
    map.addLayer({
      'id': '3d-buildings',
      'source': {
        'type': 'geojson',
        'data': features[0],
      },
      'type': 'fill-extrusion',
      'minzoom': 18,
      'paint': {
      'fill-extrusion-color': '#5acf9c',
      'fill-extrusion-height': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
      }
    })
  }

  reset() {
    this.state.map.removeLayer('3d-buildings');
    this.state.map.removeSource('3d-buildings');
    this.loadedMap(this.state.map);
    this.setState({
      locked: false,
    })
  }

  render() {
    return (
      <div class="evaluate">
        <div class="evaluate-left">
          <Link class="icon" to="/"><FeatherIcon icon="arrow-left"/></Link>
          <h1>Evaluate</h1>
          <input type="text" class="evaluate-address" placeholder="Neighborhood, Postcode, Address?" style={{minWidth: '23rem'}} onChange={this.handleInput} ref={(inputPlaces) => {this.inputPlaces = inputPlaces}}/>
          {this.state.suggestions.map((object, index) => {
            return(
              <p key={index} class="suggestion" onClick={this.handleSelection.bind(null, object)}>{object.place_name}</p>
            );
          })}
          <h1>Recommended Coverage</h1>
          <div class="address-parent" style={{display: this.state.place ? 'flex' : 'none'}}>
            <p class="address">
              {this.state.placeName}
            </p>
            <FeatherIcon icon="x-circle" onClick={this.reset} style={{display: this.state.locked ? 'inherit' : 'none'}}/>
          </div>
          <div class="evaluation is-apercu" style={{height: this.state.place ? '2rem' : '2rem'}}>
            Evaluate here
          </div>
          <div class="actual-coverage">
            <span class="is-big" style={{marginBottom: '-0.25rem'}}>Payout</span>
            <div class="coverage-numbers">
              <span class="is-apercu is-big is-green">$4,128</span><span class="is-apercu is-medium">$192.4</span>
            </div>
            <span class="is-medium" style={{alignSelf: 'flex-end', marginTop: '-1rem'}}>Premium</span>
          </div>
        </div>
        <div class="evaluate-right">
          <Map
            // eslint-disable-next-line
            style="mapbox://styles/mapbox/streets-v11"
            center={this.state.place ? this.state.center : [-118.832169, 34.030823]}
            zoom={this.state.place ? [18] : [7]}
            pitch={this.state.place ? [45] : [0]}
            antialias={true}
            onStyleLoad={this.loadedMap}
            onClick={this.mapClick}
            ref={ref => this.mapRef = ref}
            containerStyle={{
              height: "100vh",
              width: "65vw"
            }}>
          </Map>
        </div>
      </div>
    );
  }
}

export default Home;