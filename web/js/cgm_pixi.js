/***
   cgm_pixi.js
***/

try {
    var isFileSaverSupported = !!new Blob;
} catch (e) {
    window.console.log("FileSaver is not working!!!");
    abort();
}

/* marker's resizing size's zoom threshold */
var vs_zoom_threshold=7;

// pixi, Leafle.overlayLayer.js
/* data sections, to matching marker name markerN_icon.png */
const DATA_SEGMENT_COUNT= 20; // 0 to 19 -- to matching marker names

/* set are predefined by user, real is from the backend search */
var INSAR_min_v = -30;
var INSAR_max_v = 30;

var DATA_max_v=INSAR_min_v;
var DATA_min_v=INSAR_max_v;
var DATA_count=0;

/********************************************/
const INSAR_D071=0;
const INSAR_D173=1;
const INSAR_A064=2;
const INSAR_A166=3;

/* a place to park all the pixiOverlay from the session */
/* [ {"gid":gid, "vis":true, "layer": overlay,         */
/*    "top":pixiContainer,"inner":[ {"container":c0, "vis":1 }, ...]} ] */
var pixiOverlayList=[];

/* PixiOverlayLayer */
var pixiLayer = null;

/* expose pixiOverlay's util to global scope */
var pixi_project=null;

/* textures in a marker container                         */
/* [ markerTexture0, markerTexture1,... markerTexture19 ] */
var markerTextures=[];

var loadOnce=1;

function initMarkerTextures(resources) {
window.console.log("initMarkerTexutres..");
    markerTextures.push(resources.marker1.texture);
    markerTextures.push(resources.marker2.texture);
    markerTextures.push(resources.marker3.texture);
    markerTextures.push(resources.marker4.texture);
    markerTextures.push(resources.marker5.texture);
    markerTextures.push(resources.marker6.texture);
    markerTextures.push(resources.marker7.texture);
    markerTextures.push(resources.marker8.texture);
    markerTextures.push(resources.marker9.texture);
    markerTextures.push(resources.marker10.texture);
    markerTextures.push(resources.marker11.texture);
    markerTextures.push(resources.marker12.texture);
    markerTextures.push(resources.marker13.texture);
    markerTextures.push(resources.marker14.texture);
    markerTextures.push(resources.marker15.texture);
    markerTextures.push(resources.marker16.texture);
    markerTextures.push(resources.marker17.texture);
    markerTextures.push(resources.marker18.texture);
    markerTextures.push(resources.marker19.texture);
    markerTextures.push(resources.marker20.texture);
}

function printMarkerLatlngInfo(plist) {
  let sum=0;
  window.console.log("For: "+plist.gid);
  for(let i=0; i<DATA_SEGMENT_COUNT; i++) {
    let dlist=plist[i];
    sum=sum+data.length;
    window.console.log("    i: "+i+" count: "+ dlist.length);
  }
  window.console.log("  sum up :"+sum);
}

function updateMarkerLatlng(plist,idx,lat,lng) {
  let dlist=plist[idx];
  dlist.push({'lat':lat,"lng":lng});
}

function getMarkerCount(latlonlist,idx) {
  let dlist=latlonlist.data[idx];
  let sz=dlist.length;
  return sz;
}

function getMarkerLatlngs(latlonlist,idx) {
  let dlist=latlonlist.data[idx];
  return dlist;
}

function getRangeIdx(target) {

  let vs_min=INSAR_min_v;
  let vs_max=INSAR_max_v;
  let vs_target=target;

  if(vs_target <= vs_min) {
    return 0;  
  }
  if(vs_target >= vs_max) {
    return DATA_SEGMENT_COUNT-1;
  }
  var step = (vs_max - vs_min)/DATA_SEGMENT_COUNT;
  var offset= Math.floor((vs_target-vs_min)/step);

  return offset;
}

