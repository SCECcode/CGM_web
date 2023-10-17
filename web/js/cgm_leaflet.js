/***
   cgm_leaflet.js

This is leaflet specific utilities for CGM
***/

// [34.3, -118.4]
var init_map_zoom_level = 6.7;
var init_map_coordinates = [34.4, -117.4];

var rectangle_options = {
       showArea: false,
         shapeOptions: {
              stroke: true,
              color: "blue",
              weight: 2,
              opacity: 1,
              fill: true,
              fillColor: null, //same as color by default
              fillOpacity: 0.02,
              clickable: false
         }
};
var pointDrawer;
var point_icon = L.AwesomeMarkers.icon({ icon: 'record', markerColor: 'blue'});
var point_options = { icon : point_icon };

var polygon_options = {
    type: 'polygon',
    color:'red',
    fillOpacity:0.05,
    opacity:0.7,
    weight:0,
/* shapeOptions: { clickable: false } */
};

var rectangleDrawer;
var mymap, baseLayers, layerControl, currentLayer, currentLayerName;
var visibleFaults = new L.FeatureGroup();

var drawing_rectangle=false;
var drawing_point=false;


// scec
var scecAttribution ='<a href="https://www.scec.org">SCEC</a>';

/*****************************************************************/
// track

var cgm_latlon_area_list=[];
var cgm_latlon_point_list=[];

/*****************************************************************/

function clear_popup()
{
  viewermap.closePopup();
}

function refresh_map()
{
  if (viewermap == undefined) {
    window.console.log("refresh_map: BAD BAD BAD");
    } else {
      viewermap.setView(init_map_coordinates,init_map_zoom_level);
  }
}

function setup_viewer()
{
// esri
// web@scec.org  - ArcGIS apiKey, https://leaflet-extras.github.io/leaflet-providers/preview/
// https://www.esri.com/arcgis-blog/products/developers/developers/open-source-developers-time-to-upgrade-to-the-new-arcgis-basemap-layer-service/

  var esri_apiKey = "AAPK2ee0c01ab6d24308b9e833c6b6752e69Vo4_5Uhi_bMaLmlYedIB7N-3yuFv-QBkdyjXZZridaef1A823FMPeLXqVJ-ePKNy";
  var esri_topographic = L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic", {apikey: esri_apiKey});
  var esri_imagery = L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery", {apikey: esri_apiKey});
  var osm_streets_relief= L.esri.Vector.vectorBasemapLayer("OSM:StreetsRelief", {apikey: esri_apiKey});
  var esri_terrain = L.esri.Vector.vectorBasemapLayer("ArcGIS:Terrain", {apikey: esri_apiKey});

// otm topo
  var topoURL='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
  var topoAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreeMap</a> contributors,<a href=http://viewfinderpanoramas.org"> SRTM</a> | &copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a>(CC-BY-SA)';
  L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution, maxZoom:16 })

  var otm_topographic = L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution, maxZoom:16});

  var jawg_dark = L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 16,
	accessToken: 'hv01XLPeyXg9OUGzUzaH4R0yA108K1Y4MWmkxidYRe5ThWqv2ZSJbADyrhCZtE4l'});

  var jawg_light = L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 16,
	accessToken: 'hv01XLPeyXg9OUGzUzaH4R0yA108K1Y4MWmkxidYRe5ThWqv2ZSJbADyrhCZtE4l' });

// osm street
  var openURL='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var openAttribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var osm_street=L.tileLayer(openURL, {attribution: openAttribution, maxZoom:16});

  baseLayers = {
    "esri topo" : esri_topographic,
    "esri imagery" : esri_imagery,
    "jawg light" : jawg_light,
    "jawg dark" : jawg_dark,
    "osm streets relief" : osm_streets_relief,
    "otm topo": otm_topographic,
    "osm street" : osm_street,
    "esri terrain": esri_terrain
  };

  var overLayer = {};
  var basemap = L.layerGroup();
  currentLayer = esri_topographic;

// ==> mymap <==
  mymap = L.map('CGM_plot', { zoomSnap: 0.25, drawControl:false, zoomControl:true, maxZoom:16} );
  mymap.setView(init_map_coordinates,init_map_zoom_level);
  mymap.attributionControl.addAttribution(scecAttribution);

  esri_topographic.addTo(mymap);

// basemap selection
  var ctrl_div=document.getElementById('external_leaflet_control');

