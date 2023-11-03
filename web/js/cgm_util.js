/***
   cgm_util.js
***/

var cgm_latlon_area_list=[];
var cgm_latlon_point_list=[];

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
window.console.log("updating.. progress bar"); 
    var element = document.getElementById("myProgressBar");
    element.style.width = width + '%';
    let elm = $("#wait-progress");
    let percent= width * 1  + '%';
    elm.val(percent);
window.console.log("  done with updating.."+percent); 
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
function retrieveTrack(gid, url, callback) {
  var http = new XMLHttpRequest();

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

// sychronous
  http.open("GET", url, true);
  http.send();

};

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
