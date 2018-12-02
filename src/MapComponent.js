import React, { Component } from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'escape-string-regexp';

class MapComponent extends Component {

  map;
  markers = [];
  bounds;

  static propTypes = {
    query: PropTypes.string,
    locations: PropTypes.array.isRequired,
    marked: PropTypes.string,
    onClickMenuIcon: PropTypes.func.isRequired,
    onUpdateLocation: PropTypes.func.isRequired,
    onCloseInfoWindow: PropTypes.func.isRequired
  };

  onClickMenuIcon = target => {
    this.refs.menuIcon.classList.toggle('fa-chevron-right');
    this.refs.menuIcon.classList.toggle('fa-chevron-left');
    this.props.onClickMenuIcon();
  };

  updateMarkers = () => {
    const match = new RegExp(escapeRegExp(this.props.query ? this.props.query : ''), 'i');
    const currLocations = this.props.locations;
    currLocations.forEach((location, i) => {
      this.markers[i].infoWindow.close();
      if (match.test(location.name)) {
        this.markers[i].marker.setMap(this.map);
      }
      else {
        this.markers[i].marker.setMap(null);
      }
      if (this.props.marked && location.name === this.props.marked) {
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
      this.bounds = new google.maps.LatLngBounds();
      this.props.locations.forEach((location, i) => {
        let marker = {};
        marker.marker = new google.maps.Marker({
          position: location.ll,
          map: this.map,
          id: i,
          title: location.name
        });
        marker.infoWindow = new google.maps.InfoWindow({
          content: this.props.locations[i].name
        });
        marker.marker.addListener('click', () => {
          marker.infoWindow.open(this.map, marker.marker);
        });
        marker.infoWindow.addListener('closeclick', this.props.onCloseInfoWindow);
        this.markers.push(marker);
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
            this.markers[i].infoWindow.setContent(venueName + '<br/>' + venueAddress);
            location.address = venueAddress;

            this.props.onUpdateLocation(location, i);
          });
        this.bounds.extend(marker.marker.position);
      });
      this.map.fitBounds(this.bounds);
    });
  }

  render() {
    if (this.markers.length)
      this.updateMarkers();
    return (
      <div id='map-container'>
        <div id='map' />

        <div className='menu-icon' onClick={this.onClickMenuIcon}>
          <i ref='menuIcon' className="fas fa-chevron-left"></i>
        </div>
      </div>
    );
  }
}

export default MapComponent;