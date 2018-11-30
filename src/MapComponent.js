import React, { Component } from 'react';

class MapComponent extends Component {

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
				script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
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
			const home = { lat: 22.6205334, lng: 88.3531756 };
			const map = new google.maps.Map(document.getElementById('map'), {
				zoom: 15,
				center: home
			});
			const marker = new google.maps.Marker({
				position: home,
				map: map
			});
		});
	}

	render() {
		return <div id='map'></div>
	}
}

export default MapComponent;