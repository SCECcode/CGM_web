<?php
require_once("php/navigation.php");
require_once("php/CGM_GNSS.php");
require_once("php/CGM_INSAR.php");

$header = getHeader("Viewer");
$cgm_gnss = new CGM_GNSS();
$cgm_insar = new CGM_INSAR();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Community Geodetic Viewer (Provisional)</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/vendor/font-awesome.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/leaflet.awesome-markers.css">
    <link rel="stylesheet" href="css/vendor/leaflet.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/vendor/all.css">
    <link rel="stylesheet" href="css/cgm-ui.css?v=1">

    <script type="text/javascript" src="js/vendor/leaflet.js" crossorigin=""></script>
    <script type='text/javascript' src='js/vendor/leaflet.awesome-markers.min.js'></script>
    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <script type='text/javascript' src='js/vendor/esri-leaflet.js'></script>
    <script type='text/javascript' src='js/vendor/esri-leaflet-vector.js' crossorigin=""></script>

    <script type='text/javascript' src='js/vendor/FileSaver.js'></script>
    <script type='text/javascript' src='js/vendor/jszip.js'></script>
    <script type='text/javascript' src='js/vendor/togeojson.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet-kmz-src.js'></script>
    <script type='text/javascript' src='js/vendor/leaflet.markercluster-src.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.floatThead.min.js'></script>
    <script type='text/javascript' src='js/vendor/html2canvas.js'></script>

    <link rel="stylesheet" href="js/vendor/plugin/Leaflet.draw/leaflet.draw.css">
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Leaflet.draw.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Leaflet.Draw.Event.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Toolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Tooltip.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/GeometryUtil.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/LatLngUtil.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/LineUtil.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/Polygon.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/Polyline.Intersect.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/ext/TouchEvents.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/DrawToolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Feature.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.SimpleShape.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Polyline.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Marker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Circle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.CircleMarker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Polygon.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/draw/handler/Draw.Rectangle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/EditToolbar.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/EditToolbar.Edit.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/EditToolbar.Delete.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/Control.Draw.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Poly.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.SimpleShape.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Rectangle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Marker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.CircleMarker.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/Leaflet.draw/edit/handler/Edit.Circle.js"></script>
    <script type='text/javascript' src="js/vendor/plugin/leaflet.polylineDecorator.js"></script>

<!-- cgm js -->
    <script type="text/javascript" src="js/cgm_ui.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_leaflet.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_insar.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_gnss.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_main.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_model.js?v=1"></script>
    <script type="text/javascript" src="js/cgm.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_viewTS.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_viewTS_util.js?v=1"></script>

<!-- pixi pixiOverlay -->
    <script type="text/javascript" src="js/vendor/pixi.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/L.PixiOverlay.js"></script>
    <script type="text/javascript" src="js/cxm_pixi.js"></script>
    <script type="text/javascript" src="js/cgm_pixi_util.js"></script>

<!-- cxm js -->
    <script type="text/javascript" src="js/cxm_kml.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_model_util.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_misc_util.js?v=1"></script>
<!-- camera
    <script type="text/javascript" src="js/cxm_html2canvas.js?v=1"></script>
-->

<!-- Global site tag (gtag.js) - Google Analytics --> 
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-495056-12"></script>
    <script type="text/javascript">
        $ = jQuery;
        var tableLoadCompleted = false;
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'UA-495056-12');

        $(document).on("tableLoadCompleted", function () {
            tableLoadCompleted = true;

            var $download_queue_table = $('#metadata-viewer');
            $download_queue_table.floatThead({
                scrollContainer: function ($table) {
                    return $table.closest('div#metadata-viewer-container');
                },
            });

        });
    </script>

</head>
<body>
<?php echo $header; ?>

<div class="container">

<div class="main" id="cgmMain">

   <div style="display:none">
      <button id="snapBtn" class="btn cxm-small-btn" onClick="toSnap()">
                <span class="glyphicon glyphicon-camera"></span></button>
   </div>

<!-- top-intro -->
   <div id="top-intro" style="display:">
