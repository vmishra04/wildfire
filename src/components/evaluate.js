import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";
import ReactMapboxGl from "react-mapbox-gl";
import counterUp from 'counterup2';
import api from "./api.js";
import {ZoomControl} from "react-mapbox-gl";
import * as d3 from 'd3';
import {select} from 'd3-selection';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoianJteSIsImEiOiJjazA5MXQwdngwNDZhM2lxOHFheTlieHM3In0.1Jh_NjL_Nu3YYeMUOZvmrA"
});

class Home extends Component {

  constructor(props) {
    super(props);
    this.inputPlaces = React.createRef();
    this.svg = React.createRef();
    this.handleInput = this.handleInput.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.loadedMap = this.loadedMap.bind(this);
    this.getAI = this.getAI.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      suggestions: [],
      place: null,
      center: [-118.832169, 34.030823],
      placeName: null,
      locked: true,
      aidata: [0,0,0,0,0,0],
    }
  }

  componentDidMount() {
    /*const el1 = document.querySelector('.counter1')
    const el2 = document.querySelector('.counter2')
    counterUp(el1, {
      duration: 1000,
      delay: 16,
    })
    counterUp(el2, {
      duration: 1000,
      delay: 16,
    })*/
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
    this.getAI(this.state.center[0], this.state.center[1]);
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

  createLegend(arr) {
    const svg = this.svg;
    const color_domain = [2000, 4000, 6000, 8000, 10000, 12000];
    const ext_color_domain = arr;
    const legend_labels = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const ls_w = 20; const ls_h = 20;
    const legend = select(svg)
        .selectAll('legend')
        .data(ext_color_domain)
        .enter().append('g')
        .attr('class', 'legend');
    legend.append('rect')
        .attr('y', 20)
        .attr('x', function(d, i) {
          return 200 - (i*ls_h) - (2*ls_h);
        })
        .attr('width', ls_w)
        .attr('height', ls_h)
        .style('fill', function(d, i) {
          return d3.interpolateReds(d);
        });
    legend.append('text')
        .attr('y', 50)
        .attr('x', function(d, i) {
          return 200 - (i*ls_h) - ls_h - 10;
        })
        .text(function(d, i) {
          return legend_labels[i];
        })
        .attr('class', 'is-circular')
        .style('fill', '#424242')
        .style('font-size', '0.5rem')
        .style('font-weight', '600');
  }


  getAI(lat, long) {
    let arr = []
    api.ai(long, lat).then(data => {
      arr = data.data.data[4]
      console.log(arr)
      let max = arr[0]
      for(let i = 1; i<5; i++) {
        if(arr[i]>max) {
          max = arr[i]
        }
      }
      let min = arr[0]
      for(let i = 1; i<6; i++) {
        if(arr[i]<min) {
          min = arr[i]
        }
      }
      console.log(max)
      console.log(min)
      for(let i=0; i<arr.length; i++) {
        let newVal = (arr[i]-min)/(max-min);
        arr[i] = newVal;
      }
      arr.pop()
      this.setState({
        aidata: arr,
      })
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
          <div class="evaluation is-apercu" >
            <div class="eval-2">
              <div class="square" style={{background: 'rgba(244, 84, 34, '+this.state.aidata[0]+');'}}>{this.state.aidata[0].toFixed(2)}</div>
              <div class="square" style={{background: 'rgba(244, 84, 34, '+this.state.aidata[1]+');'}}>{this.state.aidata[1].toFixed(2)}</div>
              <div class="square" style={{background: 'rgba(244, 84, 34, '+this.state.aidata[2]+');'}}>{this.state.aidata[2].toFixed(2)}</div>
              <div class="square" style={{background: 'rgba(244, 84, 34, '+this.state.aidata[3]+');'}}>{this.state.aidata[3].toFixed(2)}</div>
              <div class="square" style={{background: 'rgba(244, 84, 34, '+this.state.aidata[4]+');'}}>{this.state.aidata[4].toFixed(2)}</div>
            </div>
            <div class="eval-2">
              <div class="square">I</div>
              <div class="square">II</div>
              <div class="square">III</div>
              <div class="square">IV</div>
              <div class="square">V</div>
            </div>
          </div>
          <div class="actual-coverage">
            <span class="is-big" style={{marginBottom: '-0.25rem'}}>Payout</span>
            <div class="coverage-numbers">
              <span class="is-apercu is-big is-green counter1">$9413</span><span class="is-apercu is-medium counter2">$192.4</span>
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
            containerStyle={{
              height: "100vh",
              width: "65vw"
            }}>
            <ZoomControl />
          </Map>
        </div>
      </div>
    );
  }
}

export default Home;