// JavaScript Document
(function() {
	"use strict";
	
	var tri_layout = document.querySelector("#tri"), trailer_layout = document.querySelector("#trailer"), useTri = document.querySelector("#useTri"), useTra = document.querySelector("#useTra");
	
	function showHide(evt) {
		var target = evt.currentTarget.id;
		//console.log(target);
		if(target === "useTri") {
			tri_layout.classList.toggle("hide");
			if(tri_layout.classList.length === 1) {
				useTri.innerHTML = "Open Tri-Axle";
			}else{
				useTri.innerHTML = "Close Tri-Axle";
			}
		}else{
			trailer_layout.classList.toggle("hide");
			if(trailer_layout.classList.length === 1) {
				useTra.innerHTML = "Open Trailer";
			}else{
				useTra.innerHTML = "Close Trailer";
			}
		}
	}
	
	useTri.addEventListener("click", showHide, false);
	useTra.addEventListener("click", showHide, false);
})();