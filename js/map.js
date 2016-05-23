(function() {
    "use strict";

    var map = new google.maps.Map(document.querySelector('#map_canvas')),
        mapParent = document.querySelector('.flex-video'),
        mq = window.matchMedia("(min-width: 800px)"),
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

    var directionsService = new google.maps.DirectionsService(),
        marker,
        markers = ['foo', 'bar'],
        routeDistances = [],
        lineWeight = 3,
        autoCompleteOptions = { componentRestrictions : { country: 'ca' } },
        deliveryAutoComplete = new google.maps.places.Autocomplete(document.querySelector('.delivery-input'), autoCompleteOptions),
        quarryAutoComplete = new google.maps.places.Autocomplete(document.querySelector('.quarry-input'), autoCompleteOptions),
        quarrySelected = false,
        deliveryAddress = false,
        quarryLocation,
        deliveryLocation,
        cusIconStart = "images/pickup.png",
        cusIconEnd = "images/unload.png",
        mapRenderers = [],
        routeSelect = document.querySelector('.select-route'),
        bounds = new google.maps.LatLngBounds();

    // find coordinates, pass them to the map API and set the map's center
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setMapLocation, logFailed);
    }

    quarryAutoComplete.addListener('place_changed', function() {
        var place = quarryAutoComplete.getPlace();

        if (!place.geometry) {
            console.log('this ain\'t no place!');
        } else {
            quarrySelected = true;
            quarryLocation = place.geometry.location;

            var loc1 = new google.maps.LatLng(quarryLocation.lat(), quarryLocation.lng());

            bounds.extend(loc1);

            marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: "Quarry Location",
                icon: cusIconStart
            });

            markers[0] = marker;
            clearMarkers(null);
            dropPin(null, marker);
        }
        if (quarrySelected && deliveryAddress) {
            createRoute();
        }
    });

    deliveryAutoComplete.addListener('place_changed', function() {
        var place = deliveryAutoComplete.getPlace();

        if (!place.geometry) {
            console.log('this ain\'t no place!');
        } else {
            deliveryAddress = true;
            deliveryLocation = place.geometry.location;

            var loc2 = new google.maps.LatLng(deliveryLocation.lat(), deliveryLocation.lng());

            bounds.extend(loc2);

            marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: "Delivery Location",
                icon: cusIconEnd
            });

            markers[1] = marker;
            clearMarkers(null);
            dropPin(null, marker);
        }
        if (quarrySelected && deliveryAddress) {
            createRoute();
        }
    });

    function logFailed(error) {
        console.log('geoloation not available: ' + error.message);
    }

    // delete and replace markers from map
    function clearMarkers(map) {
        for (var i = 0; i < markers.length; i++) {
            try {
                markers[i].setMap(map);
            } catch(e) {
                console.log(e.message);
            }
        }
    }

    function dropPin(loc, marker) {
        clearMarkers(map);
        map.setCenter(marker.position);
    }

    function setMapLocation(geoObject) {
        var newLatLng = {
            lat: geoObject.coords.latitude,
            lng: geoObject.coords.longitude
        };

        map.setCenter(newLatLng);
        map.setZoom(12);
    }

    function createRoute() {
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
                        polylineOptions: {
                            strokeColor: "rgba(150,150,150,0.75)",
                            strokeWeight: lineWeight
                        }
                    });

                    mapRenderers.push(renderer);
                }

                mapRenderers[0].setMap(null);

                mapRenderers[0].setOptions({
                    polylineOptions: {
                        strokeColor: "rgba(9,90,230,1)",
                        zIndex: 1,
                        strokeWeight: lineWeight
                    }
                });

                mapRenderers[0].setMap(map);
                map.fitBounds(bounds);

                for (var r = 0, rLength = result.routes.length; r < rLength; r++) {
                    routeDistances.push([result.routes[r].legs[0].distance.text, result.routes[r].legs[0].duration.text, result.routes[r].legs[0].duration.value]);
                }

                mySalesInfo.setNewTime(Math.round(result.routes[0].legs[0].duration.value));
                createControls();
                $('.hide').removeClass('hide');
            } else {
                console.log('directions service failed');
            }
        });
    }

    function setRoute(e) {
        var newRouteIndex = e.currentTarget.dataset.newindex;

        $('.route-select').removeClass('active-route');
        e.currentTarget.classList.add('active-route');

        for (var i = 0, len = mapRenderers.length; i < len; i++) {
            mapRenderers[i].setMap(null);

            // reset all the route colors
            mapRenderers[i].setOptions({
                polylineOptions: {
                    strokeColor: "rgba(150,150,150,0.75)",
                    zIndex: 0,
                    strokeWeight: lineWeight
                }
            });

            mapRenderers[i].setMap(map);
        }

        // set the active route color
        mapRenderers[newRouteIndex].setMap(null);

        mapRenderers[newRouteIndex].setOptions({
            polylineOptions: {
                strokeColor: "rgba(9,90,230,1)",
                zIndex: 1,
                strokeWeight: lineWeight
            }
        });

        mapRenderers[newRouteIndex].setMap(map);
        mySalesInfo.setNewTime(routeDistances[newRouteIndex][2]);
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

        document.querySelectorAll('.route-select')[0].classList.add('active-route');
        //$('.select-route-accordion').find('.accordion-title').trigger('click');
    }

    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    $('.hours-options li').on('click', function() {
        var thisTitle = $(this).parents('.accordion-item').find('.accordion-title');

        setTimeout(function() {
            thisTitle.trigger('click');
        }, 350);

        thisTitle.find('span').text('( ' + $(this).text().split(' ')[0] + ' hrs )');

        mySalesInfo.newWorkingHours($(this).data('hours'));
    });
})();