// from pixi,
//  >> Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
function init_pixi(loader) {
  pixiOverlayList=[];

  loader
    .add('marker1', 'img/marker1_icon.png')
    .add('marker2', 'img/marker2_icon.png')
    .add('marker3', 'img/marker3_icon.png')
    .add('marker4', 'img/marker4_icon.png')
    .add('marker5', 'img/marker5_icon.png')
    .add('marker6', 'img/marker6_icon.png')
    .add('marker7', 'img/marker7_icon.png')
    .add('marker8', 'img/marker8_icon.png')
    .add('marker9', 'img/marker9_icon.png')
    .add('marker10', 'img/marker10_icon.png')
    .add('marker11', 'img/marker11_icon.png')
    .add('marker12', 'img/marker12_icon.png')
    .add('marker13', 'img/marker13_icon.png')
    .add('marker14', 'img/marker14_icon.png')
    .add('marker15', 'img/marker15_icon.png')
    .add('marker16', 'img/marker16_icon.png')
    .add('marker17', 'img/marker17_icon.png')
    .add('marker18', 'img/marker18_icon.png')
    .add('marker19', 'img/marker19_icon.png')
    .add('marker20', 'img/marker20_icon.png');
}

function setup_pixi() {
  // this is used to simulate leaflet zoom animation timing:
  let loader = new PIXI.loaders.Loader();

  if(loadOnce) {
    init_pixi(loader);
  }

  loader.load(function(loader, resources) {
      if(loadOnce) {
        initMarkerTextures(resources);
        loadOnce=0;
      }
  })
  return loader;
}

// first retrieve data from external file and user 
// callback to build the layer
function makeOneBasePixiLayer(gid,file) {
   let rarray=retrieveTrack(gid, file, makePixiOverlayLayer,true);
   return rarray;
}

// retrieve data from extracted external data, call
// schronized get
function makeOnePixiLayer(gid,file) {
   let rarray=retrieveTrack(gid, file, makePixiOverlayLayer,false);
   return rarray;
}

function makeOnePixiLayerWrap(pixiLayer) {

  let ticker = new PIXI.ticker.Ticker();

  ticker.add(function(delta) { 
    pixiLayer.redraw({type: 'redraw', delta: delta});
  });

  viewermap.on('changestart', function() { ticker.start(); });
  viewermap.on('changeend', function() { ticker.stop(); });
  viewermap.on('zoomstart', function() { ticker.start(); });
  viewermap.on('zoomend', function() { ticker.stop(); });
  viewermap.on('zoomanim', pixiLayer.redraw, pixiLayer);

  return {"pixiLayer":pixiLayer,"max_v":DATA_max_v,"min_v":DATA_min_v,"count_v":DATA_count };
}

// toggle off a child container from an overlay layer
function toggleMarkerContainer(pixi,target_segment) {
  var plist=pixi['inner'];
  var top=pixi['top'];
  if(pixi["vis"]==false) {
    windown.console.log("layer not visible To TOGGLE!!\n");
    return;
  } 
  var clist=pixi['inner'];
  var top=pixi['top'];
  for(var j=0; j<DATA_SEGMENT_COUNT; j++) {
    var citem=clist[j];
    var cptr=citem["container"];
    if(cptr == target_segment) {
      if(citem["vis"]) { // toggle off
        citem["vis"]=0;
        top.removeChild(cptr);
        } else {
          citem["vis"]=1;
          top.addChild(cptr);
      }
      return;
    }
  }
}