// ==> layer control <==
// add and put it in the customized place
//  L.control.layers(baseLayers, overLayer).addTo(mymap);
  layerControl = L.control.layers(baseLayers, overLayer,{collapsed: true });
  layerControl.addTo(mymap);
  var elem= layerControl._container;
  elem.parentNode.removeChild(elem);

  ctrl_div.appendChild(layerControl.onAdd(mymap));
  // add a label to the leaflet-control-layers-list
  var forms_div=document.getElementsByClassName('leaflet-control-layers-list');
  var parent_div=forms_div[0].parentElement;
  var span = document.createElement('span');
  span.style="font-size:14px;font-weight:bold;";
  span.className="leaflet-control-layers-label";
  span.innerHTML = 'Select background';
  parent_div.insertBefore(span, forms_div[0]);

// ==> scalebar <==
  L.control.scale({metric: 'false', imperial:'false', position: 'bottomleft'}).addTo(mymap);

  function onMapZoom(e) { 
    var zoom=mymap.getZoom();
window.console.log("map got zoomed..>>",zoom);
    CGM.gotZoomed(zoom);
  }          
  mymap.on('zoomend dragend', onMapZoom);

// ==> mouse location popup <==
//   var popup = L.popup();
  // function onMapClick(e) {
  //   if(!skipPopup) { // suppress if in latlon search ..
  //     popup
  //       .setLatLng(e.latlng)
  //       .setContent("You clicked the map at " + e.latlng.toString())
  //       .openOn(mymap);
  //   }
  // }
  // mymap.on('click', onMapClick);

  function onMapMouseOver(e) {
    if(drawing_rectangle) {
      window.console.log("before calling draw_at.."); 
      draw_at();
    }
  }
  mymap.on('mouseover', onMapMouseOver);

// ==> rectangle drawing control <==
/*
  var drawnItems = new L.FeatureGroup();
  mymap.addLayer(drawnItems);
  var drawControl = new L.Control.Draw({
       draw: false,
       edit: { featureGroup: drawnItems }
  });
  mymap.addControl(drawControl);
*/
// ==> point drawing control <==
  pointDrawer = new L.Draw.Marker(mymap, point_options);

  rectangleDrawer = new L.Draw.Rectangle(mymap, rectangle_options);

  mymap.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;
    if (type === 'rectangle') {  // tracks retangles
        // get the boundary of the rectangle
        var latlngs=layer.getLatLngs();
        // first one is always the south-west,
        // third one is always the north-east
        var loclist=latlngs[0];
        var sw=loclist[0];
        var ne=loclist[2];
        add_bounding_rectangle_layer(layer,sw['lat'],sw['lng'],ne['lat'],ne['lng']);
        mymap.addLayer(layer);
        if (activeProduct == Products.GNSS) {
            $("div#wait-spinner").show(400, function(){
                CGM_GNSS.searchBox(CGM_GNSS.searchType.latlon, [sw['lat'], sw['lng'], ne['lat'], ne['lng']]);
            });
        }
        if (activeProduct == Products.INSAR) {
            $("div#wait-spinner").show(400, function(){
                CGM_INSAR.searchBox(CGM_INSAR.searchType.latlon, [sw['lat'], sw['lng'], ne['lat'], ne['lng']]);
            });
        }
    } else if (type === 'marker') {  // can be a point 
        var sw=layer.getLatLng();
        add_marker_point_layer(layer,sw['lat'],sw['lng']);
        if (activeProduct == Products.INSAR) {
            $("div#wait-spinner").show(400, function(){
                CGM_INSAR.searchBox(CGM_INSAR.searchType.location, [sw['lat'], sw['lng']]);
            });
        }
    }
 
  });


// enable the expand view key
$("#CGM_plot").prepend($("#expand-view-key-container").html());
let tmp=$(".leaflet-control-attribution");
// should  only have 1, adjust the attribution's location
let v= document.getElementsByClassName("leaflet-control-attribution")[0];
v.style.right="1.5rem";
v.style.height="1.4rem";
v.style.width="50rem";

// finally,
  return mymap;
}

function drawPoint() {
  pointDrawer.enable();
}

function skipPoint() {
  pointDrawer.disable();
}

function drawRectangle(){
  rectangleDrawer.enable();
}

function skipRectangle(){
  rectangleDrawer.disable();
}

// ==> feature popup on each layer <==
function popupDetails(layer) {
   layer.openPopup(layer);
}

function closeDetails(layer) {
   layer.closePopup();
}

