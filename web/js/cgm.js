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

    this.searchLatlonAgain = function() {
      if(_visibleGNSS()) {
        CGM_GNSS.searchLatlon(0,[]); 
      }
      if(_visibleINSAR()) {
        CGM_INSAR.searchLatlon(0,[]); 
      }
    };

    this.switchDataset = function(val) {

       if(activeProduct == Products.GNSS) {
window.console.log("==> reset what was there/GNSS");
          CGM_GNSS.reset();
       } else {
window.console.log("==> reset what was there/INSAR");
          CGM_INSAR.reset();
       }
// set to new interface
       if (val == 'gnss') { CGM_GNSS.setupInterface(); }
       if (val == 'insar') { CGM_INSAR.setupInterface(); }
    };


    this.gotZoomed = function(zoom) {
      if(_visibleGNSS()) {
        CGM_GNSS.gotZoomed(zoom); 
      }
      if(_visibleINSAR()) {
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

