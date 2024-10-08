<?php
require_once("php/navigation.php");
require_once("php/CGM_GNSS.php");
require_once("php/CGM_INSAR.php");

$header = getHeader("explorer");
$cgm_gnss = new CGM_GNSS();
$cgm_insar = new CGM_INSAR();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Community Geodetic Explorer (Provisional)</title>
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

    <script type="text/javascript" src="js/vendor/leaflet-src.js"></script>
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

    <link rel="stylesheet" href="plugin/Leaflet.draw/leaflet.draw.css">
    <script type='text/javascript' src="plugin/Leaflet.draw/Leaflet.draw.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Leaflet.Draw.Event.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Toolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Tooltip.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/GeometryUtil.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/LatLngUtil.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/LineUtil.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/Polygon.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/Polyline.Intersect.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/ext/TouchEvents.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/DrawToolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Feature.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.SimpleShape.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Polyline.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Marker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Circle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.CircleMarker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Polygon.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/draw/handler/Draw.Rectangle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/EditToolbar.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/EditToolbar.Edit.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/EditToolbar.Delete.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/Control.Draw.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Poly.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.SimpleShape.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Rectangle.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Marker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.CircleMarker.js"></script>
    <script type='text/javascript' src="plugin/Leaflet.draw/edit/handler/Edit.Circle.js"></script>
    <script type='text/javascript' src="plugin/leaflet.polylineDecorator.js"></script>

    <!-- cgm js -->
    <script type="text/javascript" src="js/cgm.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_main.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_gnss.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_insar.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_util.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_viewTS_util.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_viewTS.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_leaflet.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_model.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_model_util.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_model_util.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_kml.js?v=1"></script>

   <!-- pixi pixiOverlay -->
    <script type="text/javascript" src="js/vendor/pixi.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/L.PixiOverlay.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/MarkerContainer.js"></script>
    <script type="text/javascript" src="js/vendor/pixiOverlay/bezier-easing.js"></script>
    <script type="text/javascript" src="js/cgm_pixi.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-495056-12"></script>
    <script type="text/javascript">
        $ = jQuery;
        var tableLoadCompleted = false;
        window.dataLayer = window.dataLayer || [];

        function gtag() { dataLayer.push(arguments); }
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

  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
</head>
<body>
<?php echo $header; ?>

<div class="container">
<div class="main" id="cgmMain">
   <div id="top-intro" class="row">
               <div class="col-1 links d-none d-md-block align-self-end">
            <div>
                <a href="https://www.scec.org/about">About SCEC</a>
                <a href="https://www.scec.org/science/cem">About CEM</a>
            </div>
        </div>
<p class="col-11 intro-text">The <a href="https://www.scec.org/research/cgm" target="_blank">SCEC Community Geodetic Model (CGM)</a> provides displacement time series and velocities of the Earth’s surface over southern California using data from Global Navigation Satellite Systems (GNSS), which includes the Global Positioning System (GPS), and interferometric synthetic aperture radar (InSAR), both space-based geodetic observation techniques. For detailed instructions, refer to the  <a href="guide">user guide</a>.
</p>
    </div>

    <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
            <div id="downloadSelect" class="cgm-control-download" onMouseLeave="removeDownloadControl()"></div>
        </div>
    </div>

    <div id="top-control-row-1" class="row">
        <div class="col-12 d-flex text-left pr-0">
            <div class="col-6" style="padding:0">
                <div class="input-group input-group-sm custom-control-inline pull-left" id="dataset-controls" style="max-width:170px">
                         <div class="input-group-prepend">
                                 <label style='border-bottom:1;' class="input-group-text" for="data-product-select">Select Dataset</label>
                         </div>
                         <select id='data-product-select' class="custom-select custom-select-sm">
                                 <option selected value="gnss">GNSS</option>
                                 <option value="insar">InSAR</option>
                         </select>
                </div>
                <button id="infoGNSSBtn" class="infoBtn btn pull-left" style="display:;padding-left:0;"
                        title="show GNSS frame info"
                        onClick="infoGNSS()"
                        data-toggle="modal" data-target="#modalinfoProduct">
                        <span class="glyphicon glyphicon-info-sign"
                        title="show GNSS Frame info"
                        style="font-size:14px;"></span>
                </button>
                <button id="infoInSARBtn" class="infoBtn btn pull-left" style="display:none;padding-left:0;padding-right:15px;"
                        title="show full InSAR track dataset info"
			onClick="infoInSAR()"
			data-toggle="modal" data-target="#modalinfoProduct">
                        <span class="glyphicon glyphicon-info-sign"
                        title="show InSAR Tracks info"
			style="font-size:14px;"></span>
                </button>

                <div id="insar-track-controls" class="input-group input-group-sm custom-control-inline pull-left" style="max-width:160px;display:none">
                         <div class="input-group-prepend">
                                 <label class="input-group-text" for="insar-track-select">Select Track</label>
                         </div>
                         <select id='insar-track-select' class="custom-select custom-select-sm">
                                 <option selected value="">NONE</option>
                                 <option value="D071">D071</option>
                                 <option value="D173">D173</option>
                                 <option value="A064">A064</option>
                                 <option value="A166">A166</option>
                         </select>
                </div>
                <button id="downloadInSARBtn" class="btn pull-left" style="display:none;padding-left:0;"
                        title="click to download full InSAR track"
                        onClick="downloadHDF5InSAR()">
                        <span class="glyphicon glyphicon-download"
                        title="download complete HDF5 data file for selected Track"
			style="font-size:14px;"></span>
                </button>
            </div>
         </div>
    </div>

