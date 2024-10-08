/***
   cgm_gnss.js
***/

var CGM_GNSS = new function () {

    var gnss_map_zoom_level = 6.5;
    var gnss_map_coordinates = [34.50, -118.57];

    // meters 22 - 35306
    this.cgm_vector_max = -1;
    this.cgm_vector_min = -1;
    this.cgm_vector_loc = 0;

    this.cgm_select_gid = [];

    this.ulabel_set=[];
    this.funny_set=[];

    // cgm_layers <= all marker layers for the stations/survey
    //               this is setup once from viewer.php
    this.cgm_layers = new L.FeatureGroup();

    // cgm_vectors <= all all velocity vectors in polyline layer -- linked to cgm_layers
    this.cgm_vectors = new L.FeatureGroup();
    this.cgm_vector_scale = new L.FeatureGroup();

    // select_result <<= some of selected from cgm_layers
    this.searching = false;
    this.search_result = new L.FeatureGroup();

    this.cont_site=[];
    this.surv_site=[];

    const frameType = {
        IGB14: 'igb14',
        NAM14: 'nam14',
        NAM17: 'nam17',
        PCF14: 'pcf14',
    };

    this.pointType = {
        CONTINUOUS_GPS: 'continuous',
        SURVEY_GPS:  'survey'
    };

        //normal2: '#F18F01',
    var cgm_colors = {
        normal: '#006E90',
        normal2: '#F16701',
        selected: '#B02E0C',
        abnormal: '#00FFFF',
    };

    var cgm_marker_style = {
        normal: {
            color: "white",
            fillColor: cgm_colors.normal,
            fillOpacity: 1,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        normal2: {
            color: "white",
            fillColor: cgm_colors.normal2,
            fillOpacity: 1,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        selected: {
            //color: cgm_colors.selected,
            fillColor: cgm_colors.selected,
            fillOpacity: 1,
            radius: 4,
            riseOnHover: true,
            weight: 1,
        },
        hover: {
            // color: cgm_colors.selected,
            // fillColor: cgm_colors.selected,
            fillOpacity: 1,
            radius: 10,
            weight: 2,
        },
    };

    // vector = path + head
    cgm_line_path_style = {};
    cgm_line_head_pattern = {};
    // just 1 set
    cgm_scale_line_path_style = {weight: 2, color: "#ff0000"};
    cgm_scale_line_head_pattern = {
        offset: '100%',
        repeat: 0,
        symbol: L.Symbol.arrowHead({
             pixelSize: 5,
             polygon: false,
             pathOptions: {
                 stroke: true,
                 color: "#ff0000",
                 weight: 2
             }
        })
    };

    this.defaultMapView = {
        coordinates: gnss_map_coordinates,
        zoom: gnss_map_zoom_level
    };

    this.searchType = {
        vectorSlider: 'vectorslider',
        latlon: 'latlon',
        stationName: 'stationname',
    };

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="11">Metadata for selected points will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeProduct = Products.GNSS;
        this.showProduct();
        $("div.control-container").hide();
        $("#cgm-gnss-controls-container").show();

    };

    this.upSelectCount = function(gid) {
       let i=this.cgm_select_gid.indexOf(gid); 
       if(i != -1) {
         window.console.log("this is bad.. already in selected list "+gid);
         return;
       }
 
       let tmp=this.cgm_select_gid.length;
       window.console.log("=====adding to list "+gid+" ("+tmp+")");
       this.cgm_select_gid.push(gid);
       updateDownloadCounter(this.cgm_select_gid.length);
    };

    this.downSelectCount = function(gid) {
       if(this.cgm_select_gid.length == 0) { // just ignore..
         return;
       }
       let i=this.cgm_select_gid.indexOf(gid); 
       if(i == -1) {
         window.console.log("this is bad.. not in selected list "+gid);
         return;
       }
       let tmp=this.cgm_select_gid.length;
//       window.console.log("=====remove from list "+gid+"("+tmp+")");
       this.cgm_select_gid.splice(i,1);
       updateDownloadCounter(this.cgm_select_gid.length);
    };

    this.zeroSelectCount = function() {
        this.cgm_select_gid = [];
        updateDownloadCounter(0);
    };

    // generate vector scale, if here is existing one, remove and regenerate
    this.generateVectorScale = function () {
        // clear old set
        this.cgm_vector_scale.eachLayer(function (layer) { viewermap.removeLayer(layer); });
        removeGNSSVectorColorLegend()

        let z=viewermap.getZoom();
        // bounds of the visible map
        let pbds=viewermap.getPixelBounds();
        let pmin=pbds['min'];
        let pmax=pbds['max'];

        // scale bar height = 34 pixels
        // vector bar target height = 34+17=51
        let targetx=pmin['x']+235;
        let targety=pmax['y']-55;

        if(this.cgm_vector_loc == 0) {
           targetx=pmin['x']+230;
           targety=pmax['y']-40;
           this.cgm_vector_loc=targety;
        }

        let start_latlng=viewermap.unproject([targetx,targety],z);

        let o_latlng=viewermap.unproject([pmin['x'],pmax['y']],z);

//window.console.log("origin >>"+pmin['x'],pmin['y']);
//window.console.log("zoom >>"+z);
//window.console.log("start_latlng>>",+start_latlng['lat'],start_latlng['lng']);
//addMarkerLayer(start_latlng['lat'], start_latlng['lng']);
//L.circleMarker([o_latlng['lat'], o_latlng['lng']], {color:'#FF0000'}).addTo(viewermap);

        let labelIcon = L.divIcon({ className: 'my-label', iconSize: [100, 30], iconAnchor: [-10, 20], html: `<span>20 mm/yr</span>` });
        let mylabel=L.marker(start_latlng, {icon: labelIcon});

        // 20mm 
        let end_latlng = calculateEndVectorLatLng(start_latlng, 0.02, 0, 1000000);
        let dist = calculateDistanceMeter(start_latlng, {'lat':end_latlng[0], 'lng':end_latlng[1]} );

        //addMarkerLayer(start_latlng.lat, start_latlng.lng);
        //addMarkerLayer(end_latlng[0],end_latlng[1]);
        let line_latlons = [
            [start_latlng.lat, start_latlng.lng],
            end_latlng
        ];
        let polyline = L.polyline(line_latlons, cgm_scale_line_path_style);
        let arrowHeadDecorator = L.polylineDecorator(polyline, {
                patterns: [cgm_scale_line_head_pattern]
        });

        // if checked, add to the map
        if ($("#cgm-model-gnss-vectors").prop('checked')) {
            polyline.addTo(viewermap);
            arrowHeadDecorator.addTo(viewermap);
            mylabel.addTo(viewermap);
            showGNSSVectorColorLegend();
        }
        this.cgm_vector_scale = new L.FeatureGroup([polyline, arrowHeadDecorator,mylabel]);
    }

    this.highlightStation = function(layer) {
        layer.setRadius(cgm_marker_style.hover.radius);
        if( layer.scec_properties.has_vector ) {
            layer.scec_properties.vector.setStyle(layer.scec_properties.vector_dist_path_style.hover);
            layer.scec_properties.vectorArrowHead.setPatterns([layer.scec_properties.vector_dist_head_pattern.hover]);                      
        } 
    };
    this.highlightStationByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.highlightStation(layer);
    };

    this.unhighlightStation = function(layer) {
        layer.setRadius(cgm_marker_style.normal.radius);
                             
        if( layer.scec_properties.has_vector ) {
          if (layer.scec_properties.selected) {
              layer.scec_properties.vector.setStyle(layer.scec_properties.vector_dist_path_style.selected);                             
              layer.scec_properties.vectorArrowHead.setPatterns([layer.scec_properties.vector_dist_head_pattern.selected]);
              } else {
                  layer.scec_properties.vector.setStyle(layer.scec_properties.vector_dist_path_style.normal);
                  layer.scec_properties.vectorArrowHead.setPatterns([layer.scec_properties.vector_dist_head_pattern.normal]);
          }
        } 
    };

    this.unhighlightStationByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.unhighlightStation(layer);
    };

    this.generateLayers = function () {

// setup gnss sites
        for (const idx in cgm_gnss_site_data) {
            if (cgm_gnss_site_data.hasOwnProperty(idx)) {
                let name = cgm_gnss_site_data[idx].ulabel;
                let type = cgm_gnss_site_data[idx].type;
                if(type == "cont") {
                    this.cont_site.push(name);
                    } else {
                       if(type == "surv") {
                           this.surv_site.push(name);
                           } else {
window.console.log( "This is bad..station "+name+" with bad type "+ type);
                       }
                }
            }
        }

// setup gnss stations 
        this.cgm_layers = new L.FeatureGroup();
        this.cgm_vectors = new L.FeatureGroup();
        for (const index in cgm_gnss_station_data) {
            if (cgm_gnss_station_data.hasOwnProperty(index)) {

let dumdum=cgm_gnss_station_data[index];
                let ulabel = cgm_gnss_station_data[index].ulabel;
                if( this.ulabel_set.includes(ulabel)) {
                  continue;
                }
                this.ulabel_set.push(ulabel);

                let lat = parseFloat(cgm_gnss_station_data[index].ref_nlat);
                let lon = parseFloat(cgm_gnss_station_data[index].ref_elong);

                let vel_north = parseFloat(cgm_gnss_station_data[index].dnodt);
                let vel_east = parseFloat(cgm_gnss_station_data[index].deodt);
                let vel_up = parseFloat(cgm_gnss_station_data[index].duodt);

                let vel_snd = parseFloat(cgm_gnss_station_data[index].snd);
                let vel_sed = parseFloat(cgm_gnss_station_data[index].sed);

                let vel_north_mm = (vel_north*1000).toFixed(3);
                let vel_east_mm = (vel_east*1000).toFixed(3);
                let vel_up_mm = (vel_up*1000).toFixed(3);
                let vel_snd_mm = (vel_snd*1000).toFixed(3);
                let vel_sed_mm = (vel_sed*1000).toFixed(3);

//sqrt("Vel E"^2 + "Vel N"^2)
                let horizontalVelocity = (Math.sqrt(Math.pow(vel_north_mm, 2) + Math.pow(vel_east_mm, 2))).toFixed(3);
//atan2("Vel E","Vel N")*180/pi
                let azimuth = (Math.atan2(vel_east_mm,vel_north_mm) * 180 / Math.PI).toFixed(3);
                let verticalVelocity = vel_up_mm;
                let station_id = cgm_gnss_station_data[index].dot;
                let station_type = cgm_gnss_station_data[index].stationtype;
                let gid = cgm_gnss_station_data[index].gid;

                while (lon < -180) {
                    lon += 360;
                }
                while (lon > 180) {
                    lon -= 360;
                }

// generate marker
                let marker;
		if(station_type == "continuous") {
                    marker = makeLeafletCircleMarker([lat, lon], cgm_marker_style.normal);
                }
		if(station_type == "survey") {
                    marker = makeLeafletCircleMarker([lat, lon], cgm_marker_style.normal2);
		}

                let station_info = `<strong>GNSS</strong><br>Station: ${station_id}<br>Horizontal Velocity: ${horizontalVelocity} mm/yr`;
                marker.bindTooltip(station_info).openTooltip();

                marker.scec_properties = {
                    station_id: station_id,
                    horizontalVelocity: horizontalVelocity,
                    verticalVelocity: verticalVelocity,
                    azimuth: azimuth,
                    vel_east: vel_east_mm,
                    vel_north: vel_north_mm,
                    has_vector: false,
                    type: station_type,
                    gid: gid,
                    ulabel : ulabel,
                    selected: false
                };

// only plot vector if ..
// both the "SNd" and "SEd" fields (fields 23 and 24) are less than 0.020 (20 mm/yr); and 
// (2) the velocity magnitude (sqrt("dN/dt"^2 + "dE/dt"^2) = sqrt(field20^2 + field21^2)) is less than 0.050 (50 mm/yr).
		if( isNaN(vel_east) || isNaN(vel_north) || isNaN(vel_up) ||
                    isNaN(vel_sed) || isNaN(vel_snd) ||
                    (vel_sed_mm > 20)  || (vel_snd > 20) || horizontalVelocity > 50 ) {
                    this.funny_set.push(ulabel);
                    this.cgm_layers.addLayer(marker);
                    continue;
                }

/*
                if( (vel_sed < 0.000020) && (vel_snd < 0.000020) && (vel_up < 0.000050) ) {
                  // go ahead and make vector..
                } else {
                    continue;
                }
*/

// generate vectors
                let start_latlng = marker.getLatLng();
                // in meter
                let end_latlng = calculateEndVectorLatLng(start_latlng, vel_north, vel_east, 1000000);
                let dist_m = calculateDistanceMeter(start_latlng, {'lat':end_latlng[0], 'lng':end_latlng[1]} );
                let dist = dist_m/1000;

//window.console.log("HERE dist_m..",dist);
                if (CGM_GNSS.cgm_vector_max == -1) {
                   CGM_GNSS.cgm_vector_max=dist;
                   CGM_GNSS.cgm_vector_min=dist;
                }
                if (dist > CGM_GNSS.cgm_vector_max) {
                   CGM_GNSS.cgm_vector_max = dist;
                }
                if (dist < CGM_GNSS.cgm_vector_min) {
                   CGM_GNSS.cgm_vector_min = dist;
                }

                // save the dist into cgm_gnss_station_data
                cgm_gnss_station_data[index].vector_dist=dist;

                let line_latlons = [
                    [start_latlng.lat, start_latlng.lng],
                    end_latlng
                ];

                let new_color= makeRGB(dist, CGM_GNSS.cgm_vector_max, CGM_GNSS.cgm_vector_min );

                // vector's polyline
                cgm_line_path_style = {
                    normal: {weight: 1, color: new_color },
                    hover:  {weight: 1, color: cgm_colors.selected },
                    selected: {weight: 1, color: cgm_colors.selected }
                                      };
                // vector's arrowhead
                cgm_line_head_pattern = {
                    normal : { offset: '100%',
                               repeat: 0,
                               symbol: L.Symbol.arrowHead({
                                   pixelSize: 5,
                                   polygon: false,
                                   pathOptions: {
                                      stroke: true,
                                      color: new_color,
                                      weight: 1
                                   }
                               })
                             },
                   hover : { offset: '100%',
                             repeat: 0,
                             symbol: L.Symbol.arrowHead({
                                 pixelSize: 10,
                                 polygon: false,
                                 pathOptions: {
                                    stroke: true,
                                    color: cgm_colors.selected,
                                    weight: 1
                                 }
                             })
                           },
                   selected : { offset: '100%',
                             repeat: 0,
                             symbol: L.Symbol.arrowHead({
                                 pixelSize: 5,
                                 polygon: false,
                                 pathOptions: {
                                    stroke: true,
                                    color: cgm_colors.selected,
                                    weight: 1
                                 }
                             })
                           },
                };


                let polyline = L.polyline(line_latlons, cgm_line_path_style.normal);
                var arrowHeadDecorator = L.polylineDecorator(polyline, {
                    patterns: [cgm_line_head_pattern.normal]
                });

                marker.scec_properties.has_vector=true;
                marker.scec_properties.vector_dist = cgm_gnss_station_data[index].vector_dist;
                marker.scec_properties.vector_dist_path_style = cgm_line_path_style;
                marker.scec_properties.vector_dist_head_pattern = cgm_line_head_pattern;

                // marker.scec_properties.vector = new L.FeatureGroup([polyline, arrowHeadDecorator]);
                marker.scec_properties.vector = new L.FeatureGroup();
                marker.scec_properties.vector.addLayer(polyline);
                marker.scec_properties.vector.addLayer(arrowHeadDecorator);
                marker.scec_properties.vectorArrowHead = arrowHeadDecorator;

                this.cgm_vectors.addLayer(marker.scec_properties.vector);
                this.cgm_layers.addLayer(marker);
            }
        }

window.console.log("  || ");
window.console.log("  ||  MAX found is "+ CGM_GNSS.cgm_vector_max);
window.console.log("  ||  MIN found is "+ CGM_GNSS.cgm_vector_min);
window.console.log("  ||  total number of sites..",this.ulabel_set.length);
window.console.log("  ||  total number of funny sites..",this.funny_set.length);
window.console.log("  ||  total number of continous sites..",this.cont_site.length);
window.console.log("  ||  total number of survey sites..",this.surv_site.length);
window.console.log("  || ");

        this.generateVectorScale();

        this.cgm_layers.on('click', function(event) {
            if(activeProduct == Products.GNSS) { 
window.console.log(" Clicked on a layer--->"+ event.layer.scec_properties.station_id);
               CGM_GNSS.toggleStationSelected(event.layer, true);
            }

        });

        this.cgm_layers.on('mouseover', function(event) {
            let layer = event.layer;
            CGM_GNSS.highlightStation(layer);
        });


        this.cgm_layers.on('mouseout', function(event) {
            let layer = event.layer;
            CGM_GNSS.unhighlightStation(layer);
        });

    };

    //
    this.toggleStationSelected = function(layer, clickFromMap=false) {
        if (typeof layer.scec_properties.selected === 'undefined') {
            layer.scec_properties.selected = true;
        } else {
            layer.scec_properties.selected = !layer.scec_properties.selected;
        }

        if (layer.scec_properties.selected) {
            this.selectStationByLayer(layer, clickFromMap);
            // if this station is not in search result, should add it in 
            let i=this.search_result.getLayerId(layer);
            if(!containsLayer(this.search_result,layer)) {
                let tmp=this.search_result;
                this.search_result.addLayer(layer);
            }
        } else {
            this.unselectStationByLayer(layer);
        }

       return layer.scec_properties.selected;
    };

    this.toggleStationSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.toggleStationSelected(layer, false);
    };

    this.selectStationByLayer = function (layer, moveTableRow=false) {
        layer.scec_properties.selected = true;
        layer.setStyle(cgm_marker_style.selected);
        if( layer.scec_properties.has_vector ) {
          layer.scec_properties.vector.setStyle(layer.scec_properties.vector_dist_path_style.selected);
          layer.scec_properties.vectorArrowHead.setPatterns([layer.scec_properties.vector_dist_head_pattern.selected]);
        }
        let gid = layer.scec_properties.gid;

        let $row = $(`tr[data-point-gid='${gid}'`);
        let rowHTML = "";
        if ($row.length == 0) {
           this.addToResultsTable(layer);
        }

        $row = $(`tr[data-point-gid='${gid}'`);
        $row.addClass('row-selected');

        let $glyphElem = $row.find('span.cgm-data-row');
        $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');

        this.upSelectCount(gid);

        // move row to top
        if (moveTableRow) {
            let $rowHTML = $row.prop('outerHTML');
            $row.remove();
            $("#metadata-viewer.gnss tbody").prepend($rowHTML);
        }
    };

    this.unselectStationByLayer = function (layer) {
        layer.scec_properties.selected = false;

	let prop=layer.scec_properties;
	if(prop.type == "continuous") { layer.setStyle(cgm_marker_style.normal); }
	if(prop.type == "survey") { layer.setStyle(cgm_marker_style.normal2); }

        if( layer.scec_properties.has_vector ) {
          layer.scec_properties.vector.setStyle(layer.scec_properties.vector_dist_path_style.normal);
          layer.scec_properties.vectorArrowHead.setPatterns([layer.scec_properties.vector_dist_head_pattern.normal]);
        }

        let gid = layer.scec_properties.gid;

        let $row = $(`tr[data-point-gid='${gid}'`);
        $row.removeClass('row-selected');
        let $glyphElem = $row.find('span.cgm-data-row');
        $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');

        this.downSelectCount(gid);
    };

    // this.showStationByLayer = function(layer) {
    //
    // };
    //
    // this.showStationByGid = function (gid) {
    //     let layer = this.getLayerByGid(gid);
    //     this.selectStationByLayer(layer);
    // };

    this.showStationsByLayers = function(layers) {
        viewermap.addLayer(layers);
        var cgm_object = this;
/** ???
        this.search_result.eachLayer(function(layer){
            cgm_object.addToResultsTable(layer);
        });
**/
    };


    // this.hideStationByGid = function (gid) {
    //    let layer = this.getLayerByGid(gid);
    //    this.unselectStationByLayer(layer);
    // };


    this.toggleSelectAll = function() {
        var cgm_object = this;

        let $selectAllButton = $("#cgm-allBtn span");
        if (!$selectAllButton.hasClass('glyphicon-check')) {
            this.search_result.eachLayer(function(layer){
                cgm_object.selectStationByLayer(layer);
            });
            $selectAllButton.addClass('glyphicon-check').removeClass('glyphicon-unchecked');
        } else {
            this.unselectAll();

        }
    };

    this.unselectAll = function() {
        var cgm_object = this;

        let $selectAllButton = $("#cgm-allBtn span");
        this.search_result.eachLayer(function(layer){
            cgm_object.unselectStationByLayer(layer);
        });
        $("#cgm-allBtn span").removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    };

    // unselect every layer
    this.clearAllSelections = function() {
        var cgm_object = this;
        this.cgm_layers.eachLayer(function(layer){
            if (layer.scec_properties.selected) {
                cgm_object.unselectStationByLayer(layer);
            }
        });
        $("#metadata-viewer.gnss tr.row-selected button span.glyphicon.glyphicon-check").removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        $("#metadata-viewer.gnss tr.row-selected").removeClass('row-selected');
    };



    this.getLayerByGid = function(gid) {
        let foundLayer = false;
        this.cgm_layers.eachLayer(function(layer){
          if (layer.hasOwnProperty("scec_properties")) {
             if (gid == layer.scec_properties.gid) {
                 foundLayer = layer;
             }
          }
       });
       return foundLayer;
    };



    this.addToResultsTable = function(layer) {
        let $table = $("#metadata-viewer.gnss tbody");
        let gid = layer.scec_properties.gid;

        if ($(`tr[data-point-gid='${gid}'`).length > 0) {
            return;
        }

        let html = generateTableRow(layer);

        $table.find("tr#placeholder-row").remove();
        $table.prepend(html);
    };

    this.removeFromResultsTable = function (gid) {
        $(`#metadata-viewer tbody tr[data-point-gid='${gid}']`).remove();
    };

    this.executePlotTS = function(downloadURL, fType) {
      showTSview(downloadURL,Products.GNSS,fType);
      showPlotTSWarning()

    }

    this.downloadURLsAsZip = function(ftype) {
        var nzip=new JSZip();
        var layers=CGM_GNSS.search_result.getLayers();
        let timestamp=$.now();


        let zcnt=0;    
        var cnt=layers.length;
        for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }
      
          if(ftype == frameType.IGB14 || ftype == "all") {
            zcnt++;
            let downloadURL = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.IGB14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
          if(ftype == frameType.NAM14 || ftype == "all") {
            zcnt++;
            let downloadURL = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.NAM14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
          if(ftype == frameType.NAM17 || ftype == "all") {
            zcnt++;
            let downloadURL = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.NAM17);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
          if(ftype == frameType.PCF14 || ftype == "all") {
            zcnt++;
            let downloadURL = getDataDownloadURL(layer.scec_properties.ulabel,layer.scec_properties.station_id,frameType.PCF14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
        }
      
      
        if(zcnt == 0) {
          alert(" No available file for download");
          return;
          } else {
            var zipfname="CGM_GNSS_"+timestamp+".zip"; 
            nzip.generateAsync({type:"blob"}).then(function (content) {
            // see FileSaver.js
            saveAs(content, zipfname);
            })
        }
    }

    var generateTableRow = function(layer) {
        let $table = $("#metadata-viewer");
        let html = "";

        let coordinates = layer.getLatLng();
        coordinates = {lat: parseFloat(coordinates.lat).toFixed(2), lng: parseFloat(coordinates.lng).toFixed(2) };

        let downloadURL1 = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.IGB14);
        let downloadURL2 = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.NAM14);
        let downloadURL3 = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.NAM17);
        let downloadURL4 = getDataDownloadURL(layer.scec_properties.ulabel, layer.scec_properties.station_id,frameType.PCF14);

        html += `<tr data-point-gid="${layer.scec_properties.gid}">`;
        html += `<td style="width:25px" class="cgm-data-click cgm-data-hover button-container"> <button class="btn btn-sm cxm-small-btn" id="" title="highlight the station" onclick=''>
            <span class="cgm-data-row glyphicon glyphicon-unchecked"></span>
        </button></td>`;
        html += `<td class="cgm-data-click cgm-data-hover">${layer.scec_properties.station_id}</td>`;

        html += `<td class="cgm-data-click">${coordinates.lat}</td>`;
        html += `<td class="cgm-data-click">${coordinates.lng}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.type} </td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.vel_east} </td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.vel_north} </td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.horizontalVelocity}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.azimuth}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.verticalVelocity}</td>`;
        html += `<td class="text-center">`;
        html += `<button class=\"btn btn-xs\" title=\"show time series\" onclick=CGM_GNSS.executePlotTS([\"${downloadURL1}\",\"${downloadURL2}\",\"${downloadURL3}\",\"${downloadURL4}\"],[\"igb14\",\"nam14\",\"nam17\",\"pcf14\"])>plotTS&nbsp<span class=\"fa fa-chart-line\"></span></button>`;
        html += `</tr>`;

        return html;
    };

    this.showSearch = function (type) {
        const $all_search_controls = $("#cgm-gnss-controls-container ul li");
        switch (type) {
            case this.searchType.vectorSlider:
                $all_search_controls.hide();
                // if vector is not showing..
		if(! $("#cgm-model-gnss-vectors").prop('checked')) {
		  $("#cgm-model-gnss-vectors").click();
                }
                $("#cgm-gnss-vector-slider").show();
                skipDrawRectangle();
                break;
            case this.searchType.stationName:
                $all_search_controls.hide();
                $("#cgm-gnss-station-name").show();
                skipDrawRectangle();
                break;
            case this.searchType.latlon:
                $all_search_controls.hide();
                $("#cgm-gnss-latlon").show();
                addDrawRectangle();
                break;
            default:
                $all_search_controls.hide();
                skipDrawRectangle();
        }
    };

    this.showProduct = function () {

        showGNSSColorLegend();

window.console.log("SHOW product");
        let $cgm_model_checkbox = $("#cgm-model-gnss");

        if (this.searching) {
            this.search_result.addTo(viewermap);
        } else {
            this.cgm_layers.addTo(viewermap);
        }

        if (!$cgm_model_checkbox.prop('checked')) {
            $cgm_model_checkbox.prop('checked', true);
        }

        if (currentLayerName != 'esri topo') {
            switchLayer('esri topo');
            $("#mapLayer").val('esri topo');
        }

    };

    
    this.hideProduct = function () {

        removeGNSSColorLegend();

        let $cgm_model_checkbox = $("#cgm-model-gnss");
        if ($cgm_model_checkbox.prop('checked')) {
            $cgm_model_checkbox.prop('checked', false);
        }
        if (CGM_GNSS.searching) {
            CGM_GNSS.search_result.remove();
        } else {
            this.cgm_layers.remove();
        }

    };

