import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MapComponent extends Component {

	map;
	markers = [];
	bounds;

	static propTypes = {
		locations: PropTypes.array.isRequired
	};

	state = {
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
				const API = YOUR_GOOGLE_MAPS_API_KEY;
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
				zoom: 5
			}) : this.map;
			this.bounds = new google.maps.LatLngBounds();
			const currLocations = this.props.locations;
			this.markers = currLocations.forEach((element, i) => {
				let marker = new google.maps.Marker({
					position: element,
					map: this.map,
					id: i
				});
				this.markers.push(marker);
				this.bounds.extend(marker.position);
			});
			this.map.fitBounds(this.bounds);
		});
	}

	render() {
		return <div id='map'></div>
	}
}

export default MapComponent;