<!-- GNSS select -->
    <div id="top-control-row-2">
    <div class="row control-container mt-1" id="cgm-gnss-controls-container" style="display:;">
            <div class="col-4 input-group input-group-sm filters mb-5">
                <select id="cgm-gnss-search-type" class="custom-select">
                    <option value="">Search GNSS by</option>
                    <option value="stationname">Station Name</option>
                    <option value="latlon">Latitude &amp; Longitude Box</option>
                    <option value="vectorslider">Vector</option>
                </select>
                <div class="input-group-append">
                    <button id="refresh-gnss-all-button" onclick="CGM.resetCGM();" class="btn btn-dark pl-4 pr-4"
                            type="button">Reset</button>
                </div>
            </div>
            <div class="col-8">
                <ul>
                    <li id='cgm-gnss-station-name' class='navigationLi ' style="display:none">
                        <div class='menu row justify-content-center'>
                            <div class="col-12">
                                <div class="d-flex">
                                    <input placeholder="Enter Station Name" type="text"
                                            class="cgm-gnss-search-item form-control"
                                            style=""/>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id='cgm-gnss-latlon' class='navigationLi ' style="display:none">
                        <div id='cgm-gnss-latlonMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Draw a rectangle on the map or enter latitudes and longitudes</p>
                                </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder="Latitude"
                                                id="cgm-firstLatTxt"
                                                title="first lat"
                                                onfocus="this.value=''"
                                                class="cgm-gnss-search-item form-control">
                                        <input type="text" 
                                                placeholder='Longitude' 
                                                id="cgm-firstLonTxt" 
                                                title="first lon"
                                                onfocus="this.value=''" 
                                                class="cgm-gnss-search-item form-control">
                                        <input type="text"
                                                id="cgm-secondLatTxt"
                                                title="second lat"
                                                placeholder='2nd Latitude'
                                                onfocus="this.value=''"
                                                class="cgm-gnss-search-item form-control">
                                        <input type="text"
                                                id="cgm-secondLonTxt"
                                                title="second lon"
                                                placeholder='2nd Longitude'
                                                onfocus="this.value=''"
                                                class="cgm-gnss-search-item form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id='cgm-gnss-vector-slider' class='navigationLi' style="display:none">
                        <div id='cgm-gnss-vector-sliderMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Select a vector range on the slider or enter the two boundaries</p>
                                </div>
                                <div class="col-8">
                                   <div class="form-inline vector-slider-input-boxes">
                                       <input type="text"
                                              id="cgm-minVectorSliderTxt"
                                              title="min vector slider"
                                              onfocus="this.value=''"
                                              class="cgm-gnss-search-item form-control">
                                       <div class="col-5">
                                         <div id="slider-vector-range" style="border:2px solid black"></div>
		           <div id="min-vector-slider-handle" class="ui-slider-handle"></div>
		           <div id="max-vector-slider-handle" class="ui-slider-handle"></div>
                                       </div>
                                       <input type="text"
                                              id="cgm-maxVectorSliderTxt"
                                              title="max vector slider"
                                              onfocus="this.value=''"
                                              class="cgm-gnss-search-item form-control">
                                  </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
    </div>

