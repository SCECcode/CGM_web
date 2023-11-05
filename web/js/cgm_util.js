/***
   cgm_util.js
***/

var cgm_latlon_area_list=[];
var cgm_latlon_point_list=[];

/************************************************************************************/
var big_map=0; // 0(some control),1(none)
var park_plot_width=0;
var park_plot_height=0;
var park_plot_container=0;

function _toBigView()
{
window.console.log(" calling toBigView..");

park_plot_height=$('#CGM_plot').css("height");
park_plot_width=$('#CGM_plot').css("width");
park_plot_container=$('#container').css("width");

let height=window.innerHeight;
let width=window.innerWidth;

window.console.log("with wh"+height +" with ww"+width);
window.console.log("nn with wh"+park_plot_height +" with ww"+park_plot_width+" with cc"+park_plot_container);

$('#top-intro').css("display", "none");
$('#top-control-row-1').css("display", "none");
$('#top-control-row-2').css("display", "none");
$('#top-control-row-3').css("display", "none");
$('#top-select').css("display", "none");
//$('#top-map').css("border-left-width", "0px");
//$('#top-map').css("border-right-width", "0px");
$('#top-map').css("padding-left", "15px");
$('.navbar').css("margin-bottom", "0px");
$('.container').css("max-width", "100%");
$('.leaflet-control-attribution').css("width", "80rem");
// minus the height of the container top 
let elt = document.getElementById('banner-container');
let c_height = elt.clientHeight;
let h = height - c_height - 4.5;
let w = width - 4.5;
$('#CGM_plot').css("height", h);
$('#CGM_plot').css("width", w);
resize_map();
}

function _toNormalView()
{
window.console.log(" calling toNormalView..");

let height=window.innerHeight;
let width=window.innerWidth;
window.console.log("with wh"+height +" with ww"+width);
window.console.log("nn with wh"+park_plot_height +" with ww"+park_plot_width);

$('#CGM_plot').css("height", park_plot_height);
$('#CGM_plot').css("width", park_plot_width);
$('#top-control-row-1').css("display", "");
$('#top-control-row-2').css("display", "");
$('#top-control-row-3').css("display", "");
$('#top-select').css("display", "");
$('#top-map').css("padding-left", "30px");
$('.navbar').css("margin-bottom", "20px");
$('.container').css("max-width", "1140px");
$('.leaflet-control-attribution').css("width", "35rem");
$('#top-intro').css("display", "");
resize_map();
}

function toggleBigMap()
{
  switch (big_map)  {
    case 0:
      big_map=1;
      _toBigView();		   
      break;
    case 1:
      big_map=0;
      _toNormalView();		   
      break;
  }
}

/************************************************************************************/

function setupProgressBar(exp,txt) {
  $("#wait-expected").val(exp);
  $("#wait-text").val(txt);
  var element = document.getElementById("myProgressBar");
  element.style.width = 0+'%';
  let elm = $("#wait-progress");
  let percent= 0+'%';
  elm.val(percent);
}
  
function updateProgressBar(width) {
    var element = document.getElementById("myProgressBar");
    element.style.width = width + '%';
    let elm = $("#wait-progress");
    let percent= width * 1  + '%';
    elm.val(percent);
    return 1;
}

function startLoadTrackWait(track, n) {
  let txt= "Please wait, retrieving InSAR track "+track;
  setupProgressBar(n,txt);
  $("#modalprogress").modal({ backdrop: 'static', keyboard: false });
}

function showProgressBar() {
  $('#modalprogress').modal('show');
}

function doneLoadTrackWait() {
  setTimeout(function() {$('#modalprogress').modal('hide')}, 2000);
}

function saveAsURLFile(url) {
  var dname=url.substring(url.lastIndexOf('/')+1);
  var dload = document.createElement('a');
  dload.href = url;
  dload.download = dname;
  dload.type="application/octet-stream";
  dload.style.display='none';
  document.body.appendChild(dload);
  dload.click();
  document.body.removeChild(dload);
  delete dload;
}


function downloadHDF5InSAR() {
    let type=$("#insar-track-select").val();
    if(type == "") {
      return;
    }
    window.console.log("TYPE ..", type);
    let fname="./cgm_data/insar/"+type+"_COMB_CGM_InSAR_v0_0_1.hdf5";
    saveAsURLFile(fname);
//  saveAsURLFile('./csm_data/LuttrellHardebeckJGR2021_Table1.csv');
//  saveAsURLFile('https://files.scec.org/s3fs-public/LuttrellHardebeckJGR2021_Table1.csv');
}

// pop up the notify model with a timeout
function notify(msg) {
  let html=document.getElementById('notify-container');
  html.innerHTML=msg;
  $('#modalnotify').modal('show');
  setTimeout(function() {$('#modalnotify').modal('hide')}, 2000);
}

function truncateNumber(num, digits) {
    let numstr = num.toString();
    if (numstr.indexOf('.') > -1) {
        return numstr.substr(0 , numstr.indexOf('.') + digits+1 );
    } else {
        return numstr;
    }
 }


