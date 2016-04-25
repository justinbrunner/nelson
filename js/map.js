(function() {
	"use strict";

	var map = new google.maps.Map(document.querySelector('#map_canvas')),
		directionsService = new google.maps.DirectionsService,
		directionsDisplay = new google.maps.DirectionsRenderer,
		distanceMatrix = new google.maps.DistanceMatrixService,
		geocoder = new google.maps.Geocoder(),
		marker,
		markers = [],
		locationControl = document.querySelector('#location'),
		addressField = document.querySelector('.address-control'),
		quarrySelected = false,
		quarryLocation,
		cusIcon = "images/markers.svg";

	var locationArray = {
		burlington : [43.402310, -79.878961],
		lincoln : [43.115023, -79.490638],
		uhthoff : [44.681592, -79.482264],
		oneida : [42.955665, -79.950981],
		waynco : [43.325848, -80.303435]
	};

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
			title : "howdy do!",
			icon: cusIcon
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
		map.setZoom(12);

		dropPin(newLatLng);
	}

	function geoCodeAddress(e) {
		var address = e.currentTarget.value;

		if (address == "" || address == undefined) {
			// handle this error somehow => with a Foundation custom element perhaps?
			console.log('somehow an empty field made it through - handle this error');
			return;
		}

		geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	if (!quarrySelected) {
			        var marker = new google.maps.Marker({
			            map: map,
			            position: results[0].geometry.location
			        });
			        map.setCenter(results[0].geometry.location);
			    } else {
			    	clearMarkers(null);
			    	// do directions service using the quarry and the address for start and end points
			    	var start = new google.maps.LatLng(quarryLocation.coords.latitude, quarryLocation.coords.longitude),
						end = results[0].geometry.location;

					var request = {
							origin:start,
							destination:end,
							travelMode: google.maps.TravelMode.DRIVING,
							provideRouteAlternatives: true,
							avoidTolls: true
						};

					directionsService.route(request, function(result, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(result);
						}
					});

					// call distance matrix here and figure out what to do with the results
					distanceMatrix.getDistanceMatrix({
						origins: [start],
						destinations: [end],
						travelMode: google.maps.TravelMode.DRIVING,
						avoidHighways: false,
						avoidTolls: true
					}, function(response, status){
						if (status !== google.maps.DistanceMatrixStatus.OK) {
							console.log('Error! which was: ' + status);
						} else {
							console.log(response, status);
						}
					});					
			    }
		    } else {
		    	// handle this error somehow => with a Foundation custom element perhaps?
		    	console.log("Geocode was not successful for the following reason: " + status);
		    }
	    });
	}

	function changeMapLocation(e) {
		var arrayIndex = e.currentTarget.value;

		var newCoords = {
			coords : {
				latitude: locationArray[arrayIndex][0],
				longitude: locationArray[arrayIndex][1]
			}
		};

		setMapLocation(newCoords);
		quarrySelected = true;
		quarryLocation = newCoords;
	}

	// directions service => show routes
	

	// directions matrix => show times
	

	// listeners
	locationControl.addEventListener('change', changeMapLocation, false);
	addressField.addEventListener('blur', geoCodeAddress, false);
})();