<?php
require_once("php/navigation.php");
require_once("php/CFM.php");
require_once("php/CGM.php");
$header = getHeader("Viewer");
$cfm = new CFM();
$cgm = new CGM();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Community Model Viewer (Provisional)</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/vendor/font-awesome.min.css" rel="stylesheet">

    <link rel="stylesheet" href="css/vendor/leaflet.css">
    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/cfm-ui.css?v=1">
    <link rel="stylesheet" href="css/sidebar.css?v=1">

    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type="text/javascript" src="js/vendor/leaflet-src.js"></script>
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

    <!-- cfm js -->
    <script type="text/javascript" src="js/debug.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_leaflet.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_layer.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_util.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_ui.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_main.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_query.js?v=1"></script>
    <script type="text/javascript" src="js/cfm_sidebar.js?v=1"></script>
    <script type="text/javascript" src="js/cgm_main.js?v=1"></script>

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
            var $table = $('div.cfm-table table');
            $table.floatThead({
                scrollContainer: function ($table) {
                    return $table.closest('div.cfm-table');
                }
            });

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
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, corporis eveniet facere id neque nesciunt odio omnis optio quis repudiandae? Amet deleniti ipsum iusto nostrum praesentium quae rem tempore vel</p>
        </div>
    </div>

    <div class="row" style="display:none;">
        <div class="col justify-content-end custom-control-inline">
            <div style="display:none;" id="external_leaflet_control"></div>
            <button id="colorBtn" class="btn cfm-top-small-btn" onMouseEnter="expandColorsControl()">
                <span class="glyphicon glyphicon-star"></span></button>
            <div id="colorSelect" class="cfm-control-colors" onMouseLeave="removeColorsControl()"></div>

            <button id="toggleBtn" class="btn cfm-top-small-btn" title="toggle to display all faults"
                    onclick="toggleAll()">
                <span class="glyphicon glyphicon-adjust"></span></button>

            <button id="refreshBtn" class="btn cfm-top-small-btn" title="refresh to initial state"
                    onclick="refreshAll();">
                <span class="glyphicon glyphicon-refresh"></span></button>

            <button id="basketBtn" class="btn cfm-top-small-btn" title="download selected faults metadata"
                    onMouseEnter="expandDownloadControl()">
                <span class="glyphicon glyphicon-download-alt"></span></button>
            <div id="itemCount"></div>
            <div id="downloadSelect" class="cfm-control-download" onMouseLeave="removeDownloadControl()"></div>
        </div>
    </div>

    <div class="row" id="controls-container">
