(function() {
	"use strict";

	var map = new google.maps.Map(document.querySelector('#map')),
		directionsService = new google.maps.DirectionsService,
		directionsDisplay = new google.maps.DirectionsRenderer,
		marker,
		markers = [],
		locationButtons = document.querySelectorAll('.change-location');

	var locationArray = [
		[43.028088, -81.261887],
		[43.009469, -81.274116],
		[42.966097, -81.282315]

	]

	// set up some map services
	directionsDisplay.setMap(map);


	// find coordinates, pass them to the map API and set the map's center
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setMapLocation, logFailed);
	}

	function logFailed(error) {
		console.log('geoloation not available: ' + error.message);
	}

	// delete markers from map
	function clearMarkers(map) {
  		for (var i = 0; i < markers.length; i++) {
   			markers[i].setMap(map);
  		}
	}

	// drop a new pin, erase the old ones
	function dropPin(loc) {
		if (marker) {
			clearMarkers(null);
		}

		marker = new google.maps.Marker({
			position : loc,
			map : map,
			title : "howdy do!"
		});
		
		marker.setMap(map);
		markers.push(marker);
	}

	function setMapLocation(geoObject) {
		var newLatLng = {
			lat: geoObject.coords.latitude,
			lng: geoObject.coords.longitude
		}

		map.setCenter(newLatLng);
		//map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
		map.setZoom(16);

		dropPin(newLatLng);
	}

	function changeMapLocation() {
		var primaryIndex = parseInt(this.dataset.locindex, 10);

		var newCoords = {
			coords : {
				latitude: locationArray[primaryIndex][0],
				longitude: locationArray[primaryIndex][1]
			}
		};

		setMapLocation(newCoords);
	}

	// directions service => show routes
	

	// directions matrix => show times
	

	// listeners
	[].forEach.call(locationButtons, function(el) {
		el.addEventListener('click', changeMapLocation, false);
	});
})();