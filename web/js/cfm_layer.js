/***
   cfm_layer.js
***/
// control whether the main mouseover popup should be active or not
var skipPopup=false;

var default_highlight_color = "red";
var alternate_highlight_color = "#03F7EB";

const defaultStyle = {
    "weight":2,
    "opacity":0.8,
    "color": "black",
};

var highlight_style = {
    'color': default_highlight_color,
    'opacity':1,
    'weight': 2,
};

var blind_dash_value = 6;
var blind_highlight_style = {
    'color': default_highlight_color,
    'opacity':1,
    'weight': 2,
    'dashArray': blind_dash_value
};


// for toggleAll option
var cfm_toggle_plot=1;

/***
   tracking data structure
***/
var use_fault_color = "default";
var use_download_set = "";

// [ { "abb": abb1, "name" : name1 }, {"abb": abb2, "name": name2 }, ... ]
var cfm_zone_list=[];

// [ { "abb": abb1, "name" : name1 }, {"abb": abb2, "name": name2 }, ... ]
var cfm_area_list=[];

// [ { "abb": abb1, "name" : name1 }, {"abb": abb2, "name": name2 }, ... ]
var cfm_section_list=[];

// [ { "abb": abb1, "name" : name1 }, {"abb": abb2, "name": name2 }, ... ]
var cfm_name_list=[];

// [{ gid, name, url, objgid}, {gid, name, url, objgid}, ... ] gid that is from native list
var cfm_native_list=[];

// gid is objgid
// {gid, gid, ...}
var cfm_native_gid_list=[];

// [{ gid, name, url, objgid}, {gid, name, url, objgid}, ... ], gid that is from 500m list
var cfm_500m_list=[];

// gid is objgid
// {gid, gid, ...}
var cfm_500m_gid_list=[];

// [{ gid, name, url, objgid }, {gid, name, url, objgid}, ... ], gid that is from 1000m list
var cfm_1000m_list=[];

// gid is objgid
// {gid, gid, ...}
var cfm_1000m_gid_list=[];

// [{ gid, name, url, objgid }, {gid, name, url, objgid}, ... ], gid that is from 2000m list
var cfm_2000m_list=[];

// gid is objgid
// {gid, gid, ...}
var cfm_2000m_gid_list=[];

// gid is objgid
// { gid1, gid2, ... }, all objects 
var cfm_gid_list=[];

// gid is objgid
// { gid1, gid2, ... }, only without geo
var cfm_nogeo_gid_list=[];

// all objgid ==> gid from object_tb, all objects (meta has 'blind')
//  [ { "gid": gid1,  "meta": mmm1 }, {  "gid": gid2, "meta": mmm2 }, ... } 
var cfm_fault_meta_list=[];

// gid is objgid, layer is geoLayer made from geoJSON with trace-feature
// by leaflet
// [ {"gid": gid1, "layer": layer1 }, {"gid":gid2, "layer":layer2}...], only with geo
var cfm_layer_list=[];

// tracking original style
// gid is objgid
// [ {"gid": gid1, "style": style1, "visible": vis1, "highlight": hl1 },...], only with geo
var cfm_style_list=[];

// gid is objgid
// { gid1, gid2, ... }, tracking current active search result, from all objects
var cfm_active_gid_list=[];

// a set of bounding box composed of  2 lat lon locations
// for now, expect there is just 1 area only
// [ {"layer":layer1, "latlngs":[ {latA,lonA}, {latB,lonB}]},...];
var cfm_latlon_area_list=[];

// gid is obgid, 
// { gid1, gid2, ... }, tracking which object is 'blind'
var cfm_blind_gid_list=[];

var all_traces=[];
var all_geo_json=[];
var initial_page_load = true;

