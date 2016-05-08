(function() {
	"use strict";

	var map = new google.maps.Map(document.querySelector('#map_canvas')),
		mapParent = document.querySelector('.flex-video'),
		mq = window.matchMedia( "(min-width: 800px)" ), 
		mb = document.querySelector("#mb"), 
		dt = document.querySelector("#dt");

	mq.addListener(moveMap);
	moveMap(mq);

	function moveMap(mq) {
		if (mq.matches) {
			console.log("dt");
			dt.appendChild(mapParent);
		} else {
			console.log("mb");
			mb.appendChild(mapParent);
		}
	}	

	var directionsService = new google.maps.DirectionsService,
		distanceMatrix = new google.maps.DistanceMatrixService,
		geocoder = new google.maps.Geocoder(),
		marker,
		markers = [],
		routeColors = [],
		routeDistances = [],
		lineWeight = 5,
		addressFields = document.querySelectorAll('.address-control'),
		quarrySelected = false,
		deliveryAddress = false,
		quarryLocation,
		deliveryLocation,
		cusIconStart = "images/pickup.png",
		cusIconEnd = "images/unload.png",
		mapRenderers = [],
		routeSelect = document.querySelector('.select-route'),
		controlsBlocker = document.querySelector('.block-ui');

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
			icon: cusIconStart
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
		//clearMarkers(null);
		markers[0].setMap(null);

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

		        if (entryPoint == "quarry_address") {
		        	quarrySelected = true;
		        	quarryLocation = results[0].geometry.location;
		        	var marker = new google.maps.Marker({
		        		map: map,
		        		position: results[0].geometry.location,
		        		icon: cusIconStart
		        	});
		        } else {
		        	deliveryAddress = true;
		        	deliveryLocation = results[0].geometry.location;
		        	var marker = new google.maps.Marker({
		        		map: map,
		        		position: results[0].geometry.location,
		        		icon: cusIconEnd
		        	});
		        }

		        map.setCenter(results[0].geometry.location);		

				if (quarrySelected && deliveryAddress) { 
					var start = quarryLocation,
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
							 	// generate random map colour
							 	routeColors.push("#" + Math.random().toString(16).slice(2, 8));

				                var renderer = new google.maps.DirectionsRenderer({
				                    map: map,
				                    directions: result,
				                    routeIndex: i,
				                    suppressMarkers: true,
				                    polylineOptions : {
				                    	strokeColor: "rgba(150,150,150,0.75)",
				                    	strokeWeight: lineWeight
				                    }
				                });
				                
				                mapRenderers.push(renderer);
							}

							mapRenderers[0].setMap(null);

							mapRenderers[0].setOptions({
				                polylineOptions : {
				                	strokeColor : "rgba(9,90,230,1)",
				                	zIndex : 1,
				                	strokeWeight: lineWeight
				                }
				            });

				            mapRenderers[0].setMap(map);

				            for (var r = 0, rLength = result.routes.length; r < rLength; r++) {
				            	routeDistances.push(result.routes[r].legs[0].distance.text);
				            }

				            mySalesInfo.newTime = parseFloat(routeDistances[0]);
				            createControls();
						}
					});
				}

			} else {
		    	// handle this error somehow => with a Foundation custom element perhaps?
		    	console.log("Geocode was not successful for the following reason: " + status);
		    }
	    });
	}

	function setRoute(e) {
		var newRouteIndex = e.currentTarget.dataset.newindex;

		$('.route-select').removeClass('active-route');
		e.currentTarget.classList.add('active-route');

		for (var i=0, len = mapRenderers.length; i<len; i++) {
			mapRenderers[i].setMap(null);

			// reset all the route colors
			mapRenderers[i].setOptions({
	            polylineOptions : {
	            	strokeColor: "rgba(150,150,150,0.75)",
	            	zIndex : 0,
	            	strokeWeight: lineWeight
	            }
	        });

	        mapRenderers[i].setMap(map);
		}
		
		// set the active route color
		mapRenderers[newRouteIndex].setMap(null);		

        mapRenderers[newRouteIndex].setOptions({
            polylineOptions : {
            	strokeColor : "rgba(9,90,230,1)",
            	zIndex : 1,
            	strokeWeight: lineWeight
            }
        });

        mapRenderers[newRouteIndex].setMap(map);
        mySalesInfo.newTime = parseFloat(routeDistances[newRouteIndex]);
	}

	function createControls() {
		var controlsContainer = document.querySelector('.route-wrapper');

		[].forEach.call(mapRenderers, function(button, index) {
			var routeControl = document.createElement('li'),
				routeControlText = document.createTextNode('Route ' + (index + 1)),
				colorLozenge = document.createElement('button');

			colorLozenge.classList.add('button', 'right', 'radius', 'route-select');
			colorLozenge.dataset.newindex = index;
			colorLozenge.innerHTML = routeDistances[index];
			colorLozenge.addEventListener('click', setRoute, false);

			routeControl.appendChild(routeControlText);
			routeControl.appendChild(colorLozenge);
			routeControl.classList.add('clearfix');
			controlsContainer.appendChild(routeControl);
		});

		routeSelect.style.visibility = "visible";
		document.querySelectorAll('.route-select')[0].classList.add('active-route');
		controlsContainer.parentNode.classList.remove('collapse-route-select');
		controlsBlocker.classList.add('show-ui');
	}

	controlsBlocker.addEventListener('transitionend', function() { controlsBlocker.style.display = "none"; }, false);

	
	[].forEach.call(addressFields, function(field) {
		field.addEventListener('blur', geoCodeAddress, false);
	});

	google.maps.event.addDomListener(window, "resize", function() {
	    var center = map.getCenter();
	    google.maps.event.trigger(map, "resize");
	    map.setCenter(center); 
	});

})();