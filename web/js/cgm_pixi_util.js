/***
   cgm_pixi_util.js

   cgm specific code/data for cxm_pixi.js

***/

/* marker's resizing size's zoom threshold */
var vs_zoom_threshold=7;

// pixi, Leafle.overlayLayer.js
/* data sections, to matching marker name markerN_icon.png */
/* How many segments to chunk a set of csm data */
const CGM_DEFAULT_DATA_SEGMENT_COUNT= 20;
const DATA_SEGMENT_COUNT= 20; // 0 to 19 -- to matching marker names

var cgm_pixi_cmap_tb={
  data_rgb: [
    { type:"INSAR",
      rgbs: [ "rgb(0,0,77)",
              "rgb(0,0,166)",
              "rgb(0,0,255)",
              "rgb(102,102,255)",
              "rgb(166,166,255)",
              "rgb(230,230,255)",
              "rgb(255,230,230)",
              "rgb(255,166,166)",
              "rgb(255,102,102)",
              "rgb(255,0,0)",
              "rgb(166,0,0)",
              "rgb(77,0,0)"]},
};
       
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
  let cmaps=csm_pixi_cmap_tb.data_rgb;
  let cmap=cmaps[rgb_set];
  return cmap.rgbs;
}

function getParticleTextures(rgb_set) {
    switch(rgb_set)  {
      case 0:
        return particleTexturesSet0;
      case 1:
        return particleTexturesSet1;
      case 2:
        return particleTexturesSet2;
      default:
        window.console.log("BAD..");
        return null;
    }
}

