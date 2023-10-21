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


    this.resetCGM = function() {
      // if insar, just click to gnss
      if(activeProduct == Products.INSAR) {
        $("#data-product-select").val('gnss');
        } else { // if gnss, call gnss.reset
	   CGM_GNSS.reset();
      }
    }
};