// order everything into a sorted array
// break up data into buckets (one per segment)
/* {"gid":gid,"data":[ [{"lat":lat,"lng":lng},...], ...] } */
//  insar_baseline_A064_velocity_list.csv_part0 so forth
function _process_data(gid, blob) {

   DATA_max_v=INSAR_min_v;
   DATA_min_v=INSAR_max_v;
   DATA_count=0;

   let rawlist=[];
   let pixiLatlngList;
   let datalist=[];
   
   for(var i=0; i<DATA_SEGMENT_COUNT; i++) {
     datalist.push([]);
   }

   let tmp=blob.split("\n");
   let sz=tmp.length;
   window.console.log("size of data file is "+sz);

   for(let i=0; i<sz; i++) {
      let ll=tmp[i];
      if(ll[0]=='#') { // comment line
        continue;
      }	      
      let token=ll.split(",");
      if(token.length != 7) {
         if( i == (sz-1) ) { // last line
           continue;
         }
         window.console.log("invalid data in this line "+i+" >>"+token.length);
         window.console.log(" bad line: >>"+ll+"<<");
         continue;
      }
      let lon=parseFloat(token[0].trim());
      let lat=parseFloat(token[1].trim());
      let vel=token[2].trim();

      if(Number.isNaN(vel) || vel == "nan") { continue; }

      vel=parseFloat(vel);
      rawlist.push([vel,lat,lon]);
      if(vel > DATA_max_v)
          DATA_max_v=vel;
      if(vel < DATA_min_v)
          DATA_min_v=vel
   }


   // sort datalist
   let sorted_rawlist = rawlist.sort((a,b) => {
          return b[0] - a[0];
   });

   let sorted_vlist=sorted_rawlist.map(function(value,index){ return value[0]; });

   DATA_count=sorted_rawlist.length;
   for(let i=0; i<DATA_count; i++ ) {
      let item=sorted_rawlist[i];
      let lon=item[2];
      let lat=item[1];
      let vel=item[0];
      let idx=getRangeIdx(vel);
      updateMarkerLatlng(datalist,idx,lat,lon);
   }
   pixiLatlngList= {"gid":gid,"data":datalist} ; 

   window.console.log("data file, total data:"+DATA_count+"("+DATA_min_v+","+DATA_max_v+")");

   return pixiLatlngList;
}