<p>The SCEC Community Geodetic Model provides displacement time series and velocities of the Earth’s surface over southern California using data from Global Navigation Satellite Systems (GNSS), which includes the Global Positioning System (GPS), and interferometric synthetic aperture radar (InSAR), both space-based geodetic observation techniques.</p>
   </div>

<!-- leaflet control -->
   <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
        </div>
   </div>

<!-- top-control -->
   <div id="top-control">
      <div id="cgm-controls-container" class="row d-flex mb-0">

<!-- top-control-row-1 -->
        <div id="top-control-row-1" class="col-12">
        </div> <!-- top-control-row-1 -->

<!-- top-control-row-2 -->
        <div id="top-control-row-2" class="col-12 mb-1 mt-2">

          <div class="row justify-content-end">
            <div id='model-options' class="form-check-inline">

              <div class="form-check form-check-inline">
                <label class='form-check-label'
                       title="Show GNSS stations"
                       for="cgm-model-gnss">
                <input class='form-check-inline mr-1'
                       type="checkbox"
                       id="cgm-model-gnss"/>GNSS
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                       title="Show GNSS vectors"
                       for="cgm-model-gnss-vectors">
                <input class='form-check-inline mr-1'
                       type="checkbox"
                       id="cgm-model-gnss-vectors" value="1" />GNSS vectors
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                       title="Show INSAR tracks"
                       for="cgm-model-insar">
                <input class='form-check-inline mr-1'
                       type="checkbox"
                       id="cgm-model-insar" value="1" />InSAR
                </label>
              </div>

              <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                       title="Show Community Fault Model v6.0 traces on map"
                       for="cxm-model-cfm">
                <input class='form-check-inline mr-1'
                       type="checkbox"
                       id="cxm-model-cfm" value="1" />CFM6.0
                </label>
              </div>
              <div class="form-check form-check-inline">
                <label class='form-check-label ml-1 mini-option'
                      title="Show the Geologic Framework Model regions on map"
                               for="cxm-model-gfm">
                <input class='form-check-inline mr-1'
                               type="checkbox"
                      id="cxm-model-gfm" value="1" />GFM
                </label>
              </div>
            </div>

<!-- KML/KMZ overlay -->
            <div id="kml-row" class="col-2">
<div class="row" style="width:20rem;">
              <input id="fileKML" type='file' multiple onchange='uploadKMLFile(this.files)' style='display:none;'></input>
              <button id="kmlBtn" class="btn"
                      onclick='javascript:document.getElementById("fileKML").click();'
                      title="Upload your own kml/kmz file to be displayed on the map interface. We currently support points, lines, paths, polygons, and image overlays (kmz only)."
                      style="color:#395057;background-color:#f2f2f2;border:1px solid #ced4da;border-radius:0.2rem;padding:0.15rem 0.5rem;"><span>Upload kml/kmz</span></button>
              <button id="kmlSelectBtn" class="btn cxm-small-no-btn"
                      title="Show/Hide uploaded kml/kmz files"
                      style="display:none;" data-toggle="modal" data-target="#modalkmlselect">
                      <span id="eye_kml"  class="glyphicon glyphicon-eye-open"></span></button>
</div>
            </div> <!-- end of kml -->

<!-- basemap -->
            <div class="input-group input-group-sm custom-control-inline" id="map-controls" style="margin-right:15px">
              <div class="input-group-prepend">
                <label style='border-bottom:1;' class="input-group-text" for="mapLayer">Select Map Type</label>
              </div>
              <select id="mapLayer" class="custom-select custom-select-sm"
                                               onchange="switchLayer(this.value);">
                  <option selected value="esri topo">ESRI Topographic</option>
                  <option value="esri imagery">ESRI Imagery</option>
                  <option value="jawg light">Jawg Light</option>
                  <option value="jawg dark">Jawg Dark</option>
                  <option value="osm streets relief">OSM Streets Relief</option>
                  <option value="otm topo">OTM Topographic</option>
                  <option value="osm street">OSM Street</option>
                  <option value="esri terrain">ESRI Terrain</option>
              </select>
            </div> <!-- end of basemap -->
          </div> <!-- row -->
        </div> <!-- top-control-row2 -->

      </div> <!-- cgm-controls-container -->
    </div> <!-- top-control -->

