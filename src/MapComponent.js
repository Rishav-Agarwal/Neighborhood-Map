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
		//query
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
		const currLocations = this.props.locations;
		currLocations.forEach((location, i) => {
			fetch('https://api.foursquare.com/v2/venues/search' +
				'?client_id=1JOTEIGYTGZQA3RUM0RLT4ZHZZGPABNN3P34M3J3K3VKOD0V' +
				'&client_secret=VNK0ZO2ZE1LEAUAOMYDXSF4254QDZJQ4H3H123ZJXAPTPYJ1' +
				'&v=20181201' +
				`&ll=${location.ll.lat},${location.ll.lng}` +
				`&query=${location.name}` +
				'&limit=5')
				.then(res => res.json())
				.then(data => {
					let venue = data.response.venues[0],
						venueName = location.name,
						venueAddress = venue.location.formattedAddress.join();
					this.markers[i].infoWindow.setContent(venueName + '<br/>' + venueAddress);
				});
		});
	}

	componentDidMount() {
		// Once the Google Maps API has finished loading, initialize the map
		this.getGoogleMaps().then((google) => {
			this.map = !this.map ? new google.maps.Map(document.getElementById('map'), {
				zoom: 5
			}) : this.map;
			this.bounds = new google.maps.LatLngBounds();
			const currLocations = this.props.locations;
			currLocations.forEach((location, i) => {
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
				this.markers.push(marker);
				this.bounds.extend(marker.marker.position);
			});
			this.map.fitBounds(this.bounds);
		});
	}

	render() {
		return <div id='map'></div>
	}
}

export default MapComponent;