const Models = {
    CFM: 'cfm',
    CGM: 'cgm',
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

function reset_geo_plot() {
  // can not really 'destroy' layer and so need to reuse..
  cfm_active_gid_list=[];
  reset_layer_list();  // unhighlight the layers first
  // reset_style_list();
  // generate the result table according to the style_list..
  // remove all the layer
  // redraw the layers
  cfm_toggle_plot=0;
  toggleAll();
}

// create a feature with just 1 geoJSON, per object_tb's gid
function makeGeoJSONFeature(geoJSON, gid, meta) {
   let geometry;
  if(in_trace_list(gid)) {
    return undefined;
  }

  if(geoJSON == undefined) {
//    window.console.log("makeGeoJSONFeature, geoJSON is null for ", gid);
    return undefined;
  }
  if( typeof geoJSON === 'object') {
     geometry= geoJSON;
     }
  else {
       geometry=JSON.parse(geoJSON);
  }

  var color=getColorFromMeta(meta);
  var style= { ...defaultStyle };

  if (is_fault_blind(gid)) {
      style.dashArray = blind_dash_value;
  }

  let properties = {
      "metadataRow": getMetadataRowForDisplay(meta),
      "style": style,
 };

   let scec_properties = { "visible": 1, "highlight": 0, };

  let cfm_trace = new MapFeature(gid, properties, geometry, scec_properties );
  let layer = addGeoToMap(cfm_trace);
   cfm_trace.layer = layer;
   cfm_trace.trace = cfm_trace;

  cfm_layer_list.push(cfm_trace);
  return cfm_trace;
}

// reset to style with new color
// in both cfm_style_list and also in layer -- but only visible ones
function reset_fault_color() {

  cfm_layer_list.forEach(function(element) {
    var gid=element['gid'];
    if(element.scec_properties.visible == 1) {
       if(element.scec_properties.highlight == 0) {
           var geolayer=element.layer;
           geolayer.eachLayer(function(layer) {
             layer.setStyle(defaultStyle);
           }); 
       }
      } else {
      gstyle['dirty_style']=true;
    }
  });
}

function remove_layer_list() {
  cfm_layer_list.forEach(function(element) {
      var l=element['layer'];
      viewermap.removeLayer(l);
  });
}


function get_feature(gid) {
  var cnt=cfm_layer_list.length;
  for(var i=0; i<cnt; i++) {
    var element=cfm_layer_list[i];
    var g=element['gid'];
    if (gid == element['gid']) {
       var trace=element["trace"];
       return trace;
    }
  }
  return {};
}

/* return true if target is in the meta list */
function find_meta_list(target) {
   var found=0;
   cfm_fault_meta_list.forEach(function(element) {
     if ( element['gid'] == target )
        found=element;
   });
   return found;
}

function reset_download_set()
{
   use_download_set = "";
}

function get_meta_list(gidlist) {
   var mlist=[];
   gidlist.forEach(function(gid) {
     var m=find_meta_list(gid);
     mlist.push(m['meta']);
   });
   return mlist;
}

function addto_blind_gid_list(gid) {
   cfm_blind_gid_list.push(gid);
}

function in_blind_gid_list(target) {
   var found=0;
   cfm_blind_gid_list.forEach(function(element) {
          if (element == target) {
             found=1;
          }
   });
   return found;
}

function is_fault_blind(gid) {
   var m=find_meta_list(gid);
   if(m) {
      var blindstr=m.meta['blind'];
      var b=parseInt(blindstr);
      if (b==1)
        return 1;
   }
   return 0;
}

/* return true if target is in the trace list */
function in_trace_list(target) {
   var found=0;
    cfm_layer_list.forEach(function(element) {
     if ( element['gid'] == target )
        found=1;
   });
   return found;
}

/* return true if target is in the active list */
function in_active_gid_list(target) {
   var found=0;

   if(cfm_active_gid_list.length == 0)
     return found;

   cfm_active_gid_list.forEach(function(element) {
     if ( element == target )
        found=1;
   });
   return found;
}


// find a layer from the layer list
function find_layer_list(target) {
   var found="";
   cfm_layer_list.forEach(function(element) {
     if ( element['gid'] == target )
        found=element;
   });
   return found;
}

// just in case the layer's color got set to highlight
function reset_layer_list() { 
   cfm_layer_list.forEach(function(element) {
     var gid=element['gid'];
     var s=find_layer_list(gid);
     if( s.scec_properties.highlight==1 && s.scec_properties.visible==1 ) {
       toggle_highlight(gid);
        addRemoveFromDownloadQueue(gid);
        addRemoveFromMetadataTable(gid);
     }
   });
}

// select every layer
function select_layer_list() {
   cfm_layer_list.forEach(function(element) {
     var gid=element['gid'];
     var s=find_layer_list(gid);
     if( s.scec_properties.highlight==0 && s.scec_properties.visible==1 ) {
       toggle_highlight(gid);
     }
   });
}

function get_highlight_list() {
   var hlist=[];
   cfm_layer_list.forEach(function(element) {
   if (element.scec_properties.highlight == 1) {
       hlist.push(element['gid']);
     }
   });
   return hlist;
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
    if (cfm_select_count <= 0) {
        downloadCounterElem.hide();
        buttonElem.prop("disabled", true);
        placeholderTextElem.show();
    } else {
       downloadCounterElem.show();
       buttonElem.prop("disabled", false);
        placeholderTextElem.hide();
    }
    downloadCounterElem.html("(" + cfm_select_count + ")");
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

function toggle_highlight(gid) {
    var this_highlight_style;
   var s=find_layer_list(gid);
   if (s == '') {
       return;
   }

    if (is_fault_blind(gid)) {
        this_highlight_style = blind_highlight_style;
    } else {
        this_highlight_style = highlight_style;
    }

   var h=s.scec_properties.highlight;
   let $star=$(`#highlight_${gid}`);
   let $rowSelected = $(`#row_${gid}`);
   let $itemCount = $("#itemCount");

   if ($rowSelected.hasClass("layer-hidden")) {
       return;
   }

   if(h==0) {
     $rowSelected.addClass("row-selected");
     $star.removeClass('glyphicon-unchecked').addClass('glyphicon-check');
     s.scec_properties.highlight=1;
     var l=find_layer_list(gid);
     var geolayer=l.layer;
     geolayer.eachLayer(function(layer) {
       layer.setStyle(this_highlight_style);
     });
     cfm_select_count++;
     // adjust width if needed
     $itemCount.html(cfm_select_count).show();
/* get actual rendored font/width
     var fs = $('#itemCount').html(cfm_select_count).css('font-size');
     var width = $('#itemCount').html(cfm_select_count).css('width');
*/
     if(cfm_select_count == 100)
        $itemCount.html(cfm_select_count).css("width","30px");
     } else {
       $star.removeClass('glyphicon-check').addClass('glyphicon-unchecked');
       $rowSelected.removeClass("row-selected");
       if(cfm_select_count == 99) // reset font size
         $itemCount.html(cfm_select_count).css("width","20px");
       cfm_select_count--;
       if(cfm_select_count == 0) {
         $itemCount.html(cfm_select_count).hide();
         } else {
           $itemCount.html(cfm_select_count).show();
       }

       s.scec_properties.highlight = 0;
       var l=find_layer_list(gid);
       var geolayer=l.layer;
       var s= find_layer_list(gid);
       var original= s.trace.features[0].properties.style;
       var v=s.scec_properties.visible;
       if(v && original != undefined) {
          geolayer.eachLayer(function(layer) {
            layer.setStyle(original);
          }); 
       }
   }

    addRemoveFromDownloadQueue(gid);
    addRemoveFromMetadataTable(gid);
}

function get_leaflet_id(layer) {
   var id=layer['layer']._leaflet_id;
   return id;
}

function in_500m_gid_list(target) {
   var found=0;
   cfm_500m_gid_list.forEach(function(element) {
          if (element == target) {
             found=1;
          }
   });
   return found;
}

function url_in_500m_list(target) {
   var url=null;
   cfm_500m_list.forEach(function(element) {
         if(element['objgid']==target) {
            url=element['url'];
         }
   });
   return url;
}

function in_1000m_gid_list(target) {
   var found=0;
   cfm_1000m_gid_list.forEach(function(element) {
          if (element == target) {
             found=1;
          }
   });
   return found;
}

function in_2000m_gid_list(target) {
   var found=0;
   cfm_2000m_gid_list.forEach(function(element) {
          if (element == target) {
             found=1;
          }
   });
   return found;
}

function url_in_1000m_list(target) {
   var url=null;
   cfm_1000m_list.forEach(function(element) {
         if(element['objgid']==target) {
            url=element['url'];
         }
   });
   return url;
}

function url_in_2000m_list(target) {
   var url=null;
   cfm_2000m_list.forEach(function(element) {
         if(element['objgid']==target) {
            url=element['url'];
         }
   });
   return url;
}

function in_native_gid_list(target) {
   var found=0;
   cfm_native_gid_list.forEach(function(element) {
          if (element == target)
             found=1;
   });
   return found;
}

function url_in_native_list(target) {
   var url=null;
   cfm_native_list.forEach(function(element) {
         if(element['objgid']==target) {
            url=element['url'];
         }
   });
   return url;
}

function in_nogeo_gid_list(target) {
   var found=0;
   cfm_nogeo_gid_list.forEach(function(element) {
          if (element == target)
             found=1;
   });
   return found;
}

// toggle off everything except if there
// is a set of search result..
function toggle_off_all_layer()
{
  var sz=cfm_layer_list.length;
  if (sz==0) return;
  for (var i=0; i<sz; i++) {
     var s=cfm_layer_list[i];
     var vis=s.scec_properties.visible;
     var gid=s['gid'];
     if(vis == 1) { 
        toggle_layer(gid) 
     }
  }
  cfm_toggle_plot=0;
}

function toggle_layer_with_list(glist)
{
  var sz=glist.length;
  if (sz==0) return;
  for (var i=0; i<sz; i++) {
     var gid=glist[i];
     var s=find_layer_list(gid);
     if(s == undefined)
        continue;
     var vis=s.scec_properties.visible;
     var gid=s['gid'];
     if(vis == 0) { 
         toggle_layer(gid) 
     }
  }
}

// make every layer visible
function toggle_on_all_layer()
{
  var sz=cfm_layer_list.length;
  if (sz==0) return;
  for (var i=0; i<sz; i++) {
     var s=cfm_layer_list[i];
     var vis=s.scec_properties.visible;
     var gid=s['gid'];
     if(vis == 0) { 
       toggle_layer(gid); 
          // mark only in active search list
       if(in_active_gid_list(gid)==1) { 
          s['dirty_visible']=true;
       }
     }
  }
}

function toggle_layer(gid)
{
  var s=find_layer_list(gid);
  var geolayer=s['layer'];
  var vis=s.scec_properties.visible;
  var eye='#'+"toggle_"+gid;
  let toggledRow = '#row_'+gid;

  if(vis == 1) {
      if ($(toggledRow).hasClass("row-selected")) {
            toggle_highlight(gid);
      }

    $(eye).removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
    $(toggledRow).addClass("layer-hidden");
    viewermap.removeLayer(geolayer);
    visibleFaults.removeLayer(geolayer);
    s.scec_properties.visible = 0;
    } else {
      $(toggledRow).removeClass("layer-hidden");
      if( s['dirty_visible'] != undefined ){ // do nothing
        s['dirty_visible'] = undefined;
        return;
      }
      s.scec_properties.visible = 1;
      $(eye).removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
      viewermap.addLayer(geolayer);
      visibleFaults.addLayer(geolayer);
// if style is dirty, needs to be updated from the stylelist..
      if( s['dirty_style'] !=  undefined ) {
        var style=s['style'];
        geolayer.eachLayer(function(layer) {
          layer.setStyle(style);
        }); 
        s['dirty_style']=undefined;
      }
  }
}

function add_bounding_rectangle(a,b,c,d) {
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var layer=addRectangleLayer(a,b,c,d);
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  cfm_latlon_area_list.push(tmp);
}

function remove_bounding_rectangle_layer() {
   if(cfm_latlon_area_list.length == 1) {
     var area=cfm_latlon_area_list.pop();
     var l=area["layer"]; 
     viewermap.removeLayer(l);
   }
}

function add_bounding_rectangle_layer(layer, a,b,c,d) {
  // remove old one and add a new one
  remove_bounding_rectangle_layer();
  var tmp={"layer":layer, "latlngs":[{"lat":a,"lon":b},{"lat":c,"lon":d}]};
  set_latlons(a,b,c,d);
  cfm_latlon_area_list.push(tmp);
}

