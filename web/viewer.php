<?php
require_once("php/navigation.php");
require_once("php/CGM.php");
$header = getHeader("Viewer");
$cgm = new CGM();
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
    <link rel="stylesheet" href="css/sidebar.css?v=1">

    <script type="text/javascript" src="js/vendor/leaflet-src.js"></script>
    <script type='text/javascript' src='js/vendor/leaflet.awesome-markers.min.js'></script>
    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <script type='text/javascript' src='js/vendor/ersi-leaflet.js'></script>
    <script type='text/javascript' src='js/vendor/FileSaver.js'></script>
    <script type='text/javascript' src='js/vendor/jszip.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.floatThead.min.js'></script>

    <!--
    https://leaflet.github.io/Leaflet.draw/docs/Leaflet.draw-latest.html#l-draw
    this is for including the Leaflet.draw plugin
    -->
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
    <script type="text/javascript" src="js/debug.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_main.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_model.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_util.js?v=1"></script>
    <script type="text/javascript" src="js/cxm_leaflet.js?v=1"></script>

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
window.console.log("HERE..");
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


<div class="container main">
    <div class="row">
        <div class="col-12">
            <p>The Community Geodetic Model (CGM) provides displacement time series and velocities of the Earth’s surface over southern California using data from Global Navigation Satellite Systems (GNSS), which includes the Global Positioning System (GPS), and interferometric synthetic aperture radar (InSAR), both space-based geodetic observation techniques.</p>
        </div>
    </div>

    <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
            <div id="downloadSelect" class="cfm-control-download" onMouseLeave="removeDownloadControl()"></div>
        </div>
    </div>

    <div class="row control-container mt-1" id="cgm-controls-container" style="display:;">
            <div class="col-4 input-group filters mb-3">
                <select id="cgm-search-type" class="custom-select">
                    <option value="">Search the CGM ...</option>
                    <option value="stationname">Station Name</option>
                    <option value="latlon">Latitude &amp; Longitude</option>
                </select>
                <div class="input-group-append">
                    <button id="refresh-all-button" onclick="CGM.reset();" class="btn btn-dark pl-4 pr-4"
                            type="button">Reset</button>
                </div>
            </div>
                <div class="col-8">
                    <ul>
                        <li id='cgm-station-name' class='navigationLi ' style="display:none">
                            <div class='menu row justify-content-center'>
                                <div class="col-12">
                                    <div class="d-flex">
                                        <input placeholder="Enter Station Name" type="text"
                                                class="cgm-search-item form-control"
                                                style=""/>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='cgm-latlon' class='navigationLi ' style="display:none">
                            <div id='cgm-latlonMenu' class='menu'>
                                <div class="row">
                                    <div class="col-4">
                                        <p>Draw a rectangle on the map or enter latitudes and longitudes.</p>
                                    </div>
                                    <div class="col-8">
                                        <div class="form-inline latlon-input-boxes">
                                            <input type="text"
                                                    placeholder="Latitude"
                                                    id="cgm-firstLatTxt"
                                                    title="first lat"
                                                    onfocus="this.value=''"
                                                    class="cgm-search-item form-control">
                                            <input type="text" 
                                                    placeholder='Longitude' 
                                                    id="cgm-firstLonTxt" 
                                                    title="first lon"
                                                    onfocus="this.value=''" 
                                                    class="cgm-search-item form-control">
                                            <input type="text"
                                                    id="cgm-secondLatTxt"
                                                    title="optional second lat"
                                                    placeholder='optional'
                                                    onfocus="this.value=''"
                                                    class="cgm-search-item form-control">
                                            <input type="text"
                                                    id="cgm-secondLonTxt"
                                                    title="optional second lon"
                                                    placeholder='optional'
                                                    onfocus="this.value=''"
                                                    class="cgm-search-item form-control">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                    </ul>
                    <!-- pull-out -->
                </div>
            <!--            </div>-->

    </div>
    <div class="row">
            <div class="col-12 text-right pr-0" style="border:0px solid green">
                        <div id='model-options' class="form-check-inline">
                            <select id='data-download-select' class="custom-select custom-select-sm mr-4" style="width:150px;">
                              <option selected value="cgm">CGM Data</option>
                            </select>
                             <div class="form-check form-check-inline">
                                 <label class='form-check-label'
                                         for="cgm-model">
                                 <input class='form-check-inline mr-1'
                                         type="checkbox"
                                         id="cgm-model"/>GNSS
                                 </label>
                             </div>
                             <div class="form-check form-check-inline">
                                 <label class='form-check-label ml-1 mini-option'
                                         for="cgm-model-vectors">
                                 <input class='form-check-inline mr-1'
                                         type="checkbox"
                                         id="cgm-model-vectors" value="1" />GNSS vectors
                                 </label>
                             </div>
                             <div class="form-check form-check-inline">
                                 <label class='form-check-label ml-1 mini-option'
                                         for="cgm-model-insar">
                                 <input class='form-check-inline mr-1'
                                         type="checkbox"
                                         id="cgm-model-insar" value="1" />InSAR
                                 </label>
                             </div>
                         </div>
                    <div class="input-group input-group-sm custom-control-inline mr-0" id="map-controls">
                        <div class="input-group-prepend">
                            <label style='border-bottom:0;' class="input-group-text" for="mapLayer">Select Map Type</label>
                        </div>
                        <select id="mapLayer" class="custom-select custom-select-sm"
                                onchange="switchLayer(this.value);">
                        <option selected value="esri topo">ESRI Topographic</option>
                        <option value="esri NG">ESRI National Geographic</option>
                        <option value="esri imagery">ESRI Imagery</option>
                        <option value="otm topo">OTM Topographic</option>
                        <option value="osm street">OSM Street</option>
                        <option value="shaded relief">Shaded Relief</option>
                        </select>
                    </div>

            </div>
    </div>
    <div class="row mapData">
        <div class="col-5 button-container d-flex flex-column cgm-search-result-container pr-1" style="overflow:hidden;">
            <div id="searchResult" class="mb-1" style="display:none">
            </div>
        </div>
        <div class="col-7 map-container">

            <div class="row" >

                <div class="col" id='CGM_plot'
                        style="position:relative;border:solid 1px #ced4da; height:400px;">
                    <div  id='wait-spinner' style="">
                        <div class="d-flex justify-content-center" >
                          <div class="spinner-border text-light" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    <div class="row mt-1">
        <div class="col-12" style="padding-right:0px">
            <div id="metadata-viewer-container" style="border:solid 1px #ced4da; overflow-x:hidden">
                <table id="metadata-viewer">
                    <thead>
                      <tr>
