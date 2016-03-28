// JavaScript Document
(function(){
	
	var map;
	var cusIcon = "images/custom.png";
	
	function locFound(e) {
		var lat  = e.coords.latitude;
    	var long = e.coords.longitude;
		console.log(lat+" and "+long);
		initMap(lat, long)
	}
	
	function error() {
    	console.log("Where did you go?");
	}
	
	function initMap(lat, long) {			
 		map = new google.maps.Map(document.querySelector("#map_canvas"), {
    	center: {lat: lat, lng: long},
    	zoom: 14,
  		});
		
		var cusMarker = new google.maps.Marker({
    	position: {lat: lat, lng: long},
    	map: map,
    	icon: cusIcon,
		animation: google.maps.Animation.DROP
  		});
	}

	navigator.geolocation.getCurrentPosition(locFound, error);
	
})();