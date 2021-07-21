/*****MAIN*****/
jQuery(document).ready(function() {

  // window.parent would get to calling window

  // grab the params from the iframe data
  [URL, fname]=getCallingParam("uidlist");

  let myURL=['cgm_data/ANA1.cgm.wmrss_igb14.pos'];
  let myFname=[ 'ANA1.cgm.wmrss_igb14.pos' ];

  var dataTypelist= loadAndProcessFromFile(myURL,myFname);
  if(dataTypelist == null) {
     window.console.log("ERROR, no datatype in the data file\n");
     return;
  }

}) // end of MAIN

