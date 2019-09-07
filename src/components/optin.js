import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div class="optin">
      	<div class="coverage">
      		<Link class="icon" to="/"><FeatherIcon icon="arrow-left"/></Link>
      		<h1>Coverage</h1>
      	</div>
      	<div class="registration">
      		<FeatherIcon icon="user"/>
      		<h1>Registration</h1>
      	</div>
      </div>
    );
  }
}

export default Home;