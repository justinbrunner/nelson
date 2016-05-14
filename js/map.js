(function() {
	"use strict";

	var map = new google.maps.Map(document.querySelector('#map_canvas')),
		mapParent = document.querySelector('.flex-video'),
		mq = window.matchMedia( "(min-width: 800px)" ), 
		mb = document.querySelector("#mb"), 
		dt = document.querySelector("#dt");

	function moveMap(mq) {
		if (mq.matches) {
			dt.appendChild(mapParent);
		} else {
			mb.appendChild(mapParent);
		}
	}

	mq.addListener(moveMap);
	moveMap(mq);	

	var directionsService = new google.maps.DirectionsService,
		geocoder = new google.maps.Geocoder(),
		marker,
		markers = [],
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
		createRouteButton = document.querySelector('.create-route-button'),
		bounds = new google.maps.LatLngBounds(),
		controlsBlocker = document.querySelector('.block-ui');

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

	// drop a new pin
	function dropPin(loc, marker) {
		// put all the markers back on the map
		clearMarkers(map);

		map.setCenter(marker.position);
	}

	function setMapLocation(geoObject) {
		var newLatLng = {
			lat: geoObject.coords.latitude,
			lng: geoObject.coords.longitude
		}

		map.setCenter(newLatLng);
		map.setZoom(12);

		marker = new google.maps.Marker({
			position : newLatLng,
			map : map,
			title : "howdy do!"
			//icon: cusIconStart
		});

		markers.push(marker);

	}

	function geoCodeAddress(e) {
		clearMarkers(null);

		var address = e.currentTarget.value, entryPoint, marker;

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
		        	marker = new google.maps.Marker({
						position : results[0].geometry.location,
						map : map,
						title : "howdy do!",
						icon: cusIconStart
					});

					markers[0] = marker;

		        	dropPin(results[0].geometry.location, marker);
		        } else {
		        	deliveryAddress = true;
		        	deliveryLocation = results[0].geometry.location;

		        	marker = new google.maps.Marker({
						position : results[0].geometry.location,
						map : map,
						title : "howdy do!",
						icon: cusIconEnd
					});

		        	if (!markers[1]) {
		        		markers.push(marker);
		        	} else {
		        		markers[1] = marker;
		        	}					

		        	dropPin(results[0].geometry.location, marker);
		        }

		        if (deliveryAddress && quarryLocation) { $('.create-route-button').removeAttr('disabled'); }	

			} else {
		    	// handle this error somehow => with a Foundation custom element perhaps?
		    	console.log("Geocode was not successful for the following reason: " + status);
		    }
	    });
	}

	function createRoute() {
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

			mapRenderers = [];
			routeDistances = [];

			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {

					console.log(result);

					 for (var i = 0, len = result.routes.length; i < len; i++) {

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
		            	routeDistances.push([result.routes[r].legs[0].distance.text, result.routes[r].legs[0].duration.text, result.routes[r].legs[0].duration.value]);
		            }

		            mySalesInfo.setNewTime(Math.round(result.routes[0].legs[0].duration.value));
		            createControls();
				}
			});
		} else {
			console.log('somethin ain\'t right, yo!')
		}

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
        mySalesInfo.setNewTime(routeDistances[newRouteIndex][2]);//Math.round(result.routes[routeIndex].legs[0].duration.value);
	}

	function createControls() {
		var controlsContainer = document.querySelector('.alt-routes');

		while (controlsContainer.firstChild) {
			controlsContainer.removeChild(controlsContainer.firstChild);
		}

		[].forEach.call(mapRenderers, function(button, index) {
			var routeSelect = document.createElement('button');

			routeSelect.classList.add('button', 'radius', 'route-select');
			routeSelect.dataset.newindex = index;
			routeSelect.innerHTML = routeDistances[index][0] + " / " + routeDistances[index][1];
			routeSelect.addEventListener('click', setRoute, false);

			controlsContainer.appendChild(routeSelect);
		});

		//routeSelect.style.visibility = "visible";
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

	createRouteButton.addEventListener('click', createRoute, false);

	$('.hours-options li').on('click', function() {
		var thisTitle = $(this).parents('.accordion-item').find('.accordion-title');

		setTimeout(function() {
			thisTitle.trigger('click');
		}, 350);

		thisTitle.find('span').text('( ' + $(this).text().split(' ')[0] + ' hrs )');

		mySalesInfo.newWorkingHours($(this).data('hours'));		
	});
})();