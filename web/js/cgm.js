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
      if(visibleGNSS()) {
        CGM_GNSS.gotZoomed(zoom); 
      }
      if(visibleINSAR()) {
        CGM_INSAR.gotZoomed(zoom); 
      }
    };

    function _visibleINSAR() {
      let $cgm_model_checkbox = $("#cgm-model-insar");
      if ($cgm_model_checkbox.prop('checked')) {
        return 1;
      }
      return 0;
    };

    function _visibleGNSS() {
      let $cgm_model_checkbox = $("#cgm-model-gnss");
      if ($cgm_model_checkbox.prop('checked')) {
        return 1;
      }
      return 0;
    };


};

