import React, { Component } from 'react';
import MapComponent from './MapComponent';
import './App.css';
import Locations from './Locations';

class App extends Component {

  state = {
    query: '',
    showLocations: true,
    locations: [
      { name: 'Taj Mahal', ll: { lat: 27.1750151, lng: 78.0421552 } },
      { name: 'Qutub Minar', ll: { lat: 28.5244754, lng: 77.1855206 } },
      { name: 'Victoria Memorial', ll: { lat: 22.546883, lng: 88.340804 } },
      { name: 'Lotus Temple', ll: { lat: 28.553492, lng: 77.2588264 } },
      { name: 'India Gate', ll: { lat: 28.6109401, lng: 77.234482 } },
      { name: 'Gateway of India', ll: { lat: 18.9219841, lng: 72.8346543 } }
    ],
    marked: undefined
  };

  onUpdateLocation = (location, i) => {
    this.setState(prev => {
      prev.locations[i] = location;
      return { locations: prev.locations };
    });
  };

  render() {
    return (
      <div id='app'>
        {this.state.showLocations && (
          <Locations
            query={this.state.query}
            onClickLocation={location => { this.setState({ marked: location }); }}
            onChangeQuery={query => this.setState({ query })}
            locations={this.state.locations} />)}

        <MapComponent
          query={this.state.query}
          marked={this.state.marked}
          locations={this.state.locations}
          onClickMenuIcon={() => this.setState(prev => ({
            showLocations: !(prev.showLocations)
          }))}
          onUpdateLocation={this.onUpdateLocation}
          onCloseInfoWindow={() => this.setState({ marked: undefined })} />
      </div>
    );
  }
}

export default App;