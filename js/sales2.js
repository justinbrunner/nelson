// JavaScript Document
var mySalesInfo = (function() {
	"use strict";
	
	var priceTri = document.querySelector("#price_tri"),
		priceTra = document.querySelector("#price_tra"),
		priceSli = document.querySelector("#price_sli"),
		
		loadTri = document.querySelector("#load_tri"),
		dumpTri = document.querySelector("#dump_tri"),
		loadTra = document.querySelector("#load_tra"),
		dumpTra = document.querySelector("#dump_tra"),
		loadSli = document.querySelector("#load_sli"),
		dumpSli = document.querySelector("#dump_sli"),
		
		avgTri = document.querySelector("#avg_tri"),
		avgTra = document.querySelector("#avg_tra"),
		avgSli = document.querySelector("#avg_sli"),
		
		triTotal = document.querySelector("#triTotal"),
		traTotal = document.querySelector("#traTotal"),
		sliTotal = document.querySelector("#sliTotal"),
		
		googleTimeTri = document.querySelector("#googleTimeTri"),
		googleTimeTra = document.querySelector("#googleTimeTra"),
		googleTimeSli = document.querySelector("#googleTimeSli"),
		
		googleTriInc = document.querySelector("#googleTimeTriInc"),
		googleTraInc = document.querySelector("#googleTimeTraInc"),
		googleSliInc = document.querySelector("#googleTimeSliInc"),
		
		tcTime_tri = document.querySelector("#tcTime_tri"),
		tcTime_tra = document.querySelector("#tcTime_tra"),
		tcTime_sli = document.querySelector("#tcTime_sli"),
		
		trips_tri_val = document.querySelector("#trips_tri"),
		tripsRounded_tri_val = document.querySelector("#tripsRounded_tri"),
		trips_tra_val = document.querySelector("#trips_tra"),
		tripsRounded_tra_val = document.querySelector("#tripsRounded_tra"),
		trips_sli_val = document.querySelector("#trips_sli"),
		tripsRounded_sli_val = document.querySelector("#tripsRounded_sli"),
		
		dc_pl_tri = document.querySelector("#dc_pl_tri"),
		dc_pl_tra = document.querySelector("#dc_pl_tra"),
		dc_pl_sli = document.querySelector("#dc_pl_sli"),
		
		dt_pl_tri = document.querySelector("#dt_pl_tri"),
		dt_pl_tra = document.querySelector("#dt_pl_tra"),
		dt_pl_sli = document.querySelector("#dt_pl_sli"),
		
		tri_rate_low  = document.querySelector("#tri_rate_low"),
		tri_rate_high  = document.querySelector("#tri_rate_high"),
		tra_rate_low  = document.querySelector("#tra_rate_low"),
		tra_rate_high  = document.querySelector("#tra_rate_high"),
		sli_rate_low  = document.querySelector("#sli_rate_low"),
		sli_rate_high  = document.querySelector("#sli_rate_high"),
		truckType;
	
	// Tri-Axle
	var triAxlePrice = 100; //B3
	var loadTime_ta = 10; //B4
	var dumpTime_ta = 10; //B5
	var total_tri_load_dump = 0; //B6
	var avgWeight_tri = 22; //B8
	
	// Trailer
	var trailerPrice = 135; //C3
	var loadTime_tr = 10; //C4
	var dumpTime_tr = 10; //C5
	var total_trailer_load_dump = 0; //C6
	var avgWeight_tra = 38; //C8
	
	//Slinger
	var slingerPrice = 130; //C3
	var loadTime_sli = 10; //C4
	var dumpTime_sli = 30; //C5
	var total_slinger_load_dump = 0; //C6
	var avgWeight_sli = 21.5; //C8
	
	var roundTrip_tri; // = travelTime * 2; // B10
	var roundTrip_tra; // = travelTime * 2; // C10
	var roundTrip_sli;
	var perIncrease_tri; // = (roundTrip_tri * 1.10).toFixed(1); // B11
	var perIncrease_tra; // = (roundTrip_tra * 1.10).toFixed(1); // C11
	var perIncrease_sli;

	function calcTimeValues(travelTime) {
		console.log(travelTime);
		travelTime = Math.ceil(travelTime/60);
		roundTrip_tri = travelTime * 2; // B10
		roundTrip_tra = travelTime * 2; // C10
		roundTrip_sli = travelTime * 2; // C10
		perIncrease_tri = (roundTrip_tri * 1.10).toFixed(1); // B11
		perIncrease_tra = (roundTrip_tra * 1.10).toFixed(1); // C11
		perIncrease_sli = (roundTrip_sli * 1.10).toFixed(1); // C11
		//if (truckType) { buildTime(truckType); }
		buildTime("tri");
		buildTime("tra");
		buildTime("sli");
	}
	
	// Total Time
	var totalCycleTime_tri; //B12
	var totalCycleTime_tra; //C12
	var totalCycleTime_sli;
	
	//Trips per 10 hour day //B&C 13
	var workingDay = 660;
	var workingHours;
	var trips_tri;
	var trips_tra;
	var trips_sli;
	//Rounded trip values B&C 14
	var trips_tri_rounded;
	var trips_tra_rounded;
	var trips_sli_rounded;
	
	//Tri-Axle LOW
	var rate_tri_low; //B17
	var ratePerLoad_tri_low; //B15
	var total_for_day_tri_low; //B16
	
	//Tri-Axle HIGH
	var rate_tri_high; //B18
	var ratePerLoad_tri_high;
	var total_for_day_tri_high;
	
	//Trailer Low
	var rate_tra_low; //C17
	var ratePerLoad_tra_low; //C15
	var total_for_day_tra_low; //C16
	
	//Trailer High
	var rate_tra_high; //C18
	var ratePerLoad_tra_high;
	var total_for_day_tra_high;
	
	//Slinger Low
	var rate_sli_low; //C17
	var ratePerLoad_sli_low; //C15
	var total_for_day_sli_low; //C16
	
	//Slinger High
	var rate_sli_high; //C18
	var ratePerLoad_sli_high;
	var total_for_day_sli_high;
	
	//Functions
	function selectOption(evt) {
		var target = evt.target.id;
		var selectValue = evt.currentTarget.value;
		
		switch(target) {
			
			case "price_tri":
				triAxlePrice = selectValue;
				console.log("Tri-axle: "+triAxlePrice);
				break;
			case "price_tra":
				trailerPrice = selectValue;
				console.log("Trailer: "+trailerPrice);
				break;
			case "price_sli":
				slingerPrice = selectValue;
				console.log("Slinger: "+slingerPrice);
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
			case "load_sli":
				loadTime_sli = selectValue;
				console.log("Load Slinger: "+loadTime_sli);
				break;
			case "dump_sli":
				dumpTime_sli = selectValue;
				console.log("Dump Slinger: "+dumpTime_sli);
				break;
			case "avg_tri":
				avgWeight_tri = parseInt(selectValue, 10);
				console.log("Average Tri-axle Weight: "+avgWeight_tri);
				break;
			case "avg_tra":
				avgWeight_tra = selectValue;
				console.log("Average Trailer Weight: "+avgWeight_tra);
				break;
			case "avg_sli":
				avgWeight_sli = selectValue;
				console.log("Average Slinger Weight: "+avgWeight_sli);
				break;
		}
		
		//TIME
		if(loadTime_ta > 0 && dumpTime_ta > 0) { buildTime("tri"); truckType = "tri"; }
		if(loadTime_tr > 0 && dumpTime_tr > 0) { buildTime("tra"); truckType = "tra"; }
		if(loadTime_sli > 0 && dumpTime_sli > 0) { buildTime("sli"); truckType = "sli"; }
	}
	
	function buildTime(truckType) {
		workingHours = workingDay/60;
		console.log(workingHours);
		if(truckType === "tri") {
			total_tri_load_dump = parseInt(loadTime_ta)+parseInt(dumpTime_ta);
			triTotal.innerHTML = "Total Load/Unload Time: "+total_tri_load_dump;
			totalCycleTime_tri = parseFloat(total_tri_load_dump) + parseFloat(perIncrease_tri); //B12
			console.log(totalCycleTime_tri);
			trips_tri = (workingDay/totalCycleTime_tri).toFixed(2);
			trips_tri_val.innerHTML = trips_tri;
			//Rounded trip values B&C 14
			trips_tri_rounded = Math.floor(workingDay/totalCycleTime_tri).toFixed(0);
			tripsRounded_tri_val.innerHTML = trips_tri_rounded;
			//console.log("Load/Dump - Tri-axle: "+total_tri_load_dump);
			tcTime_tri.innerHTML = totalCycleTime_tri;
			//Round Trip
			googleTimeTri.innerHTML = roundTrip_tri;
			googleTriInc.innerHTML = perIncrease_tri;

			if(avgWeight_tri !== 0) {
				//LOW
				rate_tri_low = (totalCycleTime_tri * triAxlePrice/60/avgWeight_tri).toFixed(2);
				ratePerLoad_tri_low = (rate_tri_low * avgWeight_tri).toFixed(2);
				total_for_day_tri_low = (ratePerLoad_tri_low * trips_tri).toFixed(2);
				dc_pl_tri.innerHTML = "$"+ratePerLoad_tri_low;
				dt_pl_tri.innerHTML = "$"+total_for_day_tri_low;
				tri_rate_low.innerHTML = "$"+rate_tri_low;

				//HIGH
				rate_tri_high = (triAxlePrice*workingHours/avgWeight_tri/trips_tri_rounded).toFixed(2); //B18
				ratePerLoad_tri_high = (rate_tri_high * avgWeight_tri).toFixed(2);
				total_for_day_tri_high = (ratePerLoad_tri_high * trips_tri).toFixed(2);
				tri_rate_high.innerHTML = "$"+rate_tri_high;
			}
		}else if(truckType === "tra"){
			total_trailer_load_dump = parseInt(loadTime_tr, 10)+parseInt(dumpTime_tr, 10);
			traTotal.innerHTML = "Total Load/Unload Time: "+total_trailer_load_dump;
			totalCycleTime_tra = parseFloat(total_trailer_load_dump) + parseFloat(perIncrease_tra);
			console.log(totalCycleTime_tra);
			trips_tra = (workingDay/totalCycleTime_tra).toFixed(2);
			trips_tra_val.innerHTML = trips_tra;
			//Rounded trip values B&C 14
			trips_tra_rounded = Math.floor(workingDay/totalCycleTime_tra).toFixed(1);
			tripsRounded_tra_val.innerHTML = trips_tra_rounded;
			//console.log("Load/Dump - Trailer: "+total_trailer_load_dump);
			tcTime_tra.innerHTML = totalCycleTime_tra;
			googleTimeTra.innerHTML = roundTrip_tra;
			googleTraInc.innerHTML = perIncrease_tra;
			if(avgWeight_tra !== 0) {
				//LOW
				rate_tra_low = (totalCycleTime_tra * trailerPrice/60/avgWeight_tra).toFixed(2);
				ratePerLoad_tra_low = (rate_tra_low * avgWeight_tra).toFixed(2);
				total_for_day_tra_low = (ratePerLoad_tra_low * trips_tra).toFixed(2);
				dc_pl_tra.innerHTML = "$"+ratePerLoad_tra_low;
				dt_pl_tra.innerHTML = "$"+total_for_day_tra_low;
				tra_rate_low.innerHTML = "$"+rate_tra_low;
				//HIGH
				rate_tra_high = (trailerPrice*workingHours/avgWeight_tra/trips_tra_rounded).toFixed(2); //C18
				ratePerLoad_tra_high = (rate_tra_high * avgWeight_tra).toFixed(2);
				total_for_day_tra_high = (ratePerLoad_tra_high * trips_tra).toFixed(2);
				tra_rate_high.innerHTML = "$"+rate_tra_high;
			}
		}else{
			total_slinger_load_dump = parseInt(loadTime_sli, 10)+parseInt(dumpTime_sli, 10);
			sliTotal.innerHTML = "Total Load/Unload Time: "+total_slinger_load_dump;
			totalCycleTime_sli = parseFloat(total_slinger_load_dump) + parseFloat(perIncrease_sli);
			console.log(totalCycleTime_sli);
			trips_sli = (workingDay/totalCycleTime_sli).toFixed(2);
			trips_sli_val.innerHTML = trips_sli;
			//Rounded trip values B&C 14
			trips_sli_rounded = Math.floor(workingDay/totalCycleTime_sli).toFixed(1);
			tripsRounded_sli_val.innerHTML = trips_sli_rounded;
			//console.log("Load/Dump - Trailer: "+total_trailer_load_dump);
			tcTime_sli.innerHTML = totalCycleTime_sli;
			googleTimeSli.innerHTML = roundTrip_sli;
			googleSliInc.innerHTML = perIncrease_sli;
			if(avgWeight_sli !== 0) {
				//LOW
				rate_sli_low = (totalCycleTime_sli * slingerPrice/60/avgWeight_sli).toFixed(2);
				ratePerLoad_sli_low = (rate_sli_low * avgWeight_sli).toFixed(2);
				total_for_day_sli_low = (ratePerLoad_sli_low * trips_sli).toFixed(2);
				dc_pl_sli.innerHTML = "$"+ratePerLoad_sli_low;
				dt_pl_sli.innerHTML = "$"+total_for_day_sli_low;
				sli_rate_low.innerHTML = "$"+rate_sli_low;
				//HIGH
				rate_sli_high = (slingerPrice*workingHours/avgWeight_sli/trips_sli_rounded).toFixed(2); //C18
				ratePerLoad_sli_high = (rate_sli_high * avgWeight_sli).toFixed(2);
				total_for_day_sli_high = (ratePerLoad_sli_high * trips_sli).toFixed(2);
				sli_rate_high.innerHTML = "$"+rate_sli_high;
			}
		}
	}

	$('select').on('change', selectOption);

	$('.accordion-title').on('click', function() {
        if ($(this).hasClass('triAxleRates')) {
            truckType = "tri";
        } else if ($(this).hasClass('trailerRates')) {
            truckType = "tra";
        } else if ($(this).hasClass('slingerRates')) {
            truckType = "sli";
        }
		buildTime(truckType);
    });

	function setTime(newTime) {
		calcTimeValues(newTime);
	}

	function setWorkingHours(newHours) {
		workingDay = newHours;
		if (truckType) { buildTime(truckType); }
	}

	function setTruckType(newType) {
		truckType = truckType;
	}

	return {
		setNewTime : setTime,
		newWorkingHours : setWorkingHours,
		setTruckType : setTruckType
	};
})();
