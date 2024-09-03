<?php
require_once("php/navigation.php");
$header = getHeader("User Guide");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link href="css/vendor/font-awesome.min.css" rel="stylesheet">

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="css/vendor/bootstrap-grid.min.css">
    <link rel="stylesheet" href="css/vendor/jquery-ui.css">
    <link rel="stylesheet" href="css/vendor/glyphicons.css">
    <link rel="stylesheet" href="css/cgm-ui.css">

    <script type='text/javascript' src='js/vendor/popper.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery.min.js'></script>
    <script type='text/javascript' src='js/vendor/bootstrap.min.js'></script>
    <script type='text/javascript' src='js/vendor/jquery-ui.js'></script>
    <title>Community Geodetic Model Explorer: User Guide</title>
</head>
<body>
<?php echo $header; ?>

<div class="container info-page-container scec-main-container guide">

    <h1>CGM Explorer User Guide</h1>
        <div class="col-12">
            <figure class="cgm-interface figure float-lg-right">
                <img src="img/cgm_explorer.png" class="figure-img img-fluid" alt="Screen capture of CGM Explorer interface">
                <figcaption class="figure-caption">Screen capture of CGM Explorer interface</figcaption>
            </figure>
            <h4><strong>Community Geodetic Model (CGM) Explorer Overview</strong></h4>

		<p>The CGM Explorer provides interactive map-based views of the
                   <a href="https://doi.org/10.5281/zenodo.10076838">CGM version 2.0</a> 
		   contributed products.
                   The explorer allows users to select GNSS or InSAR products of interest,
                   using drop down menus at the top-left of the interface, and view the
                   results. Users can view overlays of GNSS station locations and 
                   velocities (relative to North America), InSAR track footprints,
		   Community Fault Model fault traces and Geologic Framework Model regions.
                   Users can also download selected 
                   product data without having to download the entire CGM product archive.
		   The pages on this site include the 
                   <a href="<?php echo $host_site_actual_path; ?>">CGM Explorer page</a>,
                   this user guide, <a href="disclaimer">a disclaimer</a>, and a
                   <a href="contact">contact information</a> page.</p>

		<p>The interactive map on the right displays the geographic extent of 
                   the CGM products, using the selected metric for the selected data type.
                   In the top-right corner of the interactive map, there is a pull-down menu
                   that allows the base map to be changed.  By default, the map shown 
		   is <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ESRI Topographic</a>.
                   The other map types are: 
                   <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">ESRI Imagery</a>,
                   <a href="http://jawg.io">Jawg Light</a>, <a href="http://jawg.io">Jawg Dark</a>,
                   <a href="https://www.openstreetmap.org">OSM Streets Relief</a>,
                   <a href="https://opentopomap.org">OTM Topographic</a>,
                   <a href="https://www.openstreetmap.org">OSM Street</a>, and 
                   <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer">ESRI Terrain</a>.</p>

		 <p>The map interface has a small default size, but the map interface can be resized 
		    by clicking on the black dashed square icon located in the bottom right corner 
		    of the interface.  Two size options are available, default, and full-screen.
                    The full-screen size hide some of the tools, so this option is provided for 
                    visualization and data comparison purposes and is not intended to be used 
                    when querying the product for download.</p>

                 <p><i>To report any bugs or issues, please see the <a href="contact">contact page</a>.</i></p>
            <h4><strong>Display Layers</strong></h4>
                 <p>Along the top of the map, there are checkboxes that turn on or off additional
                    display layers, which the user may find helpful. “GNSS” adds GNSS station 
                    locations. “GNSS vectors” adds GNSS station velocities, relative to
                    North America. These location and velocity values populate the table underneath
                    the interactive map after selecting stations (described below). “InSAR” adds
                    the outlines of the InSAR track footprints. “CFM7.0” adds the surface traces of
                    version 7.0 of the Community Fault Model faults, with blind faults indicated by
                    a dashed line. Click on each individual fault to see a popup of its name. "GFM"
                    adds the Geologic Framework Model regions defined as a component of the Community
                    Rheology Model. Click on each individual polygon to see a popup of the region name.
                    "KML/KMZ Uploader" allows users to upload their own Google Earth kml/kmz files 
                    for display on the map interface.  The kml/kmz uploader currently supports 
                    point/line data (kml/kmz) and image overlays (kmz only). kml/kmz files with remote
                    links are currently not supported.</p>


            <h4><strong>Explore CGM products</strong></h4>

                 <p>The CGM Explorer has two available sets of geodetic products (GNSS and InSAR)
                    and a few modes by which to select them. The "Select Dataset" dropdown menu,
                    in the top-left corner, is GNSS by default. If "InSAR" is selected, a
                    "Select TracK" dropdown menu appears adjacent, which displays nothing 
                    ("NONE") by default. Select a track from this second dropdown menu and the 
                    coverage of the chosen InSAR product is displayed (this may take up to one 
                    minute to load) with a corresponding color scale of line-of-sight velocity
                    in the bottom-left of the map. Line-of-sight velocity is referenced to the
                    GNSS station location marked by the white square corresponding to the track.</p>

