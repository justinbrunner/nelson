// JavaScript Document
(function() {
	"use strict";
	var sw = document.querySelector(".shadow");
	
	function gwh() {
		var vh = window.innerHeight;
		var sw.style.height = vh+"px";	
	}
	
	window.addEventListener("load", gwh, false); 
})();