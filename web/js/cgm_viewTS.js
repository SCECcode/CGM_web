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
