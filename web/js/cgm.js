/***
   cgm.js

   umbrella for CGM_GNSS and CGM_INSAR

***/

var CGM = new function () {

    this.model_debug = 0;
    this.model_initialized = false;

    this.setupCGMInterface = function() {
      CGM_GNSS.generateLayers();
      CGM_INSAR.generateLayers();
window.console.log("HERE...");

      CGM_GNSS.setupInterface();
      $("#cgm-model-insar").click();
    };


    this.resetCGM = function() {
      // if insar, call insar.reset
      if(activeProduct == Products.INSAR) {
	CGM_INSAR.reset();
        } else { // if gnss, call gnss.reset
	   CGM_GNSS.reset();
      }
    }
};

