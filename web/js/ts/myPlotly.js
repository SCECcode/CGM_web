/***
  myPlotly.js
***/

// MAIN

jQuery(document).ready(function() {

  window.top.postMessage({'call':'fromTSviewer', value:'start loading'}, '*');
  let frameHeight=window.innerHeight;
  let frameWidth=window.innerWidth;

//  let myURL="./result/insar_61347a51be8ba_D071_velocity_list.csv";
//  let myParams={dtype:"VS",gid:"insar_61347a51be8ba",track:"D071"};
//  load_INSAR_ProcessVSFromCSV([myURL],myParams);
//  return;

  [urls, ptype, ftypes]=getParams("");

  if(ptype == "gnss") {
    load_GNSS_ProcessTSFromPOS(urls,ftypes);
    } else {
      params=ftypes[0]; // { "dtype":"TS", "track": tType, "gid":gid };    
      if(params['dtype'] == "TS" ) {
        load_INSAR_ProcessTSFromCSV(urls,params);
        } else {
          load_INSAR_ProcessVSFromCSV(urls,params);
      }
  }

}) // end of MAIN


window.addEventListener("DOMContentLoaded", function () {
  window.console.log("IFRAME side >>: starting up");

  window.top.postMessage({'call':'fromTSviewer', value:'start loading'}, '*');
  window.top.postMessage({'call':'viewTSviewer', value:'ready'}, '*');

  window.addEventListener('message', function(event) {
      window.console.log("IFRAME side>> received a message..");
      var origin = event.origin;
      if (origin != "http://localhost:8081" 
	         && origin != "http://moho.scec.org"
	         && origin != "https://moho.scec.org"
	         && origin != "https://central.scec.org"
	         && origin != "https://stress.scec.org"
	         && origin != "https://www.scec.org" ) {
          window.console.log("IFRAME side>> bad message origin>"+origin);
          return;
      }
// replot command
      if (typeof event.data == 'object' && event.data.call=='fromSCEC') {

          if(event.data.value == "clearAll") {
            clearPlotlyview();
window.console.log("HERE..");
            return;
          }
          // default is a initial one with url/params..
          let myParams=decodeURI(event.data.value);
          window.console.log("replot: myParams"+myParams);
          changePlotlyview(myParams);

          } else {
            window.console.log("IFRAME side>> invalid event data>"+event.data);
      }
  },false);
},false);

