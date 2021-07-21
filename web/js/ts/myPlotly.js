/*****MAIN*****/
jQuery(document).ready(function() {

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

window.console.log("frame width/height "+frameWidth+" "+frameHeight);

  // grab the params from the iframe data
  [URL, fname]=getCallingParams();

window.console.log("in TS..("+URL+") ("+fname+")");

//  let myURL=['cgm_data/ANA1.cgm.wmrss_igb14.pos'];
//  let myFname=[ 'ANA1.cgm.wmrss_igb14.pos' ];
//  loadAndProcessFromFile(myURL,myFname,frameWidth,frameHeight);

  loadAndProcessFromFile([URL],[fname],frameWidth,frameHeight);

}) // end of MAIN
