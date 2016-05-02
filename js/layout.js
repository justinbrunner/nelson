// JavaScript Document
(function() {
	"use strict";
	var sw = document.querySelector(".shadow"), mq = window.matchMedia( "(min-width: 800px)" );
	
	function gwh() {
		var vh = window.innerHeight;
		if (mq.matches) {
		  sw.style.height = vh+"px";
		}else{
			sw.style.height = "100%";
		}
	}
	
	window.addEventListener("load", gwh, false); 
})();