<!--        <div class="col pl-0" id="CFM-search-controls">-->
            <div class="col-4 input-group filters">
                <select id="search-type" class="custom-select">
                    <option value="">Search the CFM ...</option>
                    <option value="keywordClick">Keyword</option>
                    <option value="latlonClick">Latitude &amp; Longitude</option>
                    <option disabled>-- Advanced --</option>
                    <option value="areaClick">Area</option>
                    <option value="zoneClick">Zone</option>
                    <option value="sectionClick">Section</option>
                    <option value="nameClick">Name</option>
                    <!--- WAIT for better strike/dip
										<option value="strikeClick">Strike</option>
										<option value="dipClick">Dip</option>
					--->
                </select>
                <div class="input-group-append">
                    <button id="refresh-all-button" onclick="refreshAll();" class="btn btn-dark pl-4 pr-4" type="button">Reset</button>
                </div>
            </div>
                <div class="col-8">
                    <ul id="sidebar" class="navigation">
                        <li id='area' class='navigationLi ' style="display:none;">
                            <div id='areaMenu' class='menu'>
                                <div class="">
                                    <div class="" style="">

                                        <div class="" id="areaList">
                                            <select class="custom-select" id="selectArea"
                                                    onchange="searchByArea(this.value)">
                                                <option value="">  Select Area...</option>
												<?php print $cfm->loadMenuData('area')->outputHTMLOptions(); ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='zone' class='navigationLi ' style="display:none">
                            <div id='zoneMenu' class='menu'>
                                <div class="">
                                    <div class="" style="">

                                        <div class="" id="zoneList">
                                            <select class="custom-select" id="selectZone"
                                                    onchange="searchByZone(this.value)">
                                                <option value="">  Select Zone... </option>
												<?php print $cfm->loadMenuData('zone')->outputHTMLOptions(); ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='section' class='navigationLi ' style="display:none">
                            <div id='sectionMenu' class='menu'>
                                <div class="">
                                    <div class="" style="">

                                        <div class="" id="sectionList"></div>
                                            <select class="custom-select" id="selectSection"
                                                    onchange="searchBySection(this.value)">
                                                <option value="">  Select Section... </option>
												<?php print $cfm->loadMenuData('section')->outputHTMLOptions(); ?>
                                            </select>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li id='name' class='navigationLi ' style="display:none">
                            <div id='nameMenu' class='menu'>
                                <div class="">
                                    <div class="" style="">

                                        <div class="" id="nameList"></div>
                                          <select class="custom-select" id="selectName"
                                                  onchange="searchByName(this.value)">
                                                <option value="">  Select Name... </option>
											  <?php print $cfm->loadMenuData('name')->outputHTMLOptions(); ?>
                                            </select>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li id='strike' class='navigationLi ' style="display:none">
                            <div id='strikeMenu' class='menu'>
                                <div class="">
                                    <div class="" style="">
                                        <div class="" id="strikeRange"
                                                style="padding-left:10px; padding-right:10px; overflow:hidden;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li id='dip' class='navigationLi ' style="display:none">
                            <div id='dipMenu' class='menu'>
                                <div class="">
                                    <div class="" style="">
                                        <div class="" id="dipRange"
                                                style="padding-left:10px; padding-right:10px; overflow:hidden;"></div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li id='keyword' class='navigationLi ' style="display:none">
                            <div id='keywordMenu' class='menu row justify-content-center'>
                                <div class="col-12">
                                    <div class="d-flex">
                                        <input placeholder="Enter Keyword" type="text" id="keywordTxt"
                                                class="form-control"
                                                onfocus="this.value=''" style=""/>
                                        <button id="keywordBtn" type="button" title="search with keyword"
                                                class="btn btn-default cfm-small-btn" onclick="searchByKeyword()">
                                            <span class="glyphicon glyphicon-search"></span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </li>
                        <li id='latlon' class='navigationLi ' style="display:none">
                            <div id='latlonMenu' class='menu'>
                                <div class="row">
                                    <div class="col-4">
                                        <p>Draw a rectangle on the map or enter latitudes and longitudes.</p>
                                    </div>
                                <div class="col-8">
                                    <div class="form-inline latlon-input-boxes">
                                        <input type="text"
                                                placeholder="Latitude"
                                                id="firstLatTxt"
                                                title="first lat"
                                                onfocus="this.value=''"
                                                class="form-control">
                                        <input type="text" id="firstLonTxt" placeholder='Longitude' title="first lon"
                                                onfocus="this.value=''" class="form-control">
                                        <input type="text"
                                                id="secondLatTxt"
                                                title="optional second lat"
                                                value='optional'
                                                onfocus="this.value=''"
                                                class="form-control">
                                        <input type="text"
                                                id="secondLonTxt"
                                                title="optional second lon"
                                                value='optional'
                                                onfocus="this.value=''"
                                                class="form-control">
                                        <button id="latlonBtn" type="button" title="search with latlon"
                                                class="btn btn-default cfm-small-btn form-control " onclick="searchByLatlon()">
                                            <span class="glyphicon glyphicon-search"></span>
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </li>
                        <!-- debug purpose
						  <li id='gid' class='navigationLi ' style="display:none">
							<div id='gidMenu' class='menu'>
							  <div id='gidLabel' class='menuLabel' style="margin-left:20px;font-size:14px;font-weight:bold">Query for GEO JSON Object by object_tb_gid:<button class="pull-right" title="dismiss" onclick="gidClick()" style="border:none;background-color:transparent"><span class="glyphicon glyphicon-remove"></span>
						</button>
							  </div>
							  <div class="">
								   <div class="" style="margin-left:20px; margin-top:10px">

							  <div class=""> Object gid:&nbsp;<input type="text" id="objGidTxt" onfocus="this.value=''" style="right-margin:10px; border:1px solid black; color:orange; text-align:center;">
							   <button id="objGidBtn" type="button" title="search with object gid" class="btn btn-default" onclick="getGeoJSONbyObjGid()">
									<span class="glyphicon glyphicon-search"></span>
							   </button>
							 </div>
								   </div>
							   </div>
							</div>
						  </li>
						-->
                    </ul>
                    <!-- pull-out -->
                </div>