<!-- -->
                         <th class="text-center button-container" style="width:2rem">
                             <button id="cgm-allBtn" class="btn btn-sm cxm-small-btn" title="select all visible stations" onclick="CGM.toggleSelectAll();">
                             <span class="glyphicon glyphicon-unchecked"></span>
                             </button>
                         </th>
                         <th class="hoverColor" onClick="sortMetadataTableByRow(1,'a')">Station&nbsp<span id='sortCol_1' class="fas fa-angle-down"></span><br>Name</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'n')">Latitude</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">Longitude</th>
                        <th>Type</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')">Hor. Vel.</th>
                        <th style="width:40%"><div class="col text-center">
                            <div class="btn-group download-now">
                                <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" disabled>
                                    DOWNLOAD ALL<span id="download-counter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <button class="dropdown-item" type="button" value="igb14"
                                            onclick="downloadURLsAsZip(this.value);">igb14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam14"
                                            onclick="downloadURLsAsZip(this.value);">nam14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam17"
                                            onclick="downloadURLsAsZip(this.value);">nam17
                                    </button>
                                    <button class="dropdown-item" type="button" value="pcf14"
                                            onclick="downloadURLsAsZip(this.value);">pcf14
                                    </button>
                                    <button class="dropdown-item" type="button" value="all"
                                          onclick="downloadURLsAsZip(this.value);">All of the Above
                                    </button>
                                </div>
                            </div>
                        </th>
<!-- -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr id="placeholder-row">
                          <td colspan="7">Metadata for selected piont will appear here. </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
        </div>
    </div>
</div>
    <script type="text/javascript">
            cgm_station_data = <?php print $cgm->getAllStationData()->outputJSON(); ?>;
            <?php if ($_REQUEST['model'] == 'cgm'):  ?>
            $(document).on("page-ready", function () {
                CGM.setupCGMInterface();
            });
			<?php endif; ?>
    </script>
</body>
</html>

