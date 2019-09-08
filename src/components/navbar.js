import React, { Component } from 'react';
import './../App.css';

class Navbar extends Component {

  render() {
    return (
      <div className="navbar">
        <img class="logo" src="/logo512.png" alt="logo" style={{alignSelf: 'flex-start', marginLeft: '6rem', width: '3rem', paddingTop: '1.5rem'}}></img>
      </div>
    );
  }
}

export default Navbar;