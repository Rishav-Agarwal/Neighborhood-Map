import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

class Locations extends Component {

  state = {
    query: this.props.query //Just the initial value
  };

  static propTypes = {
    locations: PropTypes.array.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onClickLocation: PropTypes.func.isRequired
  };

  onChangeQuery = query => {
    this.props.onChangeQuery(query);
    this.setState({ query });
  };

  render() {
    let currLocations = this.props.locations;
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      currLocations = currLocations.filter(location => match.test(location.name));
    }
    currLocations.sort(sortBy('name'));
    return (
      <div id='locations' ref='locations'>
        <h1>Locations</h1>
        <hr />
        <input
          className='location-input'
          type='text'
          value={this.state.query}
          placeholder='Enter location to search'
          onChange={e => this.onChangeQuery(e.target.value)} />
        <ul className='location-list'> {
          currLocations.map(location => (
            <div key={location.name} onClick={() => this.props.onClickLocation(location.name)}>
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