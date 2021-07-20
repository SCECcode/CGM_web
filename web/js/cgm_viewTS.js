/***
   cgm_viewTS.js
***/

// sample pos data
// cgm_data/TWMS.cgm.wmrss_igb14.pos
//

var VIEWTS_tb = {
   "tsview": [
             {'id':0,
              'name': 'Basic Navigation',
              'description': 'How to manipulate the Time Series view' },
             {'id':1,
              'name': 'Select Representation',
              'description': 'some placeholder thing'},
             { 'id':2,
               'name': 'Close',
               'description': 'Close the Time Series view'},
             { 'id':3,
               'name': 'Shrink',
               'description': 'Shrink to a smaller screen view'},
             { 'id':4,
               'name': 'Reset',
               'description': 'Refresh the Time Series view to the default orientation' },
             { 'id':5,
               'name': 'Save',
               'description': 'Save a copy of Time Series view' },
             { 'id':6,
               'name': 'Help',
               'description': 'Display this information table'},
             { 'id':7,
               'name': 'Disclaimer',
               'description': '<p>This viewer is intended to provide potential CGM users ....</p>'}
             ]
}

function setup_infoTSTable() {
   window.console.log("HERE.. setup_info");
   var tb=VIEWTS_tb['tsview'];
   var cnt=tb.length-1;
   var i;
   var tbhtml="<div class=\"cgm-table\"><table>";
   tbhtml=tbhtml+"<thead><tr><th style=\"width:8vw\">Name</th><th style=\"width:40vw\"><b>Description</b></th></tr></thead><tbody>";

   for( i=0; i<cnt; i++) {
     var item=tb[i];
     var mname=item['name'];
     var descript=item['description'];
     var t="<tr><td style=\"width:6vw\">"+mname+"</td><td style=\"width:40vw\">"+descript+"</td></tr>";
     tbhtml=tbhtml+t;
   }
   tbhtml=tbhtml+"</tbody></table></div>";

   var html=document.getElementById('infoTSTable-container');
   html.innerHTML=tbhtml;
}

var skip_warning=false;
function setup_warnTSTable() {
   window.console.log("HERE.. setup_warn");
   var tb=VIEWTS_tb['tsview'];
   var last=tb.length-1;
   var tbhtml="<div class=\"cgm-table\"><table>";
   tbhtml=tbhtml+"<thead></thead><tbody>";

   // grab from first, and last
   var item=tb[0];
   var mname=item['name'];
   var descript=item['description'];
   var t="<tr><td style=\"width:60vw;\"><b>Basic Instructions</b><br>"+descript+"</td></tr>";
   tbhtml=tbhtml+t;

   var item=tb[last];
   var mname=item['name'];
   var descript=item['description'];
   var t="<tr><td style=\"width:30vw\"><b>Intended Uses and Limitations</b><br>"+descript+"</td></tr>";
   tbhtml=tbhtml+t;

   tbhtml=tbhtml+"</tbody></table></div>";

   var html=document.getElementById('warnTSTable-container');
   html.innerHTML=tbhtml;
}

function showPlotTSWarning() {
  if(!skip_warning) {
    skip_warning=true;
    let elt=document.getElementById("viewTSWarnbtn");
    elt.click();
  }
}


function set_PARAMS(params) {
  $('#paramsTS').attr('src',params);
}

function get_PARAMS() {
  return $('#paramsTS').attr('src');
}

function showTSView(urls,fnames,ftypes) {

// TODO:XX need some reset/setup for plotly

  $('#modalTS').modal('show');

  let urlstr= "["+urls.toString()+"]";
  let fnamestr= "["+fnames.toString()+"]";
  let ftypestr= "["+ftypes.toString()+"]";

  // urls causing problem when it is too large
  let params="frameType="+ftypestr+"&URL"+urlstr+"&fileName="+fnamestr;
  set_PARAMS(params);

  window.console.log("ShowTSView, params >>"+params);
  $('#viewTSIfram').attr('src',"cgm_ts.html?"+params);

}

// should be able to track the initial state and then return to it
function refreshTSview() {

  resetReprTSview();
  resetExpandTSview();

  var params=get_PARAMS();
  $('#viewTSIfram').attr('src',"cgm_ts.html?"+params);
}


// move current popup modal to a new tab
function moveTSview() {
  var yourDOCTYPE = "<!DOCTYPE html>"; // your doctype declaration
  var copyPreview = window.open('about:blank', 'CGM PlotTS', "resizable=yes,scrollbars=yes,status=yes");
  var newCopy = copyPreview.document;
  newCopy.open();
  // remove copy and new tab buttons
  document.getElementById("viewTSClosebtn").style.display="none";
  document.getElementById("viewTSMovebtn").style.display="none";
  var newInner=document.documentElement.innerHTML;
  newCopy.write(yourDOCTYPE+"<html>"+ newInner+ "</html>");
  newCopy.close();
  document.getElementById("viewTSClosebtn").style.display="block";
  document.getElementById("viewTSMovebtn").style.display="block";
  document.getElementById("viewTSClosebtn").click();
}

var track_full=0; // 1 is on 0 is off
var save_height=0;
var save_width=0;
function toggleExpandTSview(elt) {
 
  track_full = !track_full;
  if(track_full) {
    let h = document.documentElement.clientHeight;
    elt.innerHTML="Expand";
    $('#modalTSDialog').removeClass('modal-full-dialog');
    $('#modalTSContent').removeClass('modal-full-content');
    save_height=document.getElementById("viewTSIfram").height;
    save_width=document.getElementById("viewTSIfram").width;
    let nh= Math.floor(save_height/2);
    let nw= Math.floor(nh * 3/2);
    document.getElementById("viewTSIfram").height=nh;
    document.getElementById("viewTSIfram").width=nw;
window.console.log("new width"+nw);
window.console.log("new height"+nh);
    } else {
      elt.innerHTML="Shrink";
      $('#modalTSDialog').addClass('modal-full-dialog');
      $('#modalTSContent').addClass('modal-full-content');
      var c=document.getElementById("modalTSContent");
      var f=document.getElementById("modalTSFooter");
      document.getElementById("viewTSIfram").height = save_height;
      document.getElementById("viewTSIfram").width = save_width;
window.console.log("old width"+nw);
window.console.log("old height"+nh);
  }
}

function resetExpandTSview() {
  let elt=document.getElementById("viewTSExpandbtn");
  if(track_full == 1) {
    track_full=0;
    elt.innerHTML="Shrink";
    $('#modalTSDialog').addClass('modal-full-dialog');
    $('#modalTSContent').addClass('modal-full-content');
    var c=document.getElementById("modalTSContent");
    var f=document.getElementById("modalTSFooter");
    document.getElementById("viewTSIfram").height = save_height;
    document.getElementById("viewTSIfram").width = save_width;
  }
}

// XXX Downloadbtn at plotly inside
function saveTSview() {
  document.getElementById("viewTSIfram").contentDocument.getElementById("Downloadbtn").click();
}
// XXX
function  toggleEReprTSview(elt) {
}
// XXX
function  resetReprTSview() {
}

