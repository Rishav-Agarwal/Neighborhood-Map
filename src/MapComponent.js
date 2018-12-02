import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';

class MapComponent extends Component {

  //The google maps variable
  map;
  //Stores the markers and it associated details
  markers = [];
  //Bounds of the map to be shown
  bounds;

  static propTypes = {
    //Loations' search query
    query: PropTypes.string,
    //Complete list of locations
    locations: PropTypes.array.isRequired,
    //Location clicked on the locations' list
    marked: PropTypes.string,
    //Fired when locations list show/hide icon is clicked
    onClickMenuIcon: PropTypes.func.isRequired,
    //Fired when a location info is updated
    onUpdateLocation: PropTypes.func.isRequired,
    //Fired when a markers `InfoWindow`(additional details) is closed
    onCloseInfoWindow: PropTypes.func.isRequired
  };

  //Triggered when locations list show/hide icon is clicked
  onClickMenuIcon = target => {
    //Toggle the icon's direction
    this.refs.menuIcon.classList.toggle('fa-chevron-right');
    this.refs.menuIcon.classList.toggle('fa-chevron-left');
    this.props.onClickMenuIcon();
  };

  //Updates marker everytime map is rendered
  updateMarkers = () => {
    /**
     * Loop over the locations, check if it should be shown on the map and extend bounds according to it.
     * It a location was clicked, animate it.
     */
    const match = new RegExp(escapeRegExp(this.props.query ? this.props.query : ''), 'i');
    const currLocations = this.props.locations;
    currLocations.forEach((location, i) => {
      this.markers[i].infoWindow.close();
      //Location should be shown
      if (match.test(location.name))
        this.markers[i].marker.setMap(this.map);
      //Location should not be shown
      else
        this.markers[i].marker.setMap(null);
      console.log(this.props.marked, location.name);
      //Location was clicked on locations list
      if (this.props.marked && location.name === this.props.marked) {
        console.log(true);
        this.markers[i].marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => this.markers[i].marker.setAnimation(null), 1000);
        new window.google.maps.event.trigger(this.markers[i].marker, 'click');
      }
      this.bounds.extend(this.markers[i].marker.position);
    });
    this.map.fitBounds(this.bounds);
  };

  /*
   *	Load google maps using ReactJS.
   *	Code reference from - https://stackoverflow.com/questions/48493960/using-google-map-in-react-component/48494032#48494032
   */
  getGoogleMaps() {
    // If we haven't already defined the promise, define it
    if (!this.googleMapsPromise) {
      this.googleMapsPromise = new Promise(resolve => {
        // Add a global handler for when the API finishes loading
        window.resolveGoogleMapsPromise = () => {
          // Resolve the promise
          resolve(window.google);

          // Tidy up
          delete window.resolveGoogleMapsPromise;
        };

        // Load the Google Maps API
        const script = document.createElement("script");
        //Set yout Google Maps API key here
        const API = 'AIzaSyAwfrAFXPYQg-Nlj8vpnYWnoeTe3s8x0vo';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&v=3&callback=resolveGoogleMapsPromise`;
        script.async = true;
        script.defer = true;
        //Append the script to the HTML
        document.body.appendChild(script);
      });
    }

    // Return a promise for the Google Maps API
    return this.googleMapsPromise;
  }

  componentWillMount() {
    // Start Google Maps API loading since we know we'll soon need it
    this.getGoogleMaps();
  }

  componentDidMount() {
    // Once the Google Maps API has finished loading, initialize the map
    this.getGoogleMaps().then((google) => {
      this.map = !this.map ? new google.maps.Map(document.getElementById('map'), {
        zoom: 12
      }) : this.map;
      this.map.addListener('tilesloaded', () => {
        [].slice.apply(this.refs.map.querySelectorAll('*')).forEach(item => {
          item.setAttribute('tabIndex', '-1');
        });
      });
      this.bounds = new google.maps.LatLngBounds();
      /**
       * For each location-
       *  1. Create a marker
       *  2. Create a InfoWindow.
       *  3. Attach info-window to marker.
       *  4. Store the marker and related details in an array.
       *  5. Fetch its additional details and update the location's info.
       */
      this.props.locations.forEach((location, i) => {
        //Markers array
        let marker = {};
        //Create marker
        marker.marker = new google.maps.Marker({
          position: location.ll,
          map: this.map,
          id: i,
          title: location.name
        });
        //Create info window for the marker
        marker.infoWindow = new google.maps.InfoWindow({
          content: `<div class='info-window' tabindex='0'>${this.props.locations[i].name}</div>`
        });
        //Attach click and close events of infowindow with marker
        marker.marker.addListener('click', () => {
          marker.infoWindow.open(this.map, marker.marker);
        });
        marker.infoWindow.addListener('closeclick', this.props.onCloseInfoWindow);
        this.markers.push(marker);
        //Fetch additional details for the location
        fetch('https://api.foursquare.com/v2/venues/search' +
          '?client_id=PV25QR443ZLWVJAEWISOXMMWM403GU2AXY0IOLW02HV5CSCA' +
          '&client_secret=HRNFPO004M2V3BJ02AWKNQUQ1FU2E3L5ZQF5HTJV5M5T3030' +
          '&v=20181201' +
          `&ll=${location.ll.lat},${location.ll.lng}` +
          `&query=${location.name}` +
          '&limit=5')
          .then(res => res.json())
          .then(data => {
            //let venue, venueAddress, venueName = location.name;
            let venue = data.response.venues[0],
              venueName = location.name,
              venueAddress = venue.location.formattedAddress.join();
            /*
             *  Un-comment the below comment, remove the venue details above and,
             *  remove the api credentials from the fetch call to test with sample data
             */
            /*switch (i) {
              case 0:
                venueAddress = 'Near Agra Fort(Fatehabad Road), Āgra 282001, Uttar Pradesh, India';
                break;
              case 1:
                venueAddress = 'Lado Sarai,New Delhi 110030,Delhi,India';
                break;
              case 2:
                venueAddress = '1, Queen\'s Way, Kolkata 700071, West Bengal, India';
                break;
              case 3:
                venueAddress = 'Bahapur, Kalkaji,New Delhi 110019,Delhi,India';
                break;
              case 4:
                venueAddress = 'India Gate C-Hexagon (Rajpath),New Delhi,Delhi,India';
                break;
              case 5:
                venueAddress = 'Apollo Bandar, Off P J Ramchandani Marg (near the Taj Mahal Palace & Tower),Mumbai 400001,Mahārāshtra,India';
                break;
              default:
                venueAddress = 'Unknown';
            }*/
            //Update location's info and InfoWindow's content
            this.markers[i].infoWindow.setContent(`<div class='info-window' tabindex='0'>${venueName}<br />${venueAddress}</div>`);
            location.address = venueAddress;

            this.props.onUpdateLocation(location, i);
          }).catch(err => {
            console.log(err);
            this.refs.failed.classList.remove('hide');
          });
        this.bounds.extend(marker.marker.position);
      });
      this.map.fitBounds(this.bounds);
    });
  }

  render() {
    //If markers have been created, update them
    if (this.markers.length)
      this.updateMarkers();
    return (
      <div id='map-container'>
        {/* Locations list toggle icon */}
        <div tabIndex='0' className='menu-icon'
          onClick={this.onClickMenuIcon}
          onKeyUp={e => {
            if (e.keyCode === 13 || e.keyCode === 32)
              e.target.click();
          }}>
          <i ref='menuIcon' className="fas fa-chevron-left"></i>
        </div>

        {/* The map */}
        <div id='map' ref='map' />

        {/* Div to show if data could not be loaded */}
        <div className='failed hide' ref='failed'>
          <span>Failed to load details about the locations! :(</span>
          <span
            className='failed-cross'
            onClick={e => e.target.parentNode.classList.add('hide')}
            style={{
              cursor: 'pointer',
              margin: '4px',
              padding: '4px',
              fontSize: '12px',
              float: 'right'
            }}>
            &#10006;
            </span>
        </div>
      </div>
    );
  }
}

export default MapComponent;