<!-- map space -->
    <div id="mapDataBig" class="row mapData">

       <div id="dataProductSelect" class="col-5 button-container flex-column pr-0" style="overflow:hidden;">
<!-- search method -->
         <div class="row">
             <div class="col-9">
               <form id="cgm-data-product">
                 <label><input type="radio" id="productTypeGNSS" name="producttype" onclick="CGM.switchDataset('gnss')" checked="checked"><span>GNSS</span></label>
                 <label><input type="radio" id="productTypeINSAR" name="producttype" onclick="CGM.switchDataset('insar')"><span>InSAR</span></label>
               </form>
             </div>

             <div id="cgm-reset-btn" class="col-2">
               <div class="row justify-content-end">
               <button id="toReset" type="button" class="btn btn-dark" style="width:110px">Reset</button>
               </div>
             </div>
         </div>
      

<!-- GNSS control -->
         <div id="cgm-gnss-controlers-container" class="gnss-select-group input-group input-group-sm custom-control-inline mt-2" style="max-width:450px">
            <div class="input-group-prepend">
                  <label class="input-group-text" for="gnss-search-select">Search GNSS by</label>
            </div>
	    <select id="gnss-search-select" class="custom-select custom-select-sm">
                   <option selected value="stationname">Station Name</option>
                   <option value="latlon">Latitude &amp; Longitude Box</option>
                   <option value="vectorslider">Vector Range</option>
            </select>
         </div> <!-- gnss search select -->

<!-- INSAR control -->
         <div id="insar-track-controls" class="insar-select-group input-group input-group-sm custom-control-inline mt-2" style="max-width:450px;display:none" >
            <div class="input-group-prepend">
                  <label class="input-group-text" for="insar-track-select">Select InSAR Track</label>
            </div>
	    <select id="insar-track-select" class="custom-select custom-select-sm">
                   <option selected value="D071">D071</option>
                   <option value="D173">D173</option>
                   <option value="A064">A064</option>
                   <option value="A166">A166</option>
            </select>
         </div> <!-- insar track select -->

         <div id="cgm-insar-controlers-container" class="insar-select-group input-group input-group-sm custom-control-inline mt-2" style="max-width:450px;display:none">
            <div class="input-group-prepend">
                  <label class="input-group-text" for="insar-search-select">Search INSAR by</label>
            </div>
            <select id="insar-search-select" class="custom-select custom-select-sm">
                   <option selected value="location">Point Location</option>
                   <option value="latlon">Latitude &amp; Longitude Box</option>
            </select>
         </div> <!-- insar search select -->

<!-- opacity slider TODO -->
         <div class="input-group input-group-sm custom-control-inline mt-2" style="display:none;max-width:450px">
            <div class="input-group-prepend">
                  <label class="input-group-text">Change Opacity</label>
            </div>
            <div class="row" style="min-width:300px;margin:5px 0px 0px 20px;">
                0%
	          <div class="col-8" id="opacitySlider" style="margin:5px 15px 5px 15px;border:1px solid rgb(206,212,218)">
                     <div id="opacitySlider-handle" class="ui-slider-handle"></div>
                  </div>
                100%
            </div>
         </div>