<!-- INSAR select -->
    <div class="row control-container mt-1" id="cgm-insar-controls-container" style="display:none;">
            <div class="col-4 input-group input-group-sm filters mb-5">
                <select id="cgm-insar-search-type" class="custom-select">
                    <option value="">Search InSAR by</option>
                    <option value="location">Point Location</option>
                    <option value="latlon">Latitude &amp; Longitude Box</option>
                </select>
                <div class="input-group-append">
                    <button id="refresh-insar-all-button" onclick="CGM.resetCGM()" class="btn btn-dark pl-4 pr-4"
                            type="button">Reset</button>
                </div>
            </div>
            <div class="col-8">
                <ul>
                    <li id='cgm-insar-location' class='navigationLi' style="display:none">
                        <div id='cgm-insar-locationMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Select a location on the map or enter latitude and longitude</p>
                                </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder='Latitude'
                                                id="cgm-insar-LatTxt"
                                                title="insar lat"
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                        <input type="text" 
                                                placeholder='Longitude' 
                                                id="cgm-insar-LonTxt" 
                                                title="insar lon"
                                                onfocus="this.value=''" 
                                                class="cgm-insar-search-item form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li id='cgm-insar-latlon' class='navigationLi' style="display:none">
                        <div id='cgm-insar-latlonMenu' class='menu'>
                            <div class="row">
                                <div class="col-4">
                                    <p>Draw a rectangle on the map or enter latitudes and longitudes</p>
                                </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder="Latitude"
                                                id="cgm-insar-firstLatTxt"
                                                title="first lat"
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                        <input type="text" 
                                                placeholder='Longitude' 
                                                id="cgm-insar-firstLonTxt" 
                                                title="first lon"
                                                onfocus="this.value=''" 
                                                class="cgm-insar-search-item form-control">
                                        <input type="text"
                                                id="cgm-insar-secondLatTxt"
                                                title="second lat"
                                                placeholder='2nd Latitude'
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                        <input type="text"
                                                id="cgm-insar-secondLonTxt"
                                                title="second lon"
                                                placeholder='2nd Longitude'
                                                onfocus="this.value=''"
                                                class="cgm-insar-search-item form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
    </div>
    </div> <!-- top-select --> 
<!-- -->
    <div id="top-control-row-3" class="row justify-content-end">
            <div id='model-options' class="form-check-inline" >
                <div class="form-check form-check-inline">
                     <label class='form-check-label'
                             title='Show GNSS station location on map'
                             for="cgm-model-gnss">
                     <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cgm-model-gnss"/>GNSS
                     </label>
                </div>
                <div class="form-check form-check-inline">
                     <label class='form-check-label ml-1 mini-option'
                             title='Show GNSS vectors on map'
                             for="cgm-model-gnss-vectors">
                     <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cgm-model-gnss-vectors" value="1" />GNSS vectors
                     </label>
                </div>
                <div class="form-check form-check-inline">
                     <label class='form-check-label ml-1 mini-option'
                             title='Show InSAR track boundaries on map'
                             for="cgm-model-insar">
                     <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cgm-model-insar" value="1" />InSAR
                     </label>
                </div>
                <div class="form-check form-check-inline">
                     <label class='form-check-label ml-1 mini-option'
                             title='Show Community Fault Model v7.0 on map'
                             for="cgm-model-cfm">
                     <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cgm-model-cfm" value="1" />CFM7.0
                     </label>
                </div>

                <div class="form-check form-check-inline">
                    <label class='form-check-label ml-1 mini-option'
                             title='Show Community Geological Framework regions on map'
                             for="cgm-model-gfm">
                    <input class='form-check-inline mr-1'
                             type="checkbox"
                             id="cgm-model-gfm" value="1" />GFM
                    </label>
                </div>
            </div>

