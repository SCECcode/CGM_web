/***
   cgm_util.js
***/

var cgm_latlon_area_list=[];

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
//    window.console.log("download counter updated.."+select_count);
    let downloadCounterElem = $("#download-counter");
    let buttonElem = $("#download-all");
    let placeholderTextElem = $("#placeholder-row");
    if (select_count <= 0) {
        downloadCounterElem.hide();
        buttonElem.prop("disabled", true);
        placeholderTextElem.show();
    } else {
       downloadCounterElem.show();
       buttonElem.prop("disabled", false);
        placeholderTextElem.hide();
    }
    downloadCounterElem.html("(" + select_count + ")");
}

function add_bounding_rectangle(a,b,c,d) {
  // remove old one and add a new one
//window.console.log("calling add_bounding_rectangle..new layer");
  remove_bounding_rectangle_layer();
  var layer=addRectangleLayer(a,b,c,d);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  cgm_latlon_area_list.push(tmp);
}

function remove_bounding_rectangle_layer() {
   if(cgm_latlon_area_list.length == 1) {
//window.console.log("removing bounding rectangle..");
     var area=cgm_latlon_area_list.pop();
     var l=area["layer"]; 
     viewermap.removeLayer(l);
   }
}

function add_bounding_rectangle_layer(layer, a,b,c,d) {
//window.console.log("adding bounding rectangle with layer..");
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  //set_latlons(a,b,c,d);
  cgm_latlon_area_list.push(tmp);
}



function downloadURLsAsZip(ftype) {
  var nzip=new JSZip();
  var layers=CGM.search_result.getLayers();
  let timestamp=$.now();

  var cnt=layers.length;
  for(var i=0; i<cnt; i++) {
    let layer=layers[i];

    if(ftype == CGM.frameType.IGB14 || ftype == "all") {
      let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,CGM.frameType.IGB14);
      let dname=url.substring(downloadURL.lastIndexOf('/')+1);
      let promise = $.get(downloadURL);
      nzip.file(dname,promise);
    }
    if(ftype == CGM.frameType.NAM14 || ftype == "all") {
      let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,CGM.frameType.NAM14);
      let dname=url.substring(downloadURL.lastIndexOf('/')+1);
      let promise = $.get(downloadURL);
      nzip.file(dname,promise);
    }
    if(ftype == CGM.frameType.NAM17 || ftype == "all") {
      let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,CGM.frameType.NAM14);
      let dname=url.substring(downloadURL.lastIndexOf('/')+1);
      let promise = $.get(downloadURL);
      nzip.file(dname,promise);
    }
    if(ftype == CGM.frameType.PCF14 || ftype == "all") {
      let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,CGM.frameType.PCF14);
      let dname=url.substring(downloadURL.lastIndexOf('/')+1);
      let promise = $.get(downloadURL);
      nzip.file(dname,promise);
    }
  }


  var zipfname="CGM_"+timestamp+".zip"; 
  nzip.generateAsync({type:"blob"}).then(function (content) {
    // see FileSaver.js
    saveAs(content, zipfname);
  })
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
