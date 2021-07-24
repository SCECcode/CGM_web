/*****MAIN*****/
jQuery(document).ready(function() {

  let frameHeight=window.innerHeight;
  let frameWidth=window.innerWidth;

  [URL, fname]=getCallingParams();

//window.console.log("in TS..("+URL+") ("+fname+")");

//  let myURL=['cgm_data/ANA1.cgm.wmrss_igb14.pos'];
//  let myFname=[ 'ANA1.cgm.wmrss_igb14.pos' ];
//  loadAndProcessFromFile(myURL,myFname,frameWidth,frameHeight);

    loadAndProcessFromFile([URL],[fname]);

}) // end of MAIN