<!-- GSNSS search-option -->
         <div id="gnss-control-options" class="col-12 mt-4" >
            <ul class="navigation col-11" style="padding: 0 0 0 0;margin-bottom: 0">
              <li id='cgm-gnss-station-name' class='navigationLi ' style="border:1px solid green;display:">
                 <div class='menu'>
                   <div class="row">
                      <div class="col-5">
                          <p>Select on the map<br>or enter the name</p>
                      </div>
		      <div class="col-7">
                        <input id="cgm-gnss-stationTxt" type="text"
                               placeholder="Station followed by Enter key"
                               class="cgm-search-item form-control"
                               onkeypress="javascript:if (event.key == 'Enter') $('.cgm-search-item').mouseout();"
                               style="width:200px;margin-left:5px;">
                      </div>
                   </div>
                 </div>
              </li>
              <li id='cgm-gnss-vector-slider' class='navigationLi' style="border:1px solid blue;display:none">
                 <div class='menu'>
                   <div class="row">
                      <div class="col-5">
                          <p>Select a vector range on the slider or enter the two boundaries</p>
                      </div>
                      <div class="col-7">
                         <div class="form-inline vector-slider-input-boxes">
                             <input type="text"
                                    id="cgm-minVectorSliderTxt"
                                    title="min vector slider"
                                    class="cgm-search-item form-control">
                             <input type="text"
                                     id="cgm-maxVectorSliderTxt"
                                     title="max vector slider"
                                     class="cgm-search-item form-control">
                             <div class="col-12 mt-3 pr-0 pl-0" style="border:solid 1px green">
                                <div id="slider-vector-range" style="border:2px solid black"></div>
	                        <div id="min-vector-slider-handle" class="ui-slider-handle"></div>
	                        <div id="max-vector-slider-handle" class="ui-slider-handle"></div>
                             </div>
                         </div> 
                      </div>
                   </div>
                 </div>
              </li>
              <li id='cgm-gnss-latlon' class='navigationLi' style="border:1px solid blue;display:none;">
                <div class='menu'>
                  <div class="row">
                    <div class="col-6">
		      <p>Draw a rectangle on the map or enter latitudes and longitudes. Note: Use negative longitudes for California.
                      </p>
                    </div>
                    <div class="col-3 pl-0 pr-2">
                      <input type="text"
                          placeholder="Min Latitude"
                          id="cgm-gnss-firstLatTxt"
                          title="min latitude"
                          class="cgm-search-item form-control">
                      <input type="text" 
                          id="cgm-gnss-firstLonTxt" 
                          placeholder='Min Longitude' 
                          title="min longitude"
                          class="cgm-search-item form-control mt-1">
<!--
                      <div class="row pl-3 pr-2 mt-2">
                         <button id="toResetGNSSRegion" type="button" class="btn btn-dark" style="width:110px" onclick="CGM.clearLatlon()">Reset Region</button>
                       </div>
-->
                    </div>
                    <div class="col-3 pl-2 pr-0">
                      <input type="text" style="width:105px"
                          id="cgm-gnss-secondLatTxt"
                          title="max latitude"
                          placeholder='Max Latitude'
                          class="cgm-search-item form-control">
                      <input type="text" style="width:105px"
                          id="cgm-gnss-secondLonTxt"
                          title="max longitude"
                          placeholder='Max Longitude'
                          class="cgm-search-item form-control mt-1">
                      <div class="row pl-3 pr-0 mt-2">
                          <button type="button" class="btn btn-dark" style="width:110px" onclick="CGM.searchLatlonAgain()" >Get Data</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
	    </ul> 
         </div> <!-- gnss-control-options -->

         <div id="insar-search-options" class="col-12 mt-4" >
            <ul class="navigation col-11" style="padding: 0 0 0 0;margin-bottom: 0">
              <li id='cgm-insar-location' class='navigationLi' style="border:1px solid orange;display:none">
                <div class='menu'>
                  <div class="row">
                    <div class="col-5">
                        <p>Select a location on the map or enter latitude and longitude</p>
                    </div>
                    <div class="col-7">
                        <div class="form-inline latlon-input-boxes">
                          <input type="text"
                                 placeholder='Latitude'
                                 id="cgm-LatTxt"
                                 title="lat"
                                 class="cgm-search-item form-control">
                          <input type="text" 
                                 placeholder='Longitude' 
                                 id="cgm-LonTxt" 
                                 title="lon"
                                 class="cgm-search-item form-control">
                        </div>
                      </div>
                   </div>
                </div>
              </li>
              <li id='cgm-insar-latlon' class='navigationLi' style="border:1px solid blue;display:none;">
                <div class='menu'>
                  <div class="row">
                    <div class="col-6">
		      <p>Draw a rectangle on the map or enter latitudes and longitudes. Note: Use negative longitudes for California.
                      </p>
                    </div>
                    <div class="col-3 pl-0 pr-2">
                      <input type="text"
                          placeholder="Min Latitude"
                          id="cgm-insar-firstLatTxt"
                          title="min latitude"
                          class="cgm-search-item form-control">
                      <input type="text" 
                          id="cgm-insar-firstLonTxt" 
                          placeholder='Min Longitude' 
                          title="min longitude"
                          class="cgm-search-item form-control mt-1">
