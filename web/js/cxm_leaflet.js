// This is leaflet specific utilities
var rectangle_options = {
       showArea: false,
         shapeOptions: {
              stroke: true,
              color: "blue",
              weight: 2,
              opacity: 0.5,
              fill: true,
              fillColor: null, //same as color by default
              fillOpacity: 0.08,
              clickable: false
         }
};
var rectangleDrawer;
var mymap, baseLayers, layerControl, currentLayer, currentLayerName;
var visibleFaults = new L.FeatureGroup();

var drawing_rectangle=false;

function clear_popup()
{
  viewermap.closePopup();
}

function refresh_map()
{
  if (viewermap == undefined) {
    window.console.log("refresh_map: BAD BAD BAD");
    } else {
      viewermap.setView([34.3, -118.4], 7);
  }
}

function setup_viewer()
{
// esri
  var esri_topographic = L.esri.basemapLayer("Topographic");
  var esri_imagery = L.esri.basemapLayer("Imagery");
  var esri_ng = L.esri.basemapLayer("NationalGeographic");

// otm topo
  var topoURL='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
  var topoAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreeMap</a> contributors,<a href=http://viewfinderpanoramas.org"> SRTM</a> | &copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a>(CC-BY-SA)';
 L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution})

  var otm_topographic = L.tileLayer(topoURL, { detectRetina: true, attribution: topoAttribution});

// osm street
  var openURL='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var openAttribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  var osm_street=L.tileLayer(openURL, {attribution: openAttribution});
  var shadedRelief =  L.esri.basemapLayer("ShadedRelief");

  baseLayers = {
    "esri topo" : esri_topographic,
    "esri NG" : esri_ng,
    "esri imagery" : esri_imagery,
    "otm topo": otm_topographic,
    "osm street" : osm_street,
    "shaded relief": shadedRelief
  };
  var overLayer = {};
  var basemap = L.layerGroup();
  currentLayer = esri_topographic;
  currentLayerName = 'esri topo';

// ==> mymap <==
  mymap = L.map('CGM_plot', { drawControl:false, layers: [esri_topographic, basemap], zoomControl:true} );
  mymap.setView([34.3, -118.4], 7);

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

/* TODO
 watermark XXX
  L.Control.Watermark = L.control.extend({
    onAdd: function (map) {
      var img=L.DomUtil.create('img');
      img.src = './css/images/logo.png';
      img.stuyle.width ='200px';
      return img;
    },
    onRemove: function(map) {
       // no-op
    }
  });
  L.control.watermark= function(opts) {
     return new L.Control.Watermark(opts);
  }
*/

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
  rectangleDrawer = new L.Draw.Rectangle(mymap, rectangle_options);
  mymap.on(L.Draw.Event.CREATED, function (e) {
    var type = e.layerType,
        layer = e.layer;
    if (type === 'rectangle') {  // only tracks retangles
        // get the boundary of the rectangle
        var latlngs=layer.getLatLngs();
        // first one is always the south-west,
        // third one is always the north-east
        var loclist=latlngs[0];
        var sw=loclist[0];
        var ne=loclist[2];
        add_bounding_rectangle_layer(layer,sw['lat'],sw['lng'],ne['lat'],ne['lng']);
        mymap.addLayer(layer);
        if (activeModel == Models.CGM) {
            $("div#wait-spinner").show(400, function(){
                CGM.searchBox(CGM.searchType.latlon, [sw['lat'], sw['lng'], ne['lat'], ne['lng']]);
            });
        }
    }
  });


// finally,
  return mymap;
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

function addGeoToMap(aTrace) {

   var geoLayer=L.geoJSON(aTrace, {
     style: function(feature) {
        var tmp=feature.properties.style;
        if (feature.properties.style != undefined) {
            return feature.properties.style;
        } else {
            return {...defaultStyle}
        }
     },
   });
   visibleFaults.addLayer(geoLayer);

  return geoLayer;
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