<!-- KML/KMZ overlay -->
            <div id="kml-row" class="col-2 custom-control-inline mb-1">
                    <input id="fileKML" type='file' multiple onchange='uploadKMLFile(this.files)' style='display:none;'></input>
                    <button id="kmlBtn" class="btn"
                      onclick='javascript:document.getElementById("fileKML").click();'
                      title="Upload your own kml/kmz file to be displayed on the map interface. We currently support points, lines, paths, polygons, and image overlays (kmz only)."
                      style="color:#395057;background-color:#f2f2f2;border:1px solid #ced4da;border-radius:0.2rem;padding:0.15rem 0.5rem;"><span>Upload kml/kmz</span></button>
                    <button id="kmlSelectBtn" class="btn cxm-small-no-btn"
                      title="Show/Hide uploaded kml/kmz files"
                      style="display:none;" data-toggle="modal" data-target="#modalkmlselect">
                      <span id="eye_kml"  class="glyphicon glyphicon-eye-open"></span></button>
            </div> <!-- kml-row -->


            <div class="input-group input-group-sm custom-control-inline mr-0 mb-1" id="map-controls">
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
            </div>
    </div> <!-- top-control-row-3 -->

<div id="mapDataBig" class="row mapData">
    <div id="top-map" class="col-12 map-container">
        <div class="row" id='CGM_plot'
                   style="padding:0px;position:relative;border:solid 1px #ced4da; height:600px;">
<!-- spinner -->
             <div class="spinDialog" style="position:absolute;top:40%;left:50%; z-index:9999;">
               <div id="wait-spinner" align="center" style="display:none;"><i class="glyphicon glyphicon-cog fa-spin" style="color:red"></i></div>
             </div>


<div id="expand-view-key-container" style="display:none;">
  <div id="expand-view-key" class="row" style="opacity:0.8; height:1.4rem;">
    <button id="bigMapBtn" class="btn cgm-small-btn" title="Expand into a larger map" style="color:black;background-color:rgb(255,255,255);padding: 0rem 0.3rem 0rem 0.3rem" onclick="toggleBigMap()"><span class="fas fa-expand"></span>
    </button>   
  </div>               
</div>     

<!-- 3 types of legend -->
<div id="my-legends-container" style="display:;">
  <div id="my-legends" class="row" style="margin-left:0px">
    <div class="col-8" style="border:solid 0px blue;">
      <div id="insar_colormap" class="mb-2" style="border:solid 0px red; width:200px;display:none;">
        <img src="./img/insar_colorbar.png" style="height:100%; width:100%; object-fit:contain" >
      </div>
      <div id="gnss_colormap" class="row mb-2" style="border:solid 0px orange; width:300px;display:none;">
        <li style="list-style-image:url('./img/blue.png');margin-left:12px; "> continuous sites</li>
        <li style="list-style-image:url('./img/orange.png');margin-left:20px; "> survey sites</li>
      </div>
    </div>
    <div id="gnss_vector_space" class="col-2" style="margin-left:0px; border:solid 0px green; display:none;">
    </div>
  </div>               
</div>     

        </div>
    </div> <!-- top-map -->
</div> <!-- mapDataBig -->

    <div id="top-select" class="row mt-1">
        <div id="insar-descript-block" class="col-12" style="display:none;padding-right:0px; border:solid 0px green">
          <p id="insar-descript" style="margin-bottom:0"> Something about current InSAR track..</p>
        </div>
        <div class="col-12" style="padding-right:0px">
            <div id="metadata-viewer-container" style="border:solid 1px #ced4da; overflow-x:hidden">
                <table id="metadata-viewer">
                    <thead>
                      <tr>
                      </tr>
                    </thead>
                    <tbody>
                      <tr id="placeholder-row">
                          <td colspan="11">Metadata for selected piont will appear here. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
        </div>
    </div>
</div> <!-- main/cgmMain -->

<!-- modal list -->
<!--Modal: (modalkmlselect) -->
<div class="modal" id="modalkmlselect" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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


<!--Modal: (modalazimuth)  -->
<div class="modal" id="modalazimuth" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
</div> <!--Modal: modalazimuth -->


<!--Modal: (modalTS, time series)-->
<div class="modal" id="modalTS" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="modalTS" aria-hidden="true">
  <div class="modal-dialog modal-full" id="modalTSDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalTSContent">
      <!--Header-->
      <div class="modal-header">