<!--
                      <div class="row pl-3 pr-2 mt-2">
                         <button id="toResetINSARRegion" type="button" class="btn btn-dark" style="width:110px" onclick="CGM.clearLatlon()">Reset Region</button>
                       </div>
-->
                    </div>
                    <div class="col-3 pl-2 pr-0">
                      <input type="text" style="width:105px"
                          id="cgm-insar-secondLatTxt"
                          title="max latitude"
                          placeholder='Max Latitude'
                          class="cgm-search-item form-control">
                      <input type="text" style="width:105px"
                          id="cgm-insar-secondLonTxt"
                          title="max longitude"
                          placeholder='Max Longitude'
                          class="cgm-search-item form-control mt-1">
                      <div class="row pl-3 pr-0 mt-2">
                          <button type="button" class="btn btn-dark" style="width:110px" onclick="CGM.searchLatlonAgain()" >Get Data</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul> 
         </div> <!-- insar-search-options -->

<!-- description page -->
         <div id="cgm-description" class="col-12 pr-0" style="display:;font-size:14px; background-color:rgb(245,245,245); max-width:450px" >
           <br>
           <p><b>You Selected:</b></p>
           <p id="cgm-product-description"></p>
           <p id="cgm-product-download"></p>
           <p>For more complete product details, see  <a href="https://doi.org/10.5281/zenodo.foo">CGM archive</a></p>
         </div>

<!-- result parking location -->
         <div id="parkingLot" style="display:none">
            <div id="phpResponseTxt"></div>
         </div>

       </div> <!-- searchDataControl -->

<!-- leaflet 2D map -->
       <div id="top-map" class="col-7 pl-1">
          <div class="w-100 mb-1" id='CGM_plot'
             style="position:relative;border:solid 1px #ced4da; height:576px;">

<!-- spinner -->
             <div class="spinDialog" style="position:absolute;top:40%;left:50%; z-index:9999;">
               <div id="wait-spinner" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
             </div>

<!-- legend --> 
             <div class="main-legend geometry top center" style="bottom:10%;background-color: rgba(255,255,255,0.5);">
               <div class="col">
                  <div class="row" style="margin:0px 2px 0px -20px">
                    <div class="legend mt-2" id="pixi-legend-color"></div> 
                    <div class="legend" id="pixi-legend-label"></div> 
                  </div>
                  <div id="pixi-legend-title" align="center" class="legend content mt-1" style="border-top:2px solid grey"></div>
               </div>
             </div> <!-- legend -->

          </div>
       </div>

    </div> <!-- mapDataBig -->

    <div id="top-select" class="row mb-2">
       <div class="col-12">
          <div id="metadata-viewer-container" style="border:solid 1px #ced4da; overflow-x:hidden">
             <table id="metadata-viewer">
               <thead>
                 <tr> </tr>
               </thead>
               <tbody>
                  <tr id="placeholder-row">
                     <td colspan="11">Metadata for selected piont will appear here. </td>
                  </tr>
                </tbody>
              </table>
          </div>
       </div>
    </div> <!-- top-select -->

</div> <!-- main cgmMain -->

<div id="expand-view-key-container" style="display:none;">
  <div id="expand-view-key" class="row" style="opacity:0.8; height:1.4rem;">
    <button id="bigMapBtn" class="btn cxm-small-btn" title="Expand into a larger map" style="border:0;color:black;background-color:rgb(255,255,255);padding: 0rem 0.3rem 0rem 0.3rem" onclick="toggleBigMap()"><span class="fas fa-expand"></span>
    </button>
  </div>
</div>

<!-- modal list -->

<!--Modal: Model (modalkmlselect) -->
<div class="modal" id="modalkmlselect" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-small" id="modalkmlselectDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalkmlselectContent">
      <!--Body-->
      <div class="modal-body" id="modalkmlselectBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="kmlselectTable-container" style="font-size:14pt"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalkmlselect-->

