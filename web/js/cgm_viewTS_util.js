/*** 
   cgm_viewTS_util.js
***/

// footer is about 58px
function setIframHeight(id) {
  let c_height = document.documentElement.clientHeight;
  let c_width= document.documentElement.clientWidth;
  let f_h=58;
  let height=c_height -(f_h*3);
  document.getElementById(id).height = height;
}

// tracking different time series with different frame types for
// the same station, only cycle through them and send one to
// plotly one at a time
var TS_track_view = 0;
var TS_urllist=[];
var TS_ftypelist=[]; 

function skipUpdateTS(nx) {
  if(TS_track_view == nx) { 
     return 1;
  }
  return 0;
}

function updateTSviewSelection(nx) {
  TS_track_view=nx;
}

function setupTSviewSelection(urllist, ftypelist) {
  TS_urllist=urllist;
  TS_ftypelist=ftypelist;
  if(TS_ftypelist.length == 1) {
    window.console.log("HERE..");
    let btnElem = $("#viewTSTogglebtn");
//    btnElem.prop("disabled", true)
    btnElem.hide();
  }
}

function getTSviewSelection(){
  return [ [TS_urllist[TS_track_view]], [TS_ftypelist[TS_track_view]]];
}

function resetTSviewSelection(){
   if( TS_track_view == 0) { // do nothing
     return 0;
   }
   TS_track_view=0;
   return 1;
}

function nextTSviewSelection() {
   let sz=TS_urllist.length;
   let nx=(TS_track_view + 1) % sz;
   return nx;
}
