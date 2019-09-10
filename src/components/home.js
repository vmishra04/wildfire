import React, { Component } from 'react';
import './../App.css';

import FeatherIcon from 'feather-icons-react';
import {Link} from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div class="home">

        <div class="transactions">
          <table class="table is-striped">
          <tbody>
            <tr>
              <th>Transaction</th>
              <th>Block</th>
              <th>Age</th>
              <th>Premium/<br/>Payout</th>
            </tr>
            <tr>
              <td>0x26fc9298</td>
              <td>8501417</td>
              <td>50 secs</td>
              <td><FeatherIcon icon="award" /> $142</td>
            </tr>
            <tr>
              <td>0x8b481328</td>
              <td>8501417</td>
              <td>94 secs</td>
              <td><FeatherIcon icon="alert-triangle" /> $2391</td>
            </tr>
            <tr>
              <td>0x4168d42F</td>
              <td>8501417</td>
              <td>4 mins</td>
              <td><FeatherIcon icon="alert-triangle" /> $2214</td>
            </tr>
            <tr>
              <td>0x26fc923A</td>
              <td>8501417</td>
              <td>2 days</td>
              <td><FeatherIcon icon="award" /> $891</td>
            </tr>
            <tr>
              <td>0x8b481923</td>
              <td>8501417</td>
              <td>2 days</td>
              <td><FeatherIcon icon="award" /> $192</td>
            </tr>
            <tr>
              <td>0x4168d983</td>
              <td>8501417</td>
              <td>5 days</td>
              <td><FeatherIcon icon="award" /> $273</td>
            </tr>
            <tr>
              <td>0x4168d42F</td>
              <td>8501417</td>
              <td>5 days</td>
              <td><FeatherIcon icon="alert-triangle" /> $2214</td>
            </tr>
            </tbody>
          </table>
          <p class="helper">Contract Transactions of Sacramento, CA – 94203 <FeatherIcon icon="external-link" size="13"/></p>
        </div>

        <div class="header">
          <img class="logo" src="/logo512.png" alt="logo"></img>
          <h1>Instant Insurance against Wildfires</h1>
          <div class="buttons">
            <Link to='/evaluate'>Evaluate</Link>
            <Link to='/optin'>Opt-In</Link>
          </div>
        </div>

      </div>
    );
  }
}

export default Home;