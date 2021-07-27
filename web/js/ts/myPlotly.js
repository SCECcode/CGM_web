/***
  allPlotly.js
***/

// MAIN

jQuery(document).ready(function() {

  let frameHeight=window.innerHeight;
  let frameWidth=window.innerWidth;

  [urls, ftypes]=getParams();


//  let myURL=['cgm_data/ANA1.cgm.wmrss_igb14.pos'];
//  let myFtypes=[ 'igb14' ];
//  loadAndProcessFromFile(myURL, myFtypes);

// station name..
    loadAndProcessFromFile(URL,ftypes);

}) // end of MAIN
