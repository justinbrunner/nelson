// JavaScript Document
(function() {
	"use strict";
	var sw = document.querySelector(".shadow"), map = document.querySelector("#map_canvas");
	
	function gwh() {
		var vh = window.innerHeight;
		sw.style.height = vh+"px";
		map.style.height = (vh-102)+"px";	
	}
	
	window.addEventListener("load", gwh, false); 
})();