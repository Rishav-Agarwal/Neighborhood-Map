import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

class Locations extends Component {

  state = {
    /**
     * Location query.
     * It has been initialized to query received from props. (Just initialization)
     * It's safe to do that because it doesn't depend on it later on.
     */
    query: this.props.query
  };

  static propTypes = {
    //Location query
    query: PropTypes.string,
    //Complete list of locations
    locations: PropTypes.array.isRequired,
    //Fired when query is updated
    onChangeQuery: PropTypes.func.isRequired,
    //Fired when location is clicked from list
    onClickLocation: PropTypes.func.isRequired
  };

  //Triggered when query id updated
  onChangeQuery = query => {
    //Update the query and set th state to reflect it
    this.props.onChangeQuery(query);
    this.setState({ query });
  };

  render() {
    /**
     * Extract the queried locations
     */
    //Initialize with all locations
    let currLocations = this.props.locations;
    //If query is not empty, filter the locations
    if (this.state.query) {
      //Create a match function for query using regular expressions
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      //Filter the list of locations
      currLocations = currLocations.filter(location => match.test(location.name));
    }
    //Sort the locations by name
    currLocations.sort(sortBy('name'));


    return (
      //The locations list
      <div id='locations' ref='locations'>
        {/* Heading */}
        <h1 tabIndex='0' id='locations-header'>Locations</h1>
        <hr />
        {/* The query input */}
        <input
          className='location-input'
          aria-label='Search location'
          type='text'
          value={this.state.query}
          placeholder='Enter location to search'
          onChange={e => this.onChangeQuery(e.target.value)} />
        {/* The list of locations */}
        <ul className='location-list' aria-labelledby='locations-header'> {
          // Loop over the locations and create a div for it
          currLocations.map(location => (
            <div
              key={location.name}
              tabIndex='0'
              role='listitem'
              onKeyUp={e => {
                if (e.keyCode === 13 || e.keyCode === 32)
                  e.target.click();
              }}
              onClick={() => this.props.onClickLocation(location.name)}>
              <li>
                {location.name}
              </li>
              <hr />
            </div>
          ))
        } </ul>
      </div>
    );
  }
}

export default Locations;