/***
   cgm_model.js
***/

var CGM = new function () {

    this.defaultMapView = {
        // coordinates: [34.3, -118.4],
        coordinates: [34.16, -118.57],
        zoom: 7
    };

    this.setupCGMInterface = function() {
         if (activeProduct == Products.GNSS) {
            CGM_GNSS.setupCGMInterface();
            } else {
               CGM_INSAR.setupCGMInterface();
         }
    }
}
