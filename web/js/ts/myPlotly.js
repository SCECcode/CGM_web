/***
  myPlotly.js
***/

// MAIN

jQuery(document).ready(function() {

  window.top.postMessage({'call':'fromTSviewer', value:'start loading'}, '*');
  let frameHeight=window.innerHeight;
  let frameWidth=window.innerWidth;

  [urls, ftypes]=getParams("");

//  let myURL=['cgm_data/ANA1.cgm.wmrss_igb14.pos'];
//  let myFtypes=[ 'igb14' ];
//  loadAndProcessFromFile(myURL, myFtypes);

  loadAndProcessFromFile(urls,ftypes);

}) // end of MAIN


window.addEventListener("DOMContentLoaded", function () {
  window.console.log("IFRAME side >>: starting up");

  window.top.postMessage({'call':'fromTSviewer', value:'start loading'}, '*');
  window.top.postMessage({'call':'viewTSviewer', value:'ready'}, '*');

  window.addEventListener('message', function(event) {
      window.console.log("IFRAME side>> received a message..");
      var origin = event.origin;
      if (origin != "http://localhost:8081" && origin != "http://moho.scec.org" &&
                                  origin != "https://www.scec.org" ) {
          window.console.log("IFRAME side>> bad message origin>"+origin);
          return;
      }
// replot command
      if (typeof event.data == 'object' && event.data.call=='fromSCEC') {
          let myParams=decodeURI(event.data.value);
          window.console.log("replot: myParams"+myParams);
          changeTSview(myParams);
          } else {
            window.console.log("IFRAME side>> invalid event data>"+event.data);
      }
  },false);
},false);

