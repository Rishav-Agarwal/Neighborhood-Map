import React, { Component } from 'react';
import MapComponent from './MapComponent';
import './App.css';

class App extends Component {

  state = {
    /*
     *  Currently empty.
     *  `locations` array could be put here if its loaded dynamically (may be based on user's location)
     */
  };

  //This could be put into the Component's state if fetched dynamically
  locations = [
    { lat: 27.1750151, lng: 78.0421552 },
    { lat: 28.5244754, lng: 77.1855206 },
    { lat: 22.546883, lng: 88.340804 },
    { lat: 28.553492, lng: 77.2588264 },
    { lat: 28.6109401, lng: 77.234482 },
    { lat: 18.9219841, lng: 72.8346543 }
  ];

  render() {
    return (
      <MapComponent locations={this.locations} />
    );
  }
}

export default App;