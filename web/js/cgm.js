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

      CGM_GNSS.setupInterface();
      $("#cgm-model-insar").click();
    };

    this.gotZoomed = function(zoom) {
      if(CGM_GNSS.visibleGNSS()) {
        CGM_GNSS.gotZoomed(zoom); 
      }
    };
};

