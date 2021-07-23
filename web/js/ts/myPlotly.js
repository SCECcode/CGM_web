/*****MAIN*****/
jQuery(document).ready(function() {

  let frameHeight=window.innerHeight;
  let frameWidth=window.innerWidth;

  let nh=frameHeight;
  let nw= Math.floor(nh/3)*4;
  if(nw > frameWidth) {
    nw=frameWidth;
    nh= Math.floor((nw/4)*3);
  }

window.console.log("width "+nw+" height "+nh);
  // grab the params from the iframe data
  [URL, fname]=getCallingParams();

window.console.log("in TS..("+URL+") ("+fname+")");

//  let myURL=['cgm_data/ANA1.cgm.wmrss_igb14.pos'];
//  let myFname=[ 'ANA1.cgm.wmrss_igb14.pos' ];
//  loadAndProcessFromFile(myURL,myFname,frameWidth,frameHeight);

  loadAndProcessFromFile([URL],[fname],nw,nh);

}) // end of MAIN
