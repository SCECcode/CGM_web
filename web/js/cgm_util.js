/***
   cgm_util.js
***/

// control whether the main mouseover popup should be active or not
var skipPopup=false;
var cgm_latlon_area_list=[];
var use_download_set = "";
var cgm_select_count=0;

var initial_page_load = true;
const Models = {
    CGM: 'cgm',
};
var activeModel = Models.CFM;

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
    addRemoveFromDownloadQueue(gid);
}

function addRemoveFromDownloadQueue(gid) {
    // let downloadQueueElem = $("#download-queue");
    // let downloadCounterElem = $("#download-counter");
    // let faultName = $("#row_"+gid).find("td:nth-child(3) label").html();
    // var s = find_layer_list(gid);
    // var h = s['highlight'];
    // if (h == 0) {
    //     // exists, remove it
    //     let elemToRemove = downloadQueueElem.find("li[data-fault-id=" + gid + "]");
    //     elemToRemove.remove();
    // } else {
    //     downloadQueueElem.prepend("<li data-fault-id='" + gid + "' >" + faultName + "</li>");
    // }

    let downloadCounterElem = $("#download-counter");
    let buttonElem = $("#download-all");
    let placeholderTextElem = $("#placeholder-row");
    if (cgm_select_count <= 0) {
        downloadCounterElem.hide();
        buttonElem.prop("disabled", true);
        placeholderTextElem.show();
    } else {
       downloadCounterElem.show();
       buttonElem.prop("disabled", false);
        placeholderTextElem.hide();
    }
    downloadCounterElem.html("(" + cgm_select_count + ")");
}

function addRemoveFromMetadataTable(gid) {
    var targetElem = $("#metadata-"+gid);
    var s = find_layer_list(gid);
    // var h = s['highlight'];
    var h = s.scec_properties.highlight;
    let features_object = get_feature(gid);
    let metadataRow = features_object.features[0].properties.metadataRow;

    if (h == 0) {
        // exists, remove it
        targetElem.remove();
    } else {
        $("#metadata-viewer tbody").prepend(metadataRow);
        $("#metadata-viewer").trigger('reflow');
        if (!select_all_flag) {
            $(`#metadata-viewer tbody tr#metadata-${gid}`).effect("highlight", {}, 1000);
        }
    }
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