// reset everything
    this.reset = function() {
window.console.log("gnss calling --->> reset");
        $("#wait-spinner").hide();
        this.zeroSelectCount();
        this.showSearch('none');
        this.searching = false;

        viewermap.removeLayer(this.search_result);
        this.search_result = new L.FeatureGroup();

        this.hideVectors();
        this.showProduct();

        remove_bounding_rectangle_layer();
        this.replaceResultsTableBody([]);

        skipDrawRectangle();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        $("#cgm-gnss-controls-container input, #cgm-gnss-controls-container select").val("");

        this.resetVectorSlider();
        this.clearAllSelections();
    };

// reset just the search only
    this.resetSearch = function (){
window.console.log("gnss calling --->> resetSearch.");
        $("#wait-spinner").hide();

        this.searching = false;
        viewermap.removeLayer(this.search_result);
        this.search_result = new L.FeatureGroup();

        this.replaceResultsTableBody([]);
        skipDrawRectangle();
        remove_bounding_rectangle_layer();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        this.clearAllSelections();
    };

// a complete fresh search
    this.freshSearch = function (){

window.console.log(">>> calling freshSearch..");
        $("#cgm-gnss-controls-container input").val("");
        this.resetVectorSlider();
        this.resetSearch();

        if ($("#cgm-model-gnss-vectors").prop('checked')) {
          this.showVectors();
          } else {
            this.hideVectors();
        }

        // show GNSS product
        if ($("#cgm-model-gnss").prop('checked')) {
          this.showProduct();
          } else {
          this.hideProduct();
        }

        // show InSAR product
        if ($("#cgm-model-insar").prop('checked')) {
          CGM_INSAR.showProduct();
          } else {
          CGM_INSAR.hideProduct();
        }

        if ($("#cgm-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
          CXM.hideCFMFaults(viewermap);
        }
    };


    this.getMarkerByStationId = function (station_id) {
        for (const index in cgm_gnss_station_data) {
            if (cgm_gnss_station_data[index].station_id == station_id) {
                return cgm_gnss_station_data[index];
            }
        }

        return [];
    };


    this.showVectors = function () {
        if (this.searching) {
            this.search_result.eachLayer(function (layer) {
                if(layer.scec_properties.has_vector) {
                  viewermap.addLayer(layer.scec_properties.vector);
                }
            });
        } else {
            this.cgm_layers.eachLayer(function (layer) {
                if(layer.scec_properties.has_vector) {
                  viewermap.addLayer(layer.scec_properties.vector);
                }
            });
        }
        this.cgm_vector_scale.eachLayer(function (layer) {
            viewermap.addLayer(layer);
        });
        showGNSSVectorColorLegend();
    };


    this.updateVectors = function() {
        this.cgm_vectors.eachLayer(function(layer) {
            viewermap.removeLayer(layer);
        });

        this.showVectors();
    };

    this.hideVectors = function() {

        if (this.searching) {
            this.search_result.eachLayer(function(layer){
                if(layer.scec_properties.has_vector) {
                  viewermap.removeLayer(layer.scec_properties.vector);
                }
            });
        } else {
            this.cgm_vectors.eachLayer(function(layer) {
                viewermap.removeLayer(layer);
            });
        }

        this.cgm_vector_scale.eachLayer(function (layer) {
            viewermap.removeLayer(layer);
        });
        removeGNSSVectorColorLegend();

        if ($("#cgm-model-gnss-vectors").prop('checked')) {
            $("#cgm-model-gnss-vectors").prop('checked', false);
        }
    };

        var calculateEndVectorLatLng = function (start_latlng, vel_north, vel_east, scaling_factor) {
            // see https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
            let dy = vel_north * scaling_factor;
            let dx = vel_east * scaling_factor;
            let r_earth = 6371e3; // metres
            let pi = Math.PI;

            let start_lat = start_latlng.lat;
            let start_lng = start_latlng.lng;
            let end_lat = start_lat + (dy / r_earth) * (180 / pi);
            let end_lng = start_lng + (dx / r_earth) * (180 / pi) / Math.cos(start_lat * pi / 180);

//calculateDistanceMeter({'lat':50.03, 'lng':-5.5 }, {'lat':58.5, 'lng':-3.04} );
//let d= calculateDistanceMeter({'lat':start_lat,'lng':start_lng}, {'lat':end_lat, 'lng':end_lng} );

            return [end_lat, end_lng];
        };

        var calculateDistanceMeter = function (start_latlng, end_latlng) {
             let start_lat = start_latlng.lat;
             let start_lng = start_latlng.lng;
             let end_lat = end_latlng.lat;
             let end_lng = end_latlng.lng;

             if( (start_lat == end_lat) && (start_lng == end_lng) ) {
               return 0;
             }

             // from http://www.movable-type.co.uk/scripts/latlong.html
             const R = 6371e3; // metres
             const theta1 = start_lat * Math.PI/180; // φ, λ in radians
             const theta2 = end_lat * Math.PI/180;   
             const deltaTheta = (end_lat-start_lat) * Math.PI/180;
             const deltaLamda = (end_lng-start_lng) * Math.PI/180;

             const a = Math.sin(deltaTheta/2) * Math.sin(deltaTheta/2) +
                       Math.cos(theta1) * Math.cos(theta2) *
                       Math.sin(deltaLamda/2) * Math.sin(deltaLamda/2);
             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
             var d = R * c; // in metres
             return d;
        }

        this.search = function (type, criteria) {
window.console.log("gnss --->> calling search.. <<----");
            let results = [];
            switch (type) {
                case CGM_GNSS.searchType.vectorSlider:
                    $("#cgm-minVectorSliderTxt").val(Math.floor(criteria[0]*10000)/10000);
                    $("#cgm-maxVectorSliderTxt").val(Math.floor(criteria[1]*10000)/10000);
                    this.cgm_layers.eachLayer(function (layer) {
                        if (layer.scec_properties.has_vector 
			      &&  layer.scec_properties.vector_dist > criteria[0]
                                && layer.scec_properties.vector_dist < criteria[1]){
                            results.push(layer);
                        }
                    });

                    break;
                case CGM_GNSS.searchType.stationName:
                    this.cgm_layers.eachLayer(function (layer) {
                        // if (layer.scec_properties.station_id.toLowerCase() == criteria.toLowerCase()) {
                        if (layer.scec_properties.station_id.toLowerCase().indexOf(criteria.toLowerCase()) > -1){
                            results.push(layer);
                        }
                    });
                    break;

                case CGM_GNSS.searchType.latlon:
                    $("#cgm-firstLatTxt").val(criteria[0]);
                    $("#cgm-firstLonTxt").val(criteria[1]);
                    $("#cgm-secondLatTxt").val(criteria[2]);
                    $("#cgm-secondLonTxt").val(criteria[3]);
                    remove_bounding_rectangle_layer();
                    add_bounding_rectangle(criteria[0],criteria[1],criteria[2],criteria[3]);
                    this.cgm_layers.eachLayer(function(layer){
                            let bounds = L.latLngBounds([criteria[0], criteria[1]], [criteria[2], criteria[3]]);
                            if (bounds.contains(layer.getLatLng())) {
                               results.push(layer);
                            }
                    });
                    break;
            }

            results = results.sort(function(a,b){
                a = a.scec_properties.station_id;
                b = b.scec_properties.station_id;
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            return results;
        };

        this.searchBox = function (type, criteria) {
window.console.log("gnss --->> calling searchBox");
            this.hideProduct();
            this.resetSearch();

            this.searching = true;
            let results = this.search(type, criteria);

            if (results.length === 0) {
                viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
            } else {
                let markerLocations = [];

                for (let i = 0; i < results.length; i++) {
                    markerLocations.push(results[i].getLatLng());
                    this.search_result.addLayer(results[i]);
                }
                this.showStationsByLayers(this.search_result);

                // changed visible stations, so update vectors
                if (vectorVisible()) {
                    this.updateVectors();
                }

                if( !modelVisible()) {
                    this.showProduct();
                }

                if (type == this.searchType.latlon) {
                    this.unselectAll();
                    markerLocations.push(L.latLng(criteria[0],criteria[1]));
                    markerLocations.push(L.latLng(criteria[2],criteria[3]));
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.fitBounds(bounds, {maxZoom: 12});
                    skipDrawRectangle();

                } else if (type == this.searchType.stationName) {
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.flyToBounds(bounds, {maxZoom: 12 });
                } else { // vector slider.. similar to stationName
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.flyToBounds(bounds, {maxZoom: 12 });
                }
            }

            this.replaceResultsTableBody(results);
window.console.log("DONE with BoxSearch..");

            $("#wait-spinner").hide();
        };

        var vectorVisible = function (){
            return $("#cgm-model-gnss-vectors").prop('checked');
        };

        var modelVisible = function (){
            return $("#cgm-model-gnss").prop('checked');
        };

        // private function
       var generateResultsTable = function (results) {

window.console.log("generateResultsTable..");

            var html = "";
            html+=`
<thead>
<tr>
                         <th class="text-center button-container" style="width:2rem">
                             <button id="cgm-allBtn" class="btn btn-sm cxm-small-btn" title="select all visible stations" onclick="CGM_GNSS.toggleSelectAll();">
                             <span class="glyphicon glyphicon-unchecked"></span>
                             </button>
                         </th>
                         <th class="hoverColor" onClick="sortMetadataTableByRow(1,'a')">Station&nbsp<span id='sortCol_1' class="fas fa-angle-down"></span><br>Name</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'n')">Lat&nbsp<span id='sortCol_2' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">Lon&nbsp<span id='sortCol_3' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(4,'a')" style="width:6rem" >Type&nbsp<span id='sortCol_5' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')">East Vel&nbsp<span id='sortCol_5' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(6,'n')">North Vel&nbsp<span id='sortCol_6' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(7,'n')">Horizontal&nbsp<span id='sortCol_7' class="fas fa-angle-down"></span><br>Vel (mm/yr)</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(8,'n')">Azimuth&nbsp<span id='sortCol_8' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(9,'n')">Vertical Vel&nbsp<span id='sortCol_9' class="fas fa-angle-down"></span><br>(mm/yr)</th>

<!-- 
<button id="infoBtn" class="btn cgm-small-btn" data-toggle="modal" data-target="#modalazimuth"><span class="fas fa-info-circle"></span> 
-->

                        <th style="width:20%;"><div class="col text-center">
<!--download all -->
                            <div class="btn-group download-now">
                                <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" disabled>
                                    DOWNLOAD&nbsp<span id="download-counter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <button class="dropdown-item" type="button" value="igb14"
                                            onclick="CGM_GNSS.downloadURLsAsZip(this.value);">igb14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam14"
                                            onclick="CGM_GNSS.downloadURLsAsZip(this.value);">nam14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam17"
                                            onclick="CGM_GNSS.downloadURLsAsZip(this.value);">nam17
                                    </button>
                                    <button class="dropdown-item" type="button" value="pcf14"
                                            onclick="CGM_GNSS.downloadURLsAsZip(this.value);">pcf14
                                    </button>
                                    <button class="dropdown-item" type="button" value="all"
                                          onclick="CGM_GNSS.downloadURLsAsZip(this.value);">All of the Above
                                    </button>
                                </div>
                            </div>
                        </th>
</tr>
</thead>
<tbody>`;

            for (let i = 0; i < results.length; i++) {
                html += generateTableRow(results[i]);
                // CGM_GNSS.selectStationByLayer(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            html=html+"</tbody>";
            return html;
        };

       var changeResultsTableBody = function (results) {
window.console.log("changeResultsTableBody..");
            var html = "";
            for (let i = 0; i < results.length; i++) {
                html += generateTableRow(results[i]);
                // CGM_GNSS.selectStationByLayer(results[i]);
            }
            if (results.length == 0) {
                html += tablePlaceholderRow;
            }
            return html;
        };

   
        this.replaceResultsTableBody = function(results) {
            window.console.log("calling replaceResultsTableBody");
            $("#metadata-viewer tbody").html(changeResultsTableBody(results));
        };

        this.replaceResultsTable = function(results) {
            window.console.log("calling replaceResultsTable");
            $("#metadata-viewer").html(generateResultsTable(results));
        };

/******
OLD:
http://geoweb.mit.edu/~floyd/scec/cgm/ts/<cont_site>.cgm.wmrss_<frame>.pos
http://geoweb.mit.edu/~floyd/scec/cgm/ts/<surv_site>.cgm.final_<frame>.pos

GNSS:
https://files.scec.org/s3fs-public/projects/cgm/2.0.0/data/gnss/pos
 
where <cont_site> is a four-character continuous site ID 
from the attached cont_site.txt file, 

<surv_site> is a four-character survey site ID from the
     attached surv_site.txt file,
<frame> is "igb14", "nam14", "nam17" or "pcf14".

http://geoweb.mit.edu/~floyd/scec/cgm/ts/TWMS.cgm.wmrss_igb14.pos
******/
        var getDataDownloadURL = function(station_ulabel, station_id, frame)  {
          let urlPrefix = "https://files.scec.org/s3fs-public/projects/cgm/2.0.0/data/gnss/pos/"+frame;
          if(CGM_GNSS.cont_site.includes(station_ulabel)) {
            let url=urlPrefix +"/"+station_id + ".cgm.wmrss_"+frame+".pos";
            return url;
            } else if (CGM_GNSS.surv_site.includes(station_ulabel)) {
              let url=urlPrefix + "/" + station_id + ".cgm.final_"+frame+".pos";
              return url;
              } else {
                  window.console.log("BAD station name..");
                  return null;
          } 
        };

        var resetVectorRangeColor = function (target_min, target_max){
          let minRGB= makeRGB(target_min, CGM_GNSS.cgm_vector_max, CGM_GNSS.cgm_vector_min );
          let maxRGB= makeRGB(target_max, CGM_GNSS.cgm_vector_max, CGM_GNSS.cgm_vector_min );
          let myColor="linear-gradient(to right, "+minRGB+","+maxRGB+")";
          $("#slider-vector-range .ui-slider-range" ).css( "background", myColor );
        }

        this.resetVectorSlider = function () {
          $("#slider-vector-range").slider('values', 
                              [CGM_GNSS.cgm_vector_min, CGM_GNSS.cgm_vector_max]);
          $("#cgm-minVectorSliderTxt").val(Math.floor(CGM_GNSS.cgm_vector_min*10000)/10000);
          $("#cgm-maxVectorSliderTxt").val(Math.floor(CGM_GNSS.cgm_vector_max*10000)/10000);
        }

        this.setupInterface = function() {

	    setup_infoTSTable('gnss');
            $("#infoGNSSBtn").css('display','');

            var $download_queue_table = $('#metadata-viewer');
            var sz=0;
            if(cgm_gnss_station_data != null) {
                sz=cgm_gnss_station_data.length;
            }
window.console.log("setupInterface: retrieved stations "+sz);

            this.activateData();

            $("#cgm-controlers-container").css('display','none');
            $("#cgm-gnss-controlers-container").css('display','');
            $("#insar-track-controls").css('display','none');
            $("#downloadInSARBtn").css('display','none');
            $("#infoInSARBtn").css('display','none');

            removeINSARColorLegend();
            showGNSSColorLegend();

//$("div.mapData div.map-container").removeClass("col-7 pr-0 pl-2").addClass("col-12").css('padding-left','30px');

            $("div.mapData div.map-container").css('padding-left','30px');
            $("#CGM_plot").css('height','600px');
            viewermap.invalidateSize();
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
            $download_queue_table.floatThead('destroy');

            this.replaceResultsTable([]);
            $download_queue_table.addClass('gnss');
            $("#data-product-select").val("gnss");

            $download_queue_table.floatThead({
                 // floatTableClass: 'cgm-metadata-header',
                 scrollContainer: function ($table) {
                     return $table.closest('div#metadata-viewer-container');
                 },
            });

/* setup vector slider*/
            $("#slider-vector-range").slider({ 
                      range:true, step:0.01, min:CGM_GNSS.cgm_vector_min, max:CGM_GNSS.cgm_vector_max, values:[CGM_GNSS.cgm_vector_min, CGM_GNSS.cgm_vector_max],
                  slide: function( event, ui ) {
                               $("#cgm-minVectorSliderTxt").val(Math.floor(ui.values[0]*10000)/10000);
                               $("#cgm-maxVectorSliderTxt").val(Math.floor(ui.values[1]*10000)/10000);
                               resetVectorRangeColor(ui.values[0],ui.values[1]);
                         },
                  change: function( event, ui ) {
                               $("#cgm-minVectorSliderTxt").val(Math.floor(ui.values[0]*10000)/10000);
                               $("#cgm-maxVectorSliderTxt").val(Math.floor(ui.values[1]*10000)/10000);
                               resetVectorRangeColor(ui.values[0],ui.values[1]);
                         },
                  stop: function( event, ui ) {
                               let searchType = CGM_GNSS.searchType.vectorSlider;
                               CGM_GNSS.searchBox(searchType, ui.values);
                         },
                  create: function() {
                              $("#cgm-minVectorSliderTxt").val(Math.floor(CGM_GNSS.cgm_vector_min*10000)/10000);
                              $("#cgm-maxVectorSliderTxt").val(Math.floor(CGM_GNSS.cgm_vector_max*10000)/10000);
                        }
            });
            $('#slider-vector-range').slider("option", "min", Math.floor(CGM_GNSS.cgm_vector_min*10000)/10000);
            $('#slider-vector-range').slider("option", "max", Math.floor(CGM_GNSS.cgm_vector_max*10000)/10000);

            viewermap.on("zoomend dragend panend",function() {
                 CGM_GNSS.generateVectorScale();

// update the marker size in demand
		let zoom=viewermap.getZoom();
                let target = 3; // default, zoom=7, radius=4
                if(zoom > 7)  {
                   target = (zoom > 9) ? 6 : (zoom - 7)+target;
                }
//window.console.log("zoom is "+zoom+ " target size is "+target);
                if(cgm_marker_style.normal.radius == target) { // no changes..
                   return;
                }
                cgm_marker_style.normal.radius=target;
                cgm_marker_style.normal2.radius=target;
                cgm_marker_style.selected.radius=target;
                cgm_marker_style.hover.radius = (target *3) ;
    
//window.console.log(" RESIZE: marker zoom("+zoom+") radius "+target);
                CGM_GNSS.cgm_layers.eachLayer(function(layer){
		  layer.setRadius(target);
                });

            });


            $("#wait-spinner").hide();
        };

	function _resetRadius(layer) {
            layer.setRadius(cgm_marker_style.normal.radius);
        }

        this.downloadHorizontalVelocities = function(gid_list) { // TODO };

    };

}