function isObject(objV) {
  return objV && typeof objV === 'object' && objV.constructor === Object;
}

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function retrieveTrack(gid, url, callback, async) {

  var http = new XMLHttpRequest();
window.console.log("FIRST line in http");

  http.onreadystatechange = function () {
    if (this.readyState == 4) {
      window.console.log("http ready..");
    }
  }
  http.onprogress = function (pbar) {
    if (pbar.lengthComputable) {
       let width = Math.floor((pbar.loaded/pbar.total) * 100);
       updateProgressBar(width);
    }
  }
  http.onloadend = function (pbar) {
     doneLoadTrackWait();
     if(http.status !== 404) {
       return callback(gid,http.responseText);
     } 
     window.console.log( "http last one status "+ http.statusText);
  }

// sychronous=false, async=true
  http.open("GET", url, async);
  http.send();

  if(async == false) {
    window.console.log("LAST line in http");
    if(http.status !== 404) {
      return callback(gid,http.responseText);
    } 
  }
};

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
//     url=http://localhost/data/synapse/segments-dummy.csv
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
 // okay
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
}

/**********************************************************************/

/* color from blue to red */
function makeRGB(val, maxV, minV) {
    let v= (val-minV) / (maxV-minV);
    let blue = Math.round(255 * v);
    let green = 0;
    let red = Math.round((1-v)*255);
    let color="RGB(" + red + "," + green + "," + blue + ")";
    return color;
}

function MapFeature(gid, properties, geometry, scec_properties) {
    this.type = "FeatureCollection";
    this.gid = gid;
    this.features =[{
        type: "Feature",
        id: gid,
        properties: properties,
        geometry: geometry,
    }];
    this.layer = null;
    this.scec_properties = scec_properties;
}


function updateDownloadCounter(select_count) {
    window.console.log("download counter updated.."+select_count);
    let downloadCounterElem = $("#download-counter");
    let plotCounterElem = $("#plot-counter");
    let downloadBtnElem = $("#download-all");
    let plotBtnElem = $("#plotTS-all");
    let placeholderTextElem = $("#placeholder-row");
    if (select_count <= 0) {
        downloadCounterElem.hide();
        plotCounterElem.hide();
        downloadBtnElem.prop("disabled", true);
        plotBtnElem.prop("disabled", true);
        placeholderTextElem.show();
    } else {
       downloadCounterElem.show();
       plotCounterElem.show();
       downloadBtnElem.prop("disabled", false);
       plotBtnElem.prop("disabled", false);
       placeholderTextElem.hide();
    }
    downloadCounterElem.html("(" + select_count + ")");
    plotCounterElem.html("(" + select_count + ")");
}

// supply a new layer
function add_bounding_rectangle(a,b,c,d) {
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var layer=addRectangleLayer(a,b,c,d);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  cgm_latlon_area_list.push(tmp);
  return layer;
}

function remove_bounding_rectangle_layer() {
   if(cgm_latlon_area_list.length == 1) {
     var area=cgm_latlon_area_list.pop();
     var l=area["layer"]; 
     viewermap.removeLayer(l);
   }
}

function add_bounding_rectangle_layer(layer, a,b,c,d) {
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  //set_latlons(a,b,c,d);
  cgm_latlon_area_list.push(tmp);
}

function add_marker_point(a,b) {
  // remove old one and add a new one
  remove_marker_point_layer();
  var layer=addMarkerLayer(a,b);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b}]};
  cgm_latlon_point_list.push(tmp);
  return layer;
}

function remove_marker_point_layer() {
   if(cgm_latlon_point_list.length == 1) {
     var point=cgm_latlon_point_list.pop();
     var l=point["layer"]; 
     viewermap.removeLayer(l);
   }
}

function add_marker_point_layer(layer, a,b) {
  // remove old one and add a new one
  remove_marker_point_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b}]};
  cgm_latlon_point_list.push(tmp);
}

// https://www.w3schools.com/howto/howto_js_sort_table.asp
// n is which column to sort-by
// type is "a"=alpha "n"=numerical
function sortMetadataTableByRow(n,type) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("metadata-viewer");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc"; 

window.console.log("Calling sortMetadataTableByRow..",n);

  while (switching) {
    switching = false;
    rows = table.rows;
    if(rows.length < 3) // no switching
      return;

/* loop through except first and last */
    for (i = 1; i < (rows.length - 2); i++) {
      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[n];
      y = rows[i + 1].getElementsByTagName("td")[n];

      if (dir == "asc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
         }
      } else if (dir == "desc") {
        if(type == "a") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
          } else {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              shouldSwitch = true;
              break;
            }
        }
      }
    }
    if (shouldSwitch) {
window.console.log("need switching..");
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++; 
    } else {

      window.console.log("done switching..");
      if(switchcount != 0) {

      }
     

      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  var id="#sortCol_"+n;
  var t=$(id);
  if(dir == 'asc') {
    t.removeClass("fa-angle-down").addClass("fa-angle-up");
    } else {
      t.removeClass("fa-angle-up").addClass("fa-angle-down");
  }
}