<!--Modal: Model(modalinotify) -->
<div class="modal" id="modalnotify" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-small" id="modalnotifyDialog" role="document">
    <!--Content-->
    <div class="modal-content" id="modalnotifyContent">
      <!--Body-->
      <div class="modal-body" id="modalnotifyBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" style="font-size:14pt">
            <p id="notify-container">blah blah</p>
          </div>
        </div>
      </div>
    </div> <!--Content-->
  </div>
</div> <!--Modal: modalnotify-->

<!--Modal: Model(modalinfoTS) -->
<div class="modal" id="modalinfoTS" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-xlg" id="modalinfoTSDialog" role="document">
    <!--Content-->
    <div class="modal-content" id="modalinfoTSContent">
      <!--Body-->
      <div class="modal-body" id="modalinfoTSBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="infoTSTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal" onclick="$('#modalTS').modal('show');"
>Close</button>
      </div>
    </div> <!--Content-->
  </div>
</div> <!--Modal: modalinfoTS -->

<!--Modal: Model(modalwarnTS) -->
<div class="modal" id="modalwarnTS" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalwarnTSDialog" role="document">
    <!--Content-->
    <div class="modal-content" id="modalwarnTSContent">
      <!--Body-->
      <div class="modal-body" id="modalwarnTSBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="warnTSTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>
    </div> <!--Content-->
  </div>
</div> <!--Modal: modalwarnTS-->

<!--Modal: Name Azimuth  -->
<div class="modal" id="modalazimuth" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalazimuthDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalazimuthContent">
      <!--Body-->
      <div class="modal-body" id="modalazimuthBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
         <p> Talk about what is this azimuth about...</p>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: Azimuth-->


<!--Modal: Name TS(time series)-->
<div class="modal" id="modalTS" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="modalTS" aria-hidden="true">
  <div class="modal-dialog modal-full" id="modalTSDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalTSContent">
      <!--Header-->
      <div class="modal-header">
        <button id="viewTSTogglebtn" class="btn btn-outline-primary btn-sm" type="button" onclick="toggleTSview()">Switch Frame Type</button>
      </div>

      <!--Body-->
      <div class="modal-body" id="modalTSBody">
        <div id="iframe-container" class="row col-12" style="overflow:hidden;">
          <iframe id="viewTSIfram" title="SCEC CGM Time series viewer" src="" onload="setIframHeight(this.id)" height="10" width="100%" allowfullscreen></iframe>
        </div>
        <div id="paramsTS" value="" style="display:none"></div>
      </div>

      <div class="modal-footer justify-content-center" id="modalTSFooter">
        <button id="viewTSClosebtn" class="btn btn-outline-primary btn-sm" data-dismiss="modal">Close</button>
        <button id="viewTSRefreshbtn" class="btn btn-outline-primary btn-sm" type="button" onclick="refreshTSview()">Reset</button>
        <button id="viewTSMovebtn" class="btn btn-outline-primary btn-sm" type="button" onclick="moveTSview()">New Window</button>
        <button id="viewTSWarnbtn" class="btn btn-outline-primary btn-sm" style="display:none" data-toggle="modal" data-target="#modalwarnTS"></button>
<!-- Plotly's toImage does not work for surface-contour plot -->
        <button id="viewTSSavebtn" class="btn btn-outline-primary btn-sm" type="button" onclick="saveTSview()">Save Image</button>
        <button id="viewTSHelpbtn" class="btn btn-outline-primary btn-sm" data-toggle="modal" data-target="#modalinfoTS" onclick="$('#modalTS').modal('hide');">Help</button>
      </div> <!-- footer -->

    </div> <!--Content-->
  </div>
</div> <!--Modal: Name TS(time series)-->

</div> <!-- container -->

<!-- -->
    <script type="text/javascript">
            cgm_gnss_station_data = <?php print $cgm_gnss->getAllStationData()->outputJSON(); ?>;
            cgm_insar_track_data = <?php print $cgm_insar->getAllTrackData()->outputJSON(); ?>;
    </script>

</body>
</html>

