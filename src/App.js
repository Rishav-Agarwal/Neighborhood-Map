import React, { Component } from 'react';
import MapComponent from './MapComponent';
import './App.css';
import Locations from './Locations';

class App extends Component {

  state = {
    //Location searched for
    query: '',
    //Should the locations list be shown
    showLocations: false,
    //The list of locations
    locations: [
      { name: 'Gateway of India', ll: { lat: 18.9219841, lng: 72.8346543 } },
      { name: 'India Gate', ll: { lat: 28.6109401, lng: 77.234482 } },
      { name: 'Lotus Temple', ll: { lat: 28.553492, lng: 77.2588264 } },
      { name: 'Qutub Minar', ll: { lat: 28.5244754, lng: 77.1855206 } },
      { name: 'Taj Mahal', ll: { lat: 27.1750151, lng: 78.0421552 } },
      { name: 'Victoria Memorial', ll: { lat: 22.546883, lng: 88.340804 } }
    ],
    //Stores if location was clicked from locations list
    marked: undefined
  };

  /**
   * This function is triggered if a location's info is updated(currently address).
   * It updates the location and sets the state of the component.
   */
  onUpdateLocation = (location, i) => {
    this.setState(prev => {
      prev.locations[i] = location;
      return { locations: prev.locations };
    });
  };

  render() {
    return (
      <div id='app'>
        { //If locations list should be shown, display it
          this.state.showLocations && (
            <Locations
              //location query
              query={this.state.query}
              //It is fired when a location is clicked from locations' list
              onClickLocation={location => { this.setState({ marked: location }); }}
              //It is fired when locations' query changes
              onChangeQuery={query => this.setState({ query })}
              //The complete list of locations
              locations={this.state.locations} />)}

        <MapComponent
          //location query
          query={this.state.query}
          //Location which was clicked from locations' list
          marked={this.state.marked}
          //The complete list of locations
          locations={this.state.locations}
          //Fired when locations' list component should open/close
          onClickMenuIcon={() => this.setState(prev => ({
            showLocations: !(prev.showLocations)
          }))}
          //Fired when a location's info is updated
          onUpdateLocation={this.onUpdateLocation}
          //Fired when `InfoWindow`(additional info) of a location is closed
          onCloseInfoWindow={() => this.setState({ marked: undefined })} />
      </div>
    );
  }
}

export default App;