<!--            </div>-->

    </div>

    <div class="row">
            <div class="col-12 text-right">
                        <div id='model-options' class="form-check-inline" style="">
                                                                                         <div class="ml-2 form-check form-check-inline">
                                                                                         <span class="mr-1">Display: </span>
                                                                                         <label class='form-check-label' for="cfm-model">
                                                                                         <input class='form-check-inline mr-1' type="checkbox" value=1 checked="checked"
                                                                                         id="cfm-model"/>CFM
                                                                                         </label>
                                                                                         </div>
                                                                                         <div class="form-check form-check-inline">
                                                                                         <label class='form-check-label' for="cgm-model">
                                                                                         <input class='form-check-inline mr-1' type="checkbox" id="cgm-model"/>CGM
                                                                                         </label>
                                                                                         </div>
                                                                                         <div class="form-check form-check-inline">
                                                                                         <label class='form-check-label ml-1 mini-option' for="cgm-model-vectors">
                                                                                         <input class='form-check-inline mr-1' type="checkbox" id="cgm-model-vectors"/>CGM vectors
                                                                                         </label>
                                                                                         </div>
                                                                                         </div>
                    <div class="input-group input-group-sm custom-control-inline mr-0" id="map-controls">
                                                                                                            <div class="input-group-prepend">
                                                                                                            <label style='border-bottom:0;' class="input-group-text" for="mapLayer">Select Map Type</label>
                                                                                                            </div>
                                                                                                            <select id="mapLayer" class="custom-select custom-select-sm" onchange="switchLayer(this.value);">
                                                                                                            <option selected value="esri topo">ESRI Topographic</option>
                                                                                                            <option value="esri NG">ESRI National Geographic</option>
                                                                                                            <option value="esri imagery">ESRI Imagery</option>
                                                                                                            <option value="otm topo">OTM Topographic</option>
                                                                                                            <option value="osm street">OSM Street</option>
                                                                                                            <option value="shaded relief">Shaded Relief</option>
                                                                                                            </select>

                                                                                                            <!--- WAIT for better dip/strike data
                                                                                                            <div class="input-group input-group-sm ml-md-2 ml-sm-0">
                                                                                                            <div class="input-group-prepend">
                                                                                                            <label class="input-group-text" for="highlight-faults">Highlight Faults By</label>
                                                                                                            </div>
                                                                                                            <select id="highlight-faults" class="custom-select custom-select-sm"
                                                                                                            onchange="changeFaultColor(this.value);">
                                                                                                            <option value="">Default</option>
                                                                                                            <option value="strike">Strike</option>
                                                                                                            <option value="dip">Dip</option>
                                                                                                            </select>
                                                                                                            </div>
                                                                                                            --->
                                                                                                            <!--            <a class="ui-button" onclick="toggleAll();">Show/Hide Faults</a>-->

                                                                                                            </div>
            </div>
        </div>
    <!--    </div>-->


    <div class="row mapData">
        <div class="col-5 button-container d-flex flex-column" style="overflow:hidden;">
            <div id="searchResult" class="mb-1">
            </div>
            <div id="geoSearchByObjGidResult" style="display:none"></div>
        </div>
        <div class="col-7 pr-0 pl-2 ">
            <div class="row w-100 mb-1" id='CFM_plot'
                    style="position:relative;border:solid 1px #ced4da; height:576px;"></div>


        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="row" id="metadata-viewer-container">
                <div class="col-12 pr-0">
                <table id="metadata-viewer">
                    <thead>
                    <tr>
                        <th>Fault</th>
                        <th>Area</th>
                        <th>Zone</th>
                        <th>Section</th>
                        <th>CFM Version</th>
                        <!--                        <th>Strike</th>-->
                        <!--                        <th>Dip</th>-->
                        <!--                        <th>Area (m<sup>2</sup>) </th>-->
                        <th><div class="col text-center">
                                <div class="btn-group download-now">
                                    <button id="download-all" type="button" class="btn btn-dark dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false" disabled>
                                        Download All <span id="download-counter"></span>
                                    </button>
                                    <!-- MODAL popup button
									&nbsp;&nbsp;&nbsp;
																		<button id="view3d-all" type="button" class="btn btn-dark"
																				data-toggle="modal" data-target="#modal3D">
																			View<span id="download-counter"></span>
																		</button>
									-->
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <button class="dropdown-item" type="button" value="meta"
                                                onclick="executeDownload(this.value);">Metadata
                                        </button>
                                        <button class="dropdown-item" type="button" value="native"
                                                onclick="executeDownload(this.value);">Native + Metadata
                                        </button>
                                        <button class="dropdown-item" type="button" value="500m"
                                                onclick="executeDownload(this.value);">500m + Metadata
                                        </button>
                                        <button class="dropdown-item" type="button" value="1000m"
                                                onclick="executeDownload(this.value);">1000m + Metadata
                                        </button>
                                        <button class="dropdown-item" type="button" value="2000m"
                                                onclick="executeDownload(this.value);">2000m + Metadata
                                        </button>
                                        <button class="dropdown-item" type="button" value="all"
                                                onclick="executeDownload(this.value);">All of the Above
                                        </button>
                                    </div>
                                </div>
                            </div></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr id="placeholder-row">
                        <td colspan="12">Metadata for selected faults will appear here. </td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <!--                    <p>-->
                <!--                        The CFM Viewer was developed by the <a href="https://www.scec.org/">Southern California Earthquake Center</a> (SCEC) and SCEC-->
                <!--                        Community Fault Model researchers. More information is available on the <a-->
                <!--                            href="https://www.scec.org/research/cfm">SCEC CFM Research Page</a>. SCEC is funded by-->
                <!--                        <a href="https://www.nsf.gov">National Science Foundation</a> and the <a href="https://www.usgs.gov">United States Geological Survey</a>.-->
                <!--                    </p>-->
            </div>
        </div>
    </div>