function makePixiOverlayLayer(gid, blob) {

    let pixiLatlngList=_process_data(gid, blob);
	
    let zoomChangeTs = null;

    let pixiContainer = new PIXI.Container();
    let pContainers=[]; //particle container

    for(var i=0; i<DATA_SEGMENT_COUNT; i++) {
      var length=getMarkerCount(pixiLatlngList,i);
      var a = new PIXI.particles.ParticleContainer(length, {vertices: true});
      // add properties for our patched particleRenderer:
      a.texture = markerTextures[i];
      a.baseTexture = markerTextures[i].baseTexture;
      a.anchor = {x: 0.5, y: 1};
      pixiContainer.addChild(a);
      pContainers.push(a);
    }

    var doubleBuffering = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var initialScale;

    var overlay=L.pixiOverlay(function(utils, event) {
      var zoom = utils.getMap().getZoom();
      var container = utils.getContainer();
      var renderer = utils.getRenderer();
      pixi_project = utils.latLngToLayerPoint;
      var getScale = utils.getScale;
      var invScale = 1 / getScale();

//window.console.log("in L.pixiOverlay layer, auto zoom at "+zoom+" scale at>"+getScale()+" invScale"+invScale);

      if (event.type === 'add') {

// only add it first time
        if (foundOverlay(gid)) {
          return;
        }

        let mapcenter=viewermap.getCenter();
        let mapzoom=viewermap.getZoom();
        var origin = pixi_project([mapcenter['lat'], mapcenter['lng']]);
        initialScale = invScale / 16; // initial size of the marker
//initialScale = invScale / 2; // initial size of the marker

        // fill in the particles
        for(var i=0; i< DATA_SEGMENT_COUNT; i++ ) {
           var a=pContainers[i];
           a.x = origin.x;
           a.y = origin.y;
           a.localScale = initialScale;

           var latlngs=getMarkerLatlngs(pixiLatlngList,i);
           var len=latlngs.length;
           for (var j = 0; j < len; j++) {
              var latlng=latlngs[j];
              var ll=latlng['lat'];
              var gg=latlng['lng'];
//window.console.log("start latlon>>"+ll+" "+gg);
              var coords = pixi_project([ll,gg]);
              // our patched particleContainer accepts simple {x: ..., y: ...} objects as children:
//window.console.log("    and xy at "+coords.x+" "+coords.y);
              var aParticle=a.addChild({ x: coords.x - origin.x, y: coords.y - origin.y });

/**** trying it out 
              var marker = new PIXI.Sprite(markerTextures[9]);
              marker.popup = L.popup({className: 'pixi-popup'})
                                        .setLatLng(latlng)
                                        .setContent('<b>Hello world!</b><br>I am a popup.'+ latlng['lat']+' '+latlng['lng']).openOn(viewermap);
              pixiContainer.addChild(marker);
***/
//window.console.log( "      adding  child at..("+latlng['lat']+')('+latlng['lng']+')');
           }
        }
     }

      // change size of the marker after zoomin and zoomout
     if (event.type === 'zoomanim') {
        var targetZoom = event.zoom;
        if (targetZoom >= vs_zoom_threshold || zoom >= vs_zoom_threshold) {
          zoomChangeTs = 0;
          var targetScale = targetZoom >= vs_zoom_threshold ? (1 / getScale(event.zoom))/10  : initialScale;

//window.console.log(" ZOOManim.. new targetScale "+targetScale);

          pContainers.forEach(function(innerContainer) {
            innerContainer.currentScale = innerContainer.localScale;
            innerContainer.targetScale = targetScale;
          });
        }
        return null;
      }

      if (event.type === 'redraw') {
        var easing = BezierEasing(0, 0, 0.25, 1);
        var delta = event.delta;
        if (zoomChangeTs !== null) {
          var duration = 5; // 17
          zoomChangeTs += delta;
          var lambda = zoomChangeTs / duration;
          if (lambda > 1) {
            lambda = 1;
            zoomChangeTs = null;
          }
          lambda = easing(lambda);
          pContainers.forEach(function(innerContainer) {
            innerContainer.localScale = innerContainer.currentScale + lambda * (innerContainer.targetScale - innerContainer.currentScale);
          });
        } else { return null;}
      }

      renderer.render(container);
    }, pixiContainer, {
      doubleBuffering: doubleBuffering,
      destroyInteractionManager: true
    }).addTo(viewermap);

pixiOverlayList.push({"gid":gid,"vis":1,"overlay":overlay,"top":pixiContainer,"inner":pContainers,"latlnglist":pixiLatlngList});

    let rc=makeOnePixiLayerWrap(overlay);
    return rc;
}

function foundOverlay(mygid) {
  for(let i=0; i<pixiOverlayList.length; i++) {
     let pixi=pixiOverlayList[i];
     if(pixi["gid"] == mygid) {
       return 1;
     }
  }
  return 0;
}

function clearAllPixiOverlay() {
  pixiOverlayList.forEach(function(pixi) {
    if(pixi !=null || pixi.length !=0) {
      if(pixi["vis"]==1) {
        var layer=pixi["overlay"];
        viewermap.removeLayer(layer);
        pixi["vis"]=0;
      }
    }
  });
}

function togglePixiOverlay(mygid) {
window.console.log("togglePixiOverlay.."+mygid);
  for(let i=0; i<pixiOverlayList.length; i++) {
     let pixi=pixiOverlayList[i];
     if(pixi["gid"] == mygid) {
       let v=pixi["vis"];
       let layer=pixi["overlay"];
       if(v==1) {
         pixi["vis"]=0;
         viewermap.removeLayer(layer);
         } else {
           viewermap.addLayer(layer);
           pixi["vis"]=1;
       }
       return;
     }
  }
}

function eyePixiOverlay(mygid) {
  for(let i=0; i<pixiOverlayList.length; i++) {
     let pixi=pixiOverlayList[i];
     if(pixi["gid"] == mygid) {
       let v=pixi["vis"];
       let layer=pixi["overlay"];
       return pixi["vis"];
     }
  }
  return -1;
}
