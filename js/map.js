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
        markers = [],
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

            marker = new google.maps.Marker({
                position: place.geometry.location,
                title: "Quarry Location",
                icon: cusIconStart
            });

            if (markers[0] && markers[0].setMap) {
                markers[0].setMap(null);
            }

            markers[0] = marker;
            dropPin(marker);
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

            marker = new google.maps.Marker({
                position: place.geometry.location,
                title: "Delivery Location",
                icon: cusIconEnd
            });

            if (markers[1] && markers[1].setMap) {
                markers[1].setMap(null);
            }

            markers[1] = marker;
            dropPin(marker);
        }

        if (quarrySelected && deliveryAddress) {
            createRoute();
        }
    });

    function logFailed(error) {
        console.log('geoloation not available: ' + error.message);
    }

    function dropPin(marker) {
        marker.setMap(map);
        map.setCenter(marker.position);
    }

    function setMapLocation(geoObject) {
        var newLatLng = {
            //lat: geoObject.coords.latitude,
            //lng: geoObject.coords.longitude
            
            // set new defaults b/c geolocation may not work on all devices (SW ON)
            lat: 43.459548,
            lng: -80.738432
        };

        map.setCenter(newLatLng);
        map.setZoom(6);
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
                bounds = result.routes[0].bounds;
                map.fitBounds(bounds);
                //map.setZoom(15);

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
    }

    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
        map.fitBounds(bounds);
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