<!-- selected in cgm_viewTS_util.js -->
         <div class="col" id="gnss-frame-selection">
         <p>Select GNSS Frame Type: </p>   
             <div>
             <form id="gnss-frame-type">
                <label><input type="radio" id="frameigb14" name="gnssframetype" value="igb14" onclick='selectTSview("igb14")' checked>
                       <span>igb14</span></label>
		<label><input type="radio" id="framenam14" name="gnssframetype" value="nam14" onclick='selectTSview("nam14")'>
                       <span>nam14</span></label>
		<label><input type="radio" id="framenam17" name="gnssframetype" value="nam17" onclick='selectTSview("nam17")'>
                       <span>nam17</span></label>
		<label><input type="radio" id="framepcf14" name="gnssframetype" value="pcf14" onclick='selectTSview("pcf14")'>
                       <span>pcf147</span></label>
             </form>
             </div>
         </div>
         <button type="button" class="close" data-dismiss="modal" onclick="clearTSview()">Close</button>
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
</div> <!--Modal: modalTS -->

<!--Modal: (modalinfoTS) -->
<div class="modal" id="modalinfoTS" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
</div> <!--Modal: modalinfoTS-->

<!--Modal: (modalwarnTS)  -->
<div class="modal" id="modalwarnTS" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
</div> <!--Modal: modalwarnTS -->

<!--Modal: (modalinfoProduct)  -->
<div class="modal" id="modalinfoProduct" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" id="modalinfoProductDialog" role="document">

    <!--Content-->
    <div class="modal-content" id="modalinfoProductContent">
      <!--Body-->
      <div class="modal-body" id="modalinfoProductBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden;">
          <div class="col-12" id="infoProductTable-container"></div>
        </div>
      </div>
      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-outline-primary btn-md" data-dismiss="modal">Close</button>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalinfoProduct -->

<!--Modal: (modalnotify) -->
<div class="modal" id="modalnotify" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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

<!--Modal: (modalwait) -->
<div class="modal" id="modalwait" tabindex="-1" style="z-index:8999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" id="modalwaitDialog" role="document">
    <!--Content-->
    <div class="modal-content" id="modalwaitContent">
      <!--Body-->
      <div class="modal-body" id="modalwaitBody">
        <div class="row col-md-12 ml-auto" style="overflow:hidden; font-size:10pt">
           <p id="modal-wait-text" style="font-size:25px">
                <i class="glyphicon glyphicon-cog fa-spin" style='color:#990000'></i>
           </p>
        </div>
      </div>
    </div> <!--Content-->
  </div>
</div> <!--Modal: modalwait-->

<!--Modal: Model (modalprogress)-->
<div class="modal" id="modalprogress" tabindex="-1" style="z-index:9999" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" style="width:45%" id="modalprogressDialog" role="document">
    <!--Content-->
    <div class="modal-content" id="modalprogressContent">
      <!--Body-->
      <div class="modal-body" id="modalprogressBody">
        <div class="row col-md-11 ml-auto" style="overflow:hidden; font-size:10pt">
           <div class="row">
	   <p id="modalprogressLabel" style="text-align:center;font-size:18px"> 
                <input type="text" style="width:400px; border:0px solid red" id="wait-text">
                <div class="row" style="display:none">
                  <input type="text" style="width:100px;margin-right:50px;" id="wait-expected" value="0">
                </div>
                <input type="text" style="text-align:center;width:60px;padding:0px" id="wait-progress" value="0%" disabled>
		<div class="row" id="myProgress" style="border:2px solid grey">
                       <div id="myProgressBar"></div>
                </div>
           </p>
           </div>
        </div>
      </div>

    </div> <!--Content-->
  </div>
</div> <!--Modal: modalprogress-->


</div> <!-- container -->
<!-- -->
    <script type="text/javascript">
            cgm_gnss_station_data = <?php print $cgm_gnss->getAllStationData()->outputJSON(); ?>;
            cgm_gnss_site_data = <?php print $cgm_gnss->getAllSiteData()->outputJSON(); ?>;
            cgm_insar_track_data = <?php print $cgm_insar->getAllTrackData()->outputJSON(); ?>;
    </script>

</body>
</html>

