(function() {
	"use strict";

	var map = new google.maps.Map(document.querySelector('#map_canvas')),
		directionsService = new google.maps.DirectionsService,
		distanceMatrix = new google.maps.DistanceMatrixService,
		geocoder = new google.maps.Geocoder(),
		marker,
		markers = [],
		routeColors = ['blue', 'gray'],
		//locationControl = document.querySelector('#location'),
		addressFields = document.querySelectorAll('.address-control'),
		quarrySelected = false,
		deliveryAddress = false,
		quarryLocation,
		deliveryLocation,
		cusIcon = "images/pickup.png",
		mapRenderers = [],
		routeSelect = document.querySelector('.route-select');

	var locationArray = {
		burlington : [43.402310, -79.878961],
		lincoln : [43.115023, -79.490638],
		uhthoff : [44.681592, -79.482264],
		oneida : [42.955665, -79.950981],
		waynco : [43.325848, -80.303435]
	};

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
		clearMarkers(null);

		var address = e.currentTarget.value,
			entryPoint;

		if (address == "" || address == undefined) {
			// handle this error somehow => with a Foundation custom element perhaps?
			console.log('somehow an empty field made it through - handle this error');
		} else {
			entryPoint = e.currentTarget.name;
		}

		geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		    	// if the quarry or delivery address aren't selected, drop a pin. else do the directions service, because one or the other is selected

		    	if (!quarrySelected || !deliveryAddress) {
			        var marker = new google.maps.Marker({
			            map: map,
			            position: results[0].geometry.location
			        });

			        markers.push(marker);
			        map.setCenter(results[0].geometry.location);

			        if (entryPoint == "quarry_address") {
			        	quarrySelected = true;
			        	quarryLocation = results[0].geometry.location;
			        } else {
			        	deliveryAddress = true;
			        	deliveryLocation = results[0].geometry.location;
			        }
			    } else {
			     	clearMarkers(null);

			    	// do directions service using the quarry and the address for start and end points
			     	var start = quarryLocation,//new google.maps.LatLng(quarryLocation.coords.latitude, quarryLocation.coords.longitude),
					 	end = deliveryLocation;

					var request = {
							origin: start,
							destination: end,
							travelMode: google.maps.TravelMode.DRIVING,
							provideRouteAlternatives: true,
							avoidTolls: true
						};

					[].forEach.call(mapRenderers, function(renderer) {
						renderer.setMap(null);
					});

					directionsService.route(request, function(result, status) {
						if (status == google.maps.DirectionsStatus.OK) {

							console.log(result);

							 for (var i = 0, len = result.routes.length; i < len; i++) {
				                var renderer = new google.maps.DirectionsRenderer({
				                    map: map,
				                    directions: result,
				                    routeIndex: i,
				                    polylineOptions : {
				                    	strokeColor: "rgba(150,150,150,0.6)"
				                    }
				                });
				                // google.maps.event.addListener(renderer, 'routeindex_changed', function() {
				                // 	alert(renderer.getRouteIndex());
				                // });
				                mapRenderers.push(renderer);
							}

							mapRenderers[mapRenderers.length -1].setMap(null);

							mapRenderers[mapRenderers.length -1].setOptions({
				                polylineOptions : {
				                	strokeColor : "rgba(50,50,255,0.85)",
				                	zIndex : 1
				                }
				            });

				            mapRenderers[mapRenderers.length -1].setMap(map);

				            var total = 0;
				            for (var i = 0, len = result.routes[0].legs.length; i<len; i++) {
				            	total += result.routes[0].legs[i].distance.value;
				            }

				            console.log('the total distance for the first route is: ' + (total/1000) + "km");
				            //createControls(mapRenderers);
							//routeSelect.classList.add('show-routes');
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
							//console.log(response, status);
							var distanceResult = response.rows[0].elements[0].distance.text;
							console.log(distanceResult);
							
							// set the travel distance in sales.js
							mySalesInfo.setTime(distanceResult);
						}
					});

					// [].forEach.call(mapRenderers, function(renderer) {
					// 	google.maps.event.addListener(renderer, 'routeindex_changed', function() {
					// 		console.log(renderer, getRouteIndex());
					// 	});
					// });				
			    }
		    } else {
		    	// handle this error somehow => with a Foundation custom element perhaps?
		    	console.log("Geocode was not successful for the following reason: " + status);
		    }
	    });
	}

	function changeMapLocation(e) {
		if (mapRenderers.length) {
			[].forEach.call(mapRenderers, function(renderer) {
				renderer.setMap(null);
			});
		}
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
	//locationControl.addEventListener('change', changeMapLocation, false);

	[].forEach.call(addressFields, function(field) {
		field.addEventListener('blur', geoCodeAddress, false);
	});

	//addressField.addEventListener('blur', geoCodeAddress, false);

	// catch route change
	// [].forEach.call(mapRenderers, function(renderer) {
	// 	google.maps.event.addListener(renderer, 'routeindex_changed', function() {
	// 		console.log(renderer, getRouteIndex());
	// 	});
	// });
})();