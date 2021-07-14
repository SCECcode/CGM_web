/***
   cgm_util.js
***/

var cgm_latlon_area_list=[];
var use_download_set = "";

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


function reset_download_set()
{
   use_download_set = "";
}


function toggleOnDownloadQueue(event) {
    let rowElem = $(this).parents("tr");
    let gid_string = rowElem.attr("id");
    let gid_string_components = gid_string.split("_");
    let gid = gid_string_components[1];
    updateDownloadCounter(gid);
}

function updateDownloadCounter(select_count) {
    window.console.log("download counter updated.."+select_count);
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
window.console.log("calling add_bounding_rectangle..new layer");
  remove_bounding_rectangle_layer();
  var layer=addRectangleLayer(a,b,c,d);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  cgm_latlon_area_list.push(tmp);
}

function remove_bounding_rectangle_layer() {
   if(cgm_latlon_area_list.length == 1) {
window.console.log("removing bounding rectangle..");
     var area=cgm_latlon_area_list.pop();
     var l=area["layer"]; 
     viewermap.removeLayer(l);
   }
}

function add_bounding_rectangle_layer(layer, a,b,c,d) {
window.console.log("adding bounding rectangle with layer..");
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  //set_latlons(a,b,c,d);
  cgm_latlon_area_list.push(tmp);
}


function executeDownload(type) {
    use_download_set = type;
    startDownload();
}

function startDownload(select_count)
{
  if(select_count == 0) {
    alert("No item selected");
    return;
  }

/** TODO
  if (use_download_set == 'meta' || use_download_set == 'all') {
    downloadCSVMeta(mlist);
  } else if(use_download_set != 'meta') {
    downloadURLsAsZip(mlist);
  }
**/
}

