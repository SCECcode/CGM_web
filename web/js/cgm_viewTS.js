/***
   cgm_viewTS.js

   processing time series view
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
              'ptype': 'gnss',
              'name': 'Select GNSS Frame Type',
              'description': 'Select a GNSS Time Series frame type to display'},
             { 'id':2,
               'name': 'Close',
               'description': 'Close the Time Series view'},
             { 'id':3,
               'name': 'Reset',
               'description': 'Refresh the Time Series view to the default orientation' },
             { 'id':4,
               'name': 'Save',
               'description': 'Save a copy of Time Series view' },
             { 'id':5,
               'name': 'Help',
               'description': 'Display this information table'},
             { 'id':6,
               'name': 'Disclaimer',
               'description': '<p>This viewer is intended to provide potential CGM users ....</p>'}
             ]
}

function setup_infoTSTable(target) {
   var tb=VIEWTS_tb['tsview'];
   var cnt=tb.length-1;
   var i;
   var tbhtml="<div class=\"cgm-table\"><table>";
   tbhtml=tbhtml+"<thead><tr><th style=\"width:8vw\">Name</th><th style=\"width:40vw\"><b>Description</b></th></tr></thead><tbody>";

   for( i=0; i<cnt; i++) {
     let item=tb[i];
     let mname=item['name'];
     let descript=item['description'];
     if ('ptype' in item) {
       if(item['ptype'] != target)
         continue;
     }
     let t="<tr><td style=\"width:6vw\">"+mname+"</td><td style=\"width:40vw\">"+descript+"</td></tr>";
     tbhtml=tbhtml+t;
   }
   tbhtml=tbhtml+"</tbody></table></div>";

   var html=document.getElementById('infoTSTable-container');
   html.innerHTML=tbhtml;
}

var skip_warning=false;
function setup_warnTSTable() {
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
/* TODO: suppress the popup
  if(!skip_warning) {
    skip_warning=true;
    let elt=document.getElementById("viewTSWarnbtn");
    elt.click();
  }
*/
}


function set_PARAMS(params) {
  $('#paramsTS').attr('src',params);
}

function get_PARAMS() {
  return $('#paramsTS').attr('src');
}

// urls-> array
// ptype -> product type: INSAR/GNSS
// ftypes -> array/for GNSS 
//           [{}]/for INSAR
function showTSview(urls,ptype,ftypes) {
window.console.log("calling showTSview..");
  $("#wait-spinner").show();

  setupTSviewSelection(urls,ptype,ftypes);
  [url,ptype,ftype] = getTSviewSelection();

  $('#modalTS').modal('show');

  let ublob=JSON.stringify(url);
  let fblob=JSON.stringify(ftype);
  let pblob=JSON.stringify(ptype);

  let params= "urls="+ublob+"&ptype="+pblob+"&ftypes="+fblob;
  set_PARAMS(params);
window.console.log("showTSview..param > "+params);

  $('#viewTSIfram').attr('src',"cgm_ts.html?"+params);
}

function clearTSview() {
  var iwindow=document.getElementById('viewTSIfram').contentWindow;
  window.console.log("service, sending a message to iframe.");
  iwindow.postMessage({call:'fromSCEC',value:'clearAll'},"*");
  resetTSviewSelection();
}

function _replotTSview(url,ptype,ftype) {
   // send url/ftype to the 
  let ublob=JSON.stringify(url);
  let fblob=JSON.stringify(ftype);
  let pblob=JSON.stringify(ptype);

  let params= "urls="+ublob+"&ptype="+pblob+"&ftypes="+fblob;
  set_PARAMS(params);

  let childw=document.getElementById('viewTSIfram');

  var iwindow=document.getElementById('viewTSIfram').contentWindow;
  var eparams=encodeURI(params);
  window.console.log("service, sending a message to iframe.");
  iwindow.postMessage({call:'fromSCEC',value:eparams},"*");
}

window.addEventListener("DOMContentLoaded", function () {

  window.console.log("SERVER: add event listener..");
  window.addEventListener('message', function(event) {

    window.console.log(" SERVER Side>>>> got a message..");
    var origin = event.origin;
    if (origin != "http://localhost:8081" && origin != "http://moho.scec.org" && origin != "https://www.scec.org") {
        window.console.log("service, bad message origin:", origin);
        return;
    }

    if (typeof event.data == 'object' && event.data.call=='fromTSviewer') {
        if(event.data.value == "send params") {
          sendParamsTSview();
          return;
        }
        if(event.data.value == "done with loading") {
          window.console.log(" SERVER, turn off load spinner");
          $("#wait-spinner").hide();
          return;
        }
        if(event.data.value == "start loading") {
          $("#wait-spinner").show();
          window.console.log(" SERVER, turn on loading spinner");
          return;
        }
        if(event.data.value == "ready") {
          window.console.log(" SERVER, TS viewer is ready");
          return;
        }
        if(event.data.value == "fail to load") {
          window.console.log(" SERVER, TS viewer having problem !!!!");
          $("#wait-spinner").hide();
          return;
        }
        window.console.log("service, what the heck ..",event.data.value);
        $("#wait-spinner").hide();
      } else {
      window.console.log("service, what the heck 2 ..",event.data);
    }
 })
}, false);


function refreshTSview() {
  let rc=resetTSviewSelection();
  if(rc) { // need to replot
    [url,ptype,ftype] = getTSviewSelection();
    _replotTSview(url,ptype,ftype);
  }
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

// Downloadbtn at plotly inside
function saveTSview() {
  document.getElementById("viewTSIfram").contentDocument.getElementById("Downloadbtn").click();
}

function toggleTSview() {
  let nx=nextTSviewSelection();
  if(skipUpdateTS(nx)) { 
    // do nothing
    window.console.log("skip frame type toggling ..."+nx);
    } else {
      updateTSviewSelection(nx);
      [url,ptype,ftype]=getTSviewSelection(); 
window.console.log("server,need to toggle to "+url[0]);
window.console.log("server,need to toggle to "+ftype[0]);
      _replotTSview(url,ptype,ftype);
  }
}

function selectTSview(tname) {
window.console.log("server,need to toggle to "+url[0]);
window.console.log("server,need to toggle to "+ftype[0]);
window.console.log("selectTSview : turn on spinner..");
   $("#wait-spinner").show();
   let nx=findTSviewTrack(tname);
   updateTSviewSelection(nx);
   [url,ptype,ftype]=getTSviewSelection(); 
   _replotTSview(url,ptype,ftype);
}
