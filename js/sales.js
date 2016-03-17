// JavaScript Document
(function() {
	"use strict";
	
	var priceTri = document.querySelector("#price_tri"), priceTra = document.querySelector("#price_tra"), loadTri = document.querySelector("#load_tri"), dumpTri = document.querySelector("#dump_tri"), loadTra = document.querySelector("#load_tra"), dumpTra = document.querySelector("#dump_tra"), avgTri = document.querySelector("#avg_tri"), avgTra = document.querySelector("#avg_tra"), triTotal = document.querySelector("#triTotal"), traTotal = document.querySelector("#traTotal"), google1way = document.querySelector("#googleOneWay");
	
	
	
	// Tri-Axle
	var triAxlePrice = 0; //B3
	var loadTime_ta = 0; //B4
	var dumpTime_ta = 0; //B5
	var Total_tri_load_dump = 0; //B6
	var avgWeight_tri = 0; //B8
	
	// Trailer
	var trailerPrice = 0; //C3
	var loadTime_tr = 0; //C4
	var dumpTime_tr = 0; //C5
	var Total_trailer_load_dump = 0; //C6
	var avgWeight_tra = 0; //C8
	
	// Trip Time
	var travelTime =  14; //B7 -- COMES FROM MAPS API
	var roundTrip_tri = travelTime * 2; // B10
	var roundTrip_tra = travelTime * 2; // C10
	var perIncrease_tri = (roundTrip_tri * 1.10).toFixed(1); // B11
	var perIncrease_tra = (roundTrip_tra * 1.10).toFixed(1); // C11
	
	// Total Time
	var totalCycleTime_tri = parseFloat(Total_tri_load_dump) + parseFloat(perIncrease_tri); //B12
	var totalCycleTime_tra = parseFloat(Total_trailer_load_dump) + parseFloat(perIncrease_tra); //C12
	//console.log(totalCycleTime_tri);
	//console.log(totalCycleTime_tra);
	
	//Trips per 10 hour day //B&C 13
	var trips_tri = (600/totalCycleTime_tri).toFixed(2);
	var trips_tra = (600/totalCycleTime_tra).toFixed(2);
	//Rounded trip values B&C 14
	var trips_tri_rounded = Math.floor(600/totalCycleTime_tri).toFixed(1); 
	var trips_tra_rounded = Math.floor(600/totalCycleTime_tra).toFixed(1);
	
	//Tri-Axle LOW
	var rate_tri_low = (totalCycleTime_tri * triAxlePrice/60/avgWeight_tri).toFixed(1); //B17
	var ratePerLoad_tri_low = (rate_tri_low * avgWeight_tri).toFixed(2); //B15
	var total_for_day_tri_low = (ratePerLoad_tri_low * trips_tri).toFixed(2); //B16
	
	//Tri-Axle HIGH
	var rate_tri_high = (triAxlePrice*10/avgWeight_tri/trips_tri_rounded).toFixed(2); //B18
	var ratePerLoad_tri_high = (rate_tri_high * avgWeight_tri).toFixed(2); 
	var total_for_day_tri_high = (ratePerLoad_tri_high * trips_tri).toFixed(2);
	
	//Trailer Low
	var rate_tra_low = (totalCycleTime_tra * trailerPrice/60/avgWeight_tra).toFixed(1); //C17
	var ratePerLoad_tra_low = (rate_tra_low * avgWeight_tra).toFixed(2); //C15
	var total_for_day_tra_low = (ratePerLoad_tra_low * trips_tra).toFixed(2); //C16
	
	//Trailer Low
	var rate_tra_high = (trailerPrice*10/avgWeight_tra/trips_tra_rounded).toFixed(2); //C18
	var ratePerLoad_tra_high = (rate_tra_high * avgWeight_tra).toFixed(2); 
	var total_for_day_tra_high = (ratePerLoad_tra_high * trips_tra).toFixed(2);
	
	function selectOption(evt) {
		var target = evt.target.id;
		var selectValue = this.value;
		
		switch(target) {
			case "price_tri":
				triAxlePrice = selectValue;
				console.log("Tri-axle: "+triAxlePrice);
				break;
			case "price_tra":
				trailerPrice = selectValue;
				console.log("Trailer: "+trailerPrice);
				break;
			case "load_tri":
				loadTime_ta = selectValue;
				console.log("Load Tri-axle: "+loadTime_ta);
				break;
			case "dump_tri":
				dumpTime_ta = selectValue;
				console.log("Dump Tri-axle: "+dumpTime_ta);
				break;
			case "load_tra":
				loadTime_tr = selectValue;
				console.log("Load Trailer: "+loadTime_tr);
				break;
			case "dump_tra":
				dumpTime_tr = selectValue;
				console.log("Dump Trailer: "+dumpTime_tr);
				break;
			case "avg_tri":
				avgWeight_tri = selectValue;
				console.log("Average Tri-axle Weight: "+avgWeight_tri);
				break;
			case "avg_tra":
				avgWeight_tra = selectValue;
				console.log("Average Trailer Weight: "+avgWeight_tra);
				break;
		}
		
		if(loadTime_ta > 0 && dumpTime_ta > 0) {
			Total_tri_load_dump = parseInt(loadTime_ta)+parseInt(dumpTime_ta);
			triTotal.innerHTML = "Total Load and Unload Time: "+Total_tri_load_dump;
			console.log("Load/Dump - Tri-axle: "+Total_tri_load_dump);
		}
		
		if(loadTime_tr > 0 && dumpTime_tr > 0) {
			Total_trailer_load_dump = parseInt(loadTime_tr)+parseInt(dumpTime_tr);
			traTotal.innerHTML = "Total Load and Unload Time: "+Total_trailer_load_dump;
			console.log("Load/Dump - Trailer: "+Total_trailer_load_dump);
		}
	}
	
	priceTri.addEventListener("change", selectOption, false);
	priceTra.addEventListener("change", selectOption, false);
	loadTri.addEventListener("change", selectOption, false);
	dumpTri.addEventListener("change", selectOption, false);
	loadTra.addEventListener("change", selectOption, false);
	dumpTra.addEventListener("change", selectOption, false);
	avgTri.addEventListener("change", selectOption, false);
	avgTra.addEventListener("change", selectOption, false);
	
})();