// https://gis.stackexchange.com/questions/148554/disable-feature-popup-when-creating-new-simple-marker
function unbindPopupEachFeature(layer) {
    layer.unbindPopup();
    layer.off('click');
}

function addRectangleLayer(latA,lonA,latB,lonB) {
/*
  var pointA=L.point(latA,lonA);
  var pointB=L.point(latB,lonB);
  var bounds=L.latLngBounds(viewermap.containerPointToLatLng(pointA),
                                  viewermap.containerPointToLatLng(pointB));
*/
  var bounds = [[latA, lonA], [latB, lonB]];
  var layer=L.rectangle(bounds).addTo(viewermap);
  return layer;
}

function pointToLatLng(x,y) {
  let latlng=viewermap.layerPointToLatLng(L.point(x,y));
  return latlng;
}

function addMarkerLayer(lat,lon) {
  var bounds = [lat, lon];
  var layer = new L.marker(bounds).addTo(viewermap);
  return layer;
}

function switchLayer(layerString) {
    mymap.removeLayer(currentLayer);
    mymap.addLayer(baseLayers[layerString]);
    currentLayer = baseLayers[layerString];
    currentLayerName = layerString;
}

// see if layer is contained in the layerGroup
function containsLayer(layergroup,layer) {
    let target=layergroup.getLayerId(layer);
    let layers=layergroup.getLayers();
    for(var i=0; i<layers.length; i++) {
      let id=layergroup.getLayerId(layers[i]);
      if(id == target) {
        return 1;
      }
    }
    return 0;
}

/***************** utilities ************************/
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

/***************** marker cluster ************************/
var use_markerCluster = 0;
var force_no_markerCluster=false;
var marker_cluster_uid=0;

function refresh_markerGroup(markers) {
   if(use_markerCluster) {
     markers.refreshClusters();
   }
}

function refresh_markerGroupCluster(myMarkerGroup, myMarker) {
  if(use_markerCluster) {
    let cluster = myMarkerGroup.getVisibleParent(myMarker);
    if(cluster != null) {
      myMarkerGroup.refreshClusters(cluster);
    }
  }
}

function _unbindClusterTooltip(ev) {
  ev.propagatedFrom.unbindTooltip();
}

function make_markerGroup(enableCluster=true) {

  window.console.log(" ===> a new markerGroup =====");
  if(enableCluster && !force_no_markerCluster) {
    use_markerCluster=true;
    } else {
      use_markerCluster=false;
      window.console.log(" ==== creating a marker feature group ===");
      var group=new L.FeatureGroup();
      group.cgm_cluster_cnt=0;
      return group;
  }

  window.console.log(" ==== creating a marker cluster group ===");
  let iconsize=7;
  var group=new L.markerClusterGroup(
        {
         maxClusterRadius: 1,
        /* default: marker-cluster-small, marker-cluster  */
         iconCreateFunction: function(cluster) {

           let zoom=mymap.getZoom();
           if(zoom < 5) {
             iconsize=7;
             } else {
                if(zoom > 10) {
                   iconsize=17;
                   } else {
                      let t=(0.2637 * zoom * zoom) - (1.978 * zoom) + 9.4032;
                      iconsize= (Math.round( t * 100))/100+1;
                }
           }

//window.console.log( "I am a cluster at >>"+marker_cluster_cnt++);
           var classname="cgm-cluster cgm-cluster-"+marker_cluster_uid;
           var clusterIcon=L.divIcon( { html: '',
                                        className: classname,
                                        iconSize: L.point(iconsize,iconsize) });
           marker_cluster_uid++;
           return clusterIcon;
         },
         showCoverageOnHover: false,
        });

        group.on('clustermouseover',
                function(ev) {
                    var myev=ev;
                    let cluster=myev.layer;
                    let desc = "contains "+cluster.getAllChildMarkers().length + " reference points,<br>click to expand";
                    myev.propagatedFrom.bindTooltip(desc,{sticky:true}).openTooltip();
                    setTimeout(function() {_unbindClusterTooltip(myev)},1000);
                    });
         group.on('clustermouseout',
                 function(ev) {
                    var myev=ev;
                    let cluster=myev.layer;
                    });

   return group;
}


/***************** utlities ****************************/
// let marker = L.circleMarker([latitude, longitude], site_marker_style.normal);
function makeLeafletCircleMarker(latlng, opt, cname=undefined) {

  if(cname != undefined) {
    opt.className=cname;
  }
  let marker= L.circleMarker(latlng, opt);
  return marker;
}


