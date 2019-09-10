import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";
import api from "./api.js";

class Signed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        first_name: null,
      }
    }
  }

  componentDidMount() {
    console.log(localStorage.getItem('user'));
    this.setState ({
      user: JSON.parse(localStorage.getItem('user')),
    })
  }

  render() {
    return (
      <div className="signed">
        <div class="signed-left">
          <Link to="/"><FeatherIcon class="special-back" icon="arrow-left"/></Link>
          <h1 class="cert-heading">Certificate of Insurance</h1>
          <div class="cert-content">
            <div class="titles">
              <h1 class="cert-questions">Policyholder</h1>
              <h1 class="cert-questions" style={{height: '6rem'}}>Test Policy</h1>
              <h1 class="cert-questions">Property</h1>
              <h1 class="cert-questions">Issued</h1>
              <h1 class="cert-questions">Expiry</h1>
              <h1 class="cert-questions">Premium</h1>
              <h1 class="cert-questions">Payout</h1>
            </div>
            <div class="answers">
              <h1 class="cert-answers">{this.state.user['last_name']}, {this.state.user['first_name']}</h1>
              <h1 class="cert-answers policy is-apercu">{this.state.user['policy']}</h1>
              <h1 class="cert-answers is-apercu">c496673</h1>
              <h1 class="cert-answers">{this.state.user['timestamp']}</h1>
              <h1 class="cert-answers">1 year</h1>
              <h1 class="cert-answers">Premium</h1>
              <h1 class="cert-answers">Payout</h1>
            </div>
            <FeatherIcon class="special-back" size={150} icon="shield" style={{alignSelf: 'flex-end', marginLeft: 'auto', marginRight: '3rem', marginBottom: '-15rem'}}/>
          </div>
        </div>
        <div class="signed-right">
          <img src="/images/opt-in.png" style={{width: '30rem', marginTop: '4rem'}} alt="illustration"/>
          <div class="card">
            <img src="/logo512.png" style={{width: '7rem', margin: "1rem"}} alt="illustration"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Signed;