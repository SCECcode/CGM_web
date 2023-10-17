/***
   cgm_pixi_util.js

   cgm specific code/data for cxm_pixi.js

***/

/* marker's resizing size's zoom threshold */
var vs_zoom_threshold=7;

// pixi, Leafle.overlayLayer.js
/* How many segments to chunk a set of cgm data */
const CGM_DEFAULT_DATA_SEGMENT_COUNT= 12;

/* there are 1 different particleTextures set.. */
const CGM_TEXTURE_SETS= 1;
var particleTexturesSet0=[];

var cgm_pixi_cmap_tb={
  data_rgb: [
    { type:0,
      note: "for INSAR",
      rgbs: [ 
	      "rgb(140,62.125,115.75)",
              "rgb(143,71,153.25)",
              "rgb(133.25,87.125,187.75)",
              "rgb(114.25,109.87,211.87)",
              "rgb(91.125,137.38,211.88)",
              "rgb(70.875,167,216)",
              "rgb(59.125,194.25,193.88)",
              "rgb(64.125,214.88,161.88)",
              "rgb(84.75,226.75,129.38)",
              "rgb(120.12,230.75,105.13)",
              "rgb(165.62,226.12,95.625)",
              "rgb(211.12,217.38,106.37)"
              ]},
  ]};
       
/********************************************/
/* set are predefined by user, real is from the backend search */
var INSAR_min_v = -30;
var INSAR_max_v = 30;

var DATA_max_v=INSAR_min_v;
var DATA_min_v=INSAR_max_v;
var DATA_count=0;

const INSAR_D071=0;
const INSAR_D173=1;
const INSAR_A064=2;
const INSAR_A166=3;

/********************************************/

function cgm_init_pixi() {

  pixi_cmap_tb=cgm_pixi_cmap_tb;
  PIXI_DEFAULT_DATA_SEGMENT_COUNT=CGM_DEFAULT_DATA_SEGMENT_COUNT;
  PIXI.settings.ROUND_PIXELS=true;

// setup list for SHmax, Aphi, Iso, Dif
  let rgblist=getSegmentParticleRGBList(0);
  for(let i =0; i< rgblist.length; i++) {
    let name="particleSet0_"+i;
    let rgb=rgblist[i];
    let texture=pixiCreateBaseTexture(rgb,name);
    particleTexturesSet0.push(texture);
  }
}

function getSegmentParticleRGBList(rgb_set) {
  let cmaps=cgm_pixi_cmap_tb.data_rgb;
  let cmap=cmaps[rgb_set];
  return cmap.rgbs;
}

function getParticleTextures(rgb_set) {
    switch(rgb_set)  {
      case 0:
        return particleTexturesSet0;
      default:
        window.console.log("BAD..");
        return null;
    }
}

// spec data:
//  { 'seg_cnt' : 20};
//  data_min
//  data_max
//  data_count;
//  rgb_set : 0
//  scale_hint: 2
//
function makeOnePixiLayer(gid,file) {

  let pixi_spec = { seg_cnt: CGM_DEFAULT_DATA_SEGMENT_COUNT,
                    rgb_set:0,
                    scale_hint:1 };

  let pixiuid = makePixiOverlayLayerWithFile(gid,file, pixi_spec);
  if(pixiuid == null) {
     window.console.log("makeOnePixiLayer: bad, faild to make a pixi layer");
     return {};
  }

  var pixiLayer= pixiFindPixiWithUid(pixiuid);
  var maxv=pixi_spec.data_max;
  var minv=pixi_spec.data_min;
  var cntv=pixi_spec.data_count;

  return {"pixiuid":pixiuid, "pixiLayer":pixiLayer,"max_v":maxv,"min_v":minv,"count_v":cntv };
}