<ul>
<li style="list-style-type:none;">
	    <h5><strong>To select the GNSS products</strong></h5>
                 <p><ul>
			<li style="list-style-type:disc;">Hover over a station icon to see a 
			    pop-up showing the station ID and nominal velocity relative to 
                            North America.</li>
			<li style="list-style-type:disc;">Select a specific station directly 
			    by clicking on its icon, or choose a selection method using the
			    "Search GNSS by" dropdown menu below "Select Dataset" in the
                            top-left corner.
                            <br>
                            Options are:
			       <ul>
				 <li><strong>Station Name</strong>, enter the station name 
                                     and press return.</li>
				 <li><strong>Latitude & Longitude Box</strong>, either 
				     enter the latitude and longitude of the lower-left and 
				     top-right points or auto-populate the fields by 
                                     clicking-and-dragging to draw a box within the interactive map.</li>
				 <li><strong>Vector</strong>, which automatically displays the 
				     GNSS vectors (see "Display Layers"), then select a range of 
                                     velocities with the slider.</p>
                             </li> </ul>
                     </ul></p>
</li>
<li style="list-style-type:none;">
	    <h5><strong>To select the InSAR products</strong></h5>
                 <p><ul>
		       <li style="list-style-type:disc;">After track selection, as described 
			   above, use the "Search InSAR by" dropdown menu to select a point or 
                           mark a region.
                           <br>
                           Options are:
                               <ul>
				 <li><strong>Point Location</strong>, clicking on the interactive 
                                     map to choose a point.</li>
				 <li><strong>Latitude & Longitude Box</strong>, either 
				     enter the latitude and longitude of the lower-left and 
				     top-right points or auto-populate the fields by 
                                     clicking-and-dragging to draw a box within the interactive map.</li>
                               </ul></li> 
                     </ul></p>
</li>
<li style="list-style-type:none;">
	    <h5><strong>To visualize the selected products</strong></h5>

                 <p>In the case where GNSS stations are selected individually or by a selection
                    criterion, or where InSAR is selected by points, the time series associated 
                    with those locations is available to view by selecting the “plotTS” button
                    in the table populated with selected points below the interactive map. In 
		    the case of GNSS, the reference frame may be changed by select one among 
		    the GNSS frame type buttons in the top-left and other buttons along the 
                    bottom can close, reset or save the time series; select “Help” for details.</p>
</li>
</ul>

	    <h4><strong>Select Points or Region to Download Data Subset</strong></h4>


                 <p>Once a product and specific points or regions have been selected, as described
                    above, users can download the subset of data by checking the box(es) in the 
                    left column of the table below the interactive map and selecting “Download”
		    in the top line of the right column the the table. 
		    For GNSS, this will prompt the user to choose a reference frame or download all: 
		    igb14 is the International GNSS Service’s (IGS’s) second version of the 
		    International Terrestrial Reference Frame (ITRF) 2014 (Altamimi et al., 2016); 
		    nam14 is relative to North America, defined for ITRF2014 (Altamimi et al., 2017); 
		    nam17 is relative to North America, defined by Kreemer et al. (2018); and pcf14 
		    is relative to the Pacific, defined for ITRF2014 (Altamimi et al., 2017).
                    The format is GAGE’s “pos” format.
                    For InSAR, this will download LOS time series data files in "csv" format for
		    selected points and composite velocity files in "csv' format for selected regions.
		    Click the downward arrow within a circle by "Select Track" dropdown menu to
                    download the full HDF5 file for the selected track at any time.</p>


	    <h4><strong>References</strong></h4>
                <p>Altamimi, Z., Métivier, L., Rebischung,P., and Rouby, H. (2017). 
                   ITRF2014 plate motion model. Geophysical Journal International, 209,
                   1906–1912.
                   <a href="https://doi.org/10.1093/gji/ggx136">https://doi.org/10.1093/gji/ggx136</a></p>

	    <h4><strong>Browser Requirements</strong></h4>

                 <p>This site supports the latest versions of
                    <a href="https://www.google.com/chrome/">Chrome</a>,
                    <a href="https://www.microsoft.com/en-us/windows/microsoft-edge">Microsoft Edge</a>,
                    <a href="https://www.mozilla.org/en-US/firefox/">Firefox</a>, and
                    <a href="https://www.apple.com/safari/">Safari</a>.</p>

		 <p>More information, including a complete model archive, can be found at: 
                    <a href="https://www.scec.org/research/cgm">https://www.scec.org/research/cgm</a>.</p>

</div>
</body>
</html>
