// JavaScript Document
(function() {
	"use strict";
	var sw = document.querySelector(".shadow"), 
		mq = window.matchMedia( "(min-width: 800px)" );
	
	function gwh(mq) {
		var vh = window.innerHeight;

		if (mq.matches) {
		  sw.style.height = vh+"px";
		}else{
			sw.style.height = "100%";
		}
	}

	mq.addListener(gwh);
	gwh(mq);
})();