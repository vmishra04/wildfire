import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoianJteSIsImEiOiJjazA5MXQwdngwNDZhM2lxOHFheTlieHM3In0.1Jh_NjL_Nu3YYeMUOZvmrA"
});

class Home extends Component {

  constructor(props) {
    super(props);
    this.handleProgress = this.handleProgress.bind(this);
    this.actualProgress = React.createRef();
    this.progress = React.createRef();
    this.state = {
    }
  }

  componentDidMount() {
    
  }

  handleProgress(event) {
    this.actualProgress.value = event.target.value;
    this.progress.value = event.target.value;
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
              <span class="is-apercu is-big is-green">$9000</span><span class="is-apercu is-medium">$300</span>
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
            <FeatherIcon icon="map-pin"/><br /><br />
            <input class="input-address" type="text" placeholder="Address"/>
            <div class="map">
              <Map
                // eslint-disable-next-line
                style="mapbox://styles/mapbox/streets-v11"
                center={[-118.832169, 34.030823]}
                zoom={[5]}
                containerStyle={{
                  height: "25rem",
                  width: "43.05rem"
                }}>
                  <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[-77.050, 38.889]}/>
                  </Layer>
              </Map>
            </div>
            <input type="submit" value="Submit" />
            </form>
        </div>
      </div>
    );
  }
}

export default Home;