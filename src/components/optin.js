import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";
import ReactMapboxGl from "react-mapbox-gl";
import counterUp from 'counterup2';
import api from "./api.js";


const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoianJteSIsImEiOiJjazA5MXQwdngwNDZhM2lxOHFheTlieHM3In0.1Jh_NjL_Nu3YYeMUOZvmrA"
});

class Home extends Component {

  constructor(props) {
    super(props);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.loadedMap = this.loadedMap.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.reset = this.reset.bind(this);
    this.actualProgress = React.createRef();
    this.progress = React.createRef();
    this.state = {
      suggestions: [],
      place: null,
      center: [-118.832169, 34.030823],
      placeName: null,
      locked: true,
    }
  }

  componentDidMount() {
    const el1 = document.querySelector('.counter1')
    const el2 = document.querySelector('.counter2')
    counterUp(el1, {
      duration: 1000,
      delay: 16,
    })
    counterUp(el2, {
      duration: 1000,
      delay: 16,
    })
  }

  handleProgress(event) {
    this.actualProgress.value = event.target.value;
    this.progress.value = event.target.value;
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
    this.inputPlaces.value = object.place_name;
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
    try {
      // eslint-disable-next-line
      const check = features[0].layer;
    } catch(e) {
      return;
    }
    if(features[0].layer.id!=='3d-buildings') return;
    api.search(`${this.state.center[0]},${this.state.center[1]}`).then(response => {
      this.setState({
        place: response.data.features[0],
        center: features[0].geometry.coordinates[0][0],
        locked: true,
        placeName: response.data.features[0].place_name,
      })
    });
    this.inputPlaces.value = this.state.place.place_name;
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
      <div class="optin">
        <div class="coverage">
          <Link class="icon" to="/"><FeatherIcon icon="arrow-left"/></Link>
          <h1>Coverage</h1>
          <div class="actual-coverage">
            <span class="is-big" style={{marginBottom: '-0.25rem'}}>Payout</span>
            <div class="coverage-numbers">
              <span class="is-apercu is-big is-green counter1">$9000</span><span class="is-apercu is-medium counter2">$300</span>
            </div>
            <span class="is-medium" style={{alignSelf: 'flex-end', marginTop: '-1rem'}}>Premium</span>
          </div>
          <input class="slider" type="range" name="points" steps="100" min="0" max="100" defaultValue="0" onChange={this.handleProgress} ref={(progress) => { this.progress = progress }}/>
          <progress class="" value={0} max='100' ref={(actualProgress) => { this.actualProgress = actualProgress }}>15%</progress>
          <img src="/images/opt-in.png" style={{width: '30rem', marginTop: '4rem'}} alt="illustration"/>
        </div>
        <div class="registration">
          <FeatherIcon icon="user"/>
          <h1>Registration</h1>
          <form method="post" action="/register">
            <div class="input-rows">
              <input type="text" placeholder="First Name"/>
              <input type="text" placeholder="Last Name"/>
            </div>
            <div class="input-rows">
              <input type="email" placeholder="Email"/>
              <input type="text" placeholder="Social Security Number"/>
            </div>
            <div class="above-optin-search">
              <FeatherIcon icon="map-pin"/>
              <span class="tag is-apercu" style={{display: this.state.locked&&this.state.place ? 'inherit' : 'none'}}>0x233bfshjdf2347</span>
              <FeatherIcon icon="x-circle" onClick={this.reset} style={{display: this.state.locked&&this.state.place ? 'inherit' : 'none'}}/>
            </div>
            <input class="input-address" type="text" placeholder="Address" onChange={this.handleInput} ref={(inputPlaces) => {this.inputPlaces = inputPlaces}}/>
            {this.state.suggestions.map((object, index) => {
              return(
                <p key={index} class="suggestion optin-suggestion" onClick={this.handleSelection.bind(null, object)}>{object.place_name}</p>
              );
            })}
            <div class="map optin-map">
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
                  height: "25rem",
                  width: "43.05rem"
                }}>
              </Map>
            </div>
            <input type="submit" value="Submit" disabled={this.state.locked&&this.state.place ? false : true} style={{opacity: this.state.locked&&this.state.place ? 1 : 0.5, cursor: this.state.locked&&this.state.place ? 'pointer' : 'not-allowed'}}/>
            </form>
        </div>
      </div>
    );
  }
}

export default Home;