</div>

    <div id='queryBlock' class="col-6" style="overflow:hidden;display:none;">

    </div> <!-- query block -->
<div id="dip-strike-key-container row" style="display:none;">
    <div id="dip-strike-key" class="col-3">
        <div class="col text-right">
		<span class="min"></span><span class="ui-slider-range" style="width: 200px;">&nbsp;</span><span
                    class="max"></span>
            </div>
	</div>
</div>


<?php
$strikeRange = $cfm->getStrikeRange();
$dipRange = $cfm->getDipRange();
?>
<div id="data" style="display:none;">
    <div id="dataValues"
            data-maxstrike="<?php print $strikeRange->maxstrike; ?>"
            data-minstrike="<?php print $strikeRange->minstrike; ?>"
            data-maxdip="<?php print $dipRange->maxdip; ?>"
            data-mindip="<?php print $dipRange->mindip; ?>"
    </div>
</div>
</body>
    <script type="text/javascript">
        $(document).ready(function () {
            cfm_native_list = <?php print $cfm->getObjectDetails('native')->outputJSON(); ?>;
            cfm_500m_list = <?php print $cfm->getObjectDetails('500m')->outputJSON(); ?>;
            cfm_1000m_list = <?php print $cfm->getObjectDetails('1000m')->outputJSON(); ?>;
            cfm_2000m_list = <?php print $cfm->getObjectDetails('2000m')->outputJSON(); ?>;
            all_traces = <?php print $cfm->search('alltraces')->outputJSON(); ?>;
            all_geo_json = <?php print $cfm->search('allgeojson')->outputJSON(); ?>;

            let cfm_gid_lists = <?php print $cfm->getGeoTraceList()->outputJSON(); ?>;
            cfm_gid_list = cfm_gid_lists["gidlist"];
            cfm_nogeo_gid_list = cfm_gid_lists["nogidlist"];
            makeAllLists();
            cgm_station_data = <?php print $cgm->getAllStationData()->outputJSON(); ?>;
        });
    </script>
</html>

