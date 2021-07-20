/***
   cgm_model.js
***/

var CGM = new function () {

    // meters 22 - 35306
    this.cgm_vector_max = 50000;
    this.cgm_vector_min = 0;

    this.cgm_select_gid = [];
    this.cgm_layers = new L.FeatureGroup();
    this.cgm_vectors = new L.FeatureGroup();
    this.search_result = new L.FeatureGroup();
    this.searching = false;

    const frameType = {
        IGB14: 'igb14',
        NAM14: 'nam14',
        NAM17: 'nam17',
        PCF14: 'pcf14',
    };

    this.pointType = {
        CONTINUOUS_GPS: 'continuous',
        CAMPAIGN_GPS:  'campaign',
        GRID: 'grid',
    };

    var cgm_colors = {
        normal: '#006E90',
        selected: '#B02E0C',
    };

    var cgm_marker_style = {
        normal: {
            color: cgm_colors.normal,
            fillColor: cgm_colors.normal,
            fillOpacity: 0.5,
            radius: 3,
            riseOnHover: true,
            weight: 1,
        },
        selected: {
            color: cgm_colors.selected,
            fillColor: cgm_colors.selected,
            fillOpacity: 1,
            radius: 3,
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
    var cgm_line_path_style = {weight: 1, color: cgm_colors.normal};
    var cgm_line_pattern = {
        offset: '100%',
        repeat: 0,
        symbol: L.Symbol.arrowHead({
            pixelSize: 5,
            polygon: false,
            pathOptions: {
                stroke: true,
                color: cgm_colors.normal,
                weight: 1
            }
        })
    };

    this.defaultMapView = {
        // coordinates: [34.3, -118.4],
        coordinates: [34.16, -118.57],
        zoom: 7
    };

    this.searchType = {
        latlon: 'latlon',
        stationName: 'stationname',
    };

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="7">Metadata for selected points will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeModel = Models.CGM;
        this.showModel();
        $("div.control-container").hide();
        $("#cgm-controls-container").show();

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
window.console.log("calling zeroSelectCount..");
       updateDownloadCounter(0);
    };

    this.generateLayers = function () {
        this.cgm_layers = new L.FeatureGroup();
        this.cgm_vectors = new L.FeatureGroup();
        for (const index in cgm_station_data) {
            if (cgm_station_data.hasOwnProperty(index)) {
                let lat = parseFloat(cgm_station_data[index].ref_north_latitude);
                let lon = parseFloat(cgm_station_data[index].ref_east_longitude);
                let vel_north = parseFloat(cgm_station_data[index].ref_velocity_north);
                let vel_east = parseFloat(cgm_station_data[index].ref_velocity_east);
                let horizontalVelocity = Math.sqrt(Math.pow(vel_north, 2) + Math.pow(vel_east, 2));
                let station_id = cgm_station_data[index].station_id;
                let station_type = cgm_station_data[index].station_type;
                let gid = cgm_station_data[index].gid;

                while (lon < -180) {
                    lon += 360;
                }
                while (lon > 180) {
                    lon -= 360;

                }

                let marker = L.circleMarker([lat, lon], cgm_marker_style.normal);

                let horizontalVelocity_mm = (horizontalVelocity * 1000).toFixed(2); // convert to mm/year
                let station_info = `station id: ${station_id}, vel: ${horizontalVelocity_mm} mm/yr`;//, lat/lng: ${lat}, ${lon}`;
                marker.bindTooltip(station_info).openTooltip();
                marker.scec_properties = {
                    station_id: station_id,
                    horizontalVelocity: horizontalVelocity_mm,
                    vel_east: cgm_station_data[index].ref_velocity_east,
                    vel_north: cgm_station_data[index].ref_velocity_north,
                    type: station_type,
                    gid: gid,
                    selected: false,
            };

                // generate vectors
                let start_latlng = marker.getLatLng();
                let end_latlng = calculateEndVectorLatLng(start_latlng, vel_north, vel_east, 750);
                let dist = calculateDistanceMeter(start_latlng, {'lat':end_latlng[0], 'lng':end_latlng[1]} );
                let p = dist / (CGM.cgm_vector_max - CGM.cgm_vector_min);

                let line_latlons = [
                    [start_latlng.lat, start_latlng.lng],
                    end_latlng
                ];

// var cgm_line_path_style = {weight: 1, color: cgm_colors.normal};
                let polyline = L.polyline(line_latlons, cgm_line_path_style);
                var arrowHeadDecorator = L.polylineDecorator(polyline, {
                    patterns: [cgm_line_pattern]
                });

                // marker.scec_properties.vector = new L.FeatureGroup([polyline, arrowHeadDecorator]);
                marker.scec_properties.vector = new L.FeatureGroup();
                marker.scec_properties.vector.addLayer(polyline);
                marker.scec_properties.vector.addLayer(arrowHeadDecorator);
                marker.scec_properties.vectorArrowHead = arrowHeadDecorator;
                this.cgm_vectors.addLayer(marker.scec_properties.vector);

                // this.cgm_vectors.addLayer(polyline);
                // r.cgm_vectors.addLayer(arrowHeadDecorator);

                this.cgm_layers.addLayer(marker);
            }
        }


        this.cgm_layers.on('click', function(event) {
window.console.log(" Clicked on a layer--->"+ event.layer.scec_properties.station_id);
            CGM.toggleStationSelected(event.layer, true);

        });

        this.cgm_layers.on('mouseover', function(event) {
                let layer = event.layer;
                // layer.setStyle(cgm_marker_style.hover);
                layer.setRadius(cgm_marker_style.hover.radius);
                // layer.scec_properties.vector.setStyle(cgm_marker_style.selected);
                let newArrowPattern = {...cgm_line_pattern};
                newArrowPattern.symbol.options.pathOptions.color = cgm_marker_style.hover.color;
                newArrowPattern.symbol.options.pathOptions.weight = cgm_marker_style.hover.weight;
                layer.scec_properties.vectorArrowHead.setPatterns([newArrowPattern]);
        });


        this.cgm_layers.on('mouseout', function(event) {
            let layer = event.layer;
            // layer.setStyle(cgm_marker_style.hover);
            layer.setRadius(cgm_marker_style.normal.radius);
            // layer.scec_properties.vector.setStyle(cgm_marker_style);
            let newArrowPattern = {...cgm_line_pattern};
            let oldColor = cgm_marker_style.normal.color;

            if (layer.scec_properties.selected) {
               oldColor = cgm_marker_style.selected.color;
            }
            newArrowPattern.symbol.options.pathOptions.color = oldColor;
            newArrowPattern.symbol.options.pathOptions.weight = cgm_marker_style.normal.weight;
            layer.scec_properties.vectorArrowHead.setPatterns([newArrowPattern]);
        });

    };

    this.toggleStationSelected = function(layer, clickFromMap=false) {
        if (typeof layer.scec_properties.selected === 'undefined') {
            layer.scec_properties.selected = true;
        } else {
            layer.scec_properties.selected = !layer.scec_properties.selected;
        }

        if (layer.scec_properties.selected) {
            this.selectStationByLayer(layer, clickFromMap);
            // if this station is not in search result, should add it in XXX
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
window.console.log("toggleStation -- by gid");
        let layer = this.getLayerByGid(gid);
        return this.toggleStationSelected(layer, false);
    };

    this.selectStationByLayer = function (layer, moveTableRow=false) {
window.console.log("select stations by layer..");
        layer.scec_properties.selected = true;
        layer.setStyle(cgm_marker_style.selected);
        layer.scec_properties.vector.setStyle({color: cgm_marker_style.selected.color});
        let gid = layer.scec_properties.gid;

        let $row = $(`tr[data-point-gid='${gid}'`);
        let rowHTML = "";
        if ($row.length == 0) {
           this.addToResultsTable(layer);
        }

        $row = $(`tr[data-point-gid='${gid}'`);
        $row.addClass('row-selected');

window.console.log("HERE..");

        let $glyphElem = $row.find('span.cgm-data-row');
        $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');

        this.upSelectCount(gid);

        // move row to top
        if (moveTableRow) {
            let $rowHTML = $row.prop('outerHTML');
            $row.remove();
            $("#metadata-viewer.cgm tbody").prepend($rowHTML);
        }
    };

    this.unselectStationByLayer = function (layer) {
        layer.scec_properties.selected = false;
        layer.setStyle(cgm_marker_style.normal);
        layer.scec_properties.vector.setStyle({color: cgm_colors.normal});
        let newArrowPattern = {...cgm_line_pattern};
        newArrowPattern.symbol.options.pathOptions.color = cgm_colors.normal;

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
        $("#metadata-viewer.cgm tr.row-selected button span.glyphicon.glyphicon-check").removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        $("#metadata-viewer.cgm tr.row-selected").removeClass('row-selected');
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
        let $table = $("#metadata-viewer.cgm tbody");
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


    this.executePlotTS = function(ftype) {
      let layers=CGM.search_result.getLayers();
      let urllist=[];
      let dnamelist=[];
      let framelist=[];
      
      var cnt=layers.length;
      for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }
      
          if(ftype == frameType.IGB14 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.IGB14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            urllist.push(downloadURL);
            dnamelist.push(dname);
            framelist.push(frameType.IGB14);
          }
          if(ftype == frameType.NAM14 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.NAM14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            urllist.push(downloadURL);
            dnamelist.push(dname);
            framelist.push(frameType.NAM14);
          }
          if(ftype == frameType.NAM17 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.NAM17);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            urllist.push(downloadURL);
            dnamelist.push(dname);
            framelist.push(frameType.NAM17);
          }
          if(ftype == frameType.PCF14 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.PCF14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            urllist.push(downloadURL);
            dnamelist.push(dname);
            framelist.push(frameType.PCF14);
          }
      }
     showTSView(urllist, dnamelist, framelist);
     showPlotTSWarning();
    }


    this.downloadURLsAsZip = function(ftype) {
        var nzip=new JSZip();
        var layers=CGM.search_result.getLayers();
        let timestamp=$.now();
      
        var cnt=layers.length;
        for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }
      
          if(ftype == frameType.IGB14 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.IGB14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
          if(ftype == frameType.NAM14 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.NAM14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
          if(ftype == frameType.NAM17 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.NAM14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
          if(ftype == frameType.PCF14 || ftype == "all") {
            let downloadURL = getDataDownloadURL(layer.scec_properties.station_id,frameType.PCF14);
            let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
            let promise = $.get(downloadURL);
            nzip.file(dname,promise);
          }
        }
      
      
        var zipfname="CGM_"+timestamp+".zip"; 
        nzip.generateAsync({type:"blob"}).then(function (content) {
          // see FileSaver.js
          saveAs(content, zipfname);
        })
    }

var generateTableRow = function(layer) {
window.console.log("generate a table row..");
        let $table = $("#metadata-viewer");
        let html = "";

        let coordinates = layer.getLatLng();
        coordinates = {lat: parseFloat(coordinates.lat).toFixed(2), lng: parseFloat(coordinates.lng).toFixed(2) };

        let downloadURL1 = getDataDownloadURL(layer.scec_properties.station_id,frameType.IGB14);
        let downloadURL2 = getDataDownloadURL(layer.scec_properties.station_id,frameType.NAM14);
        let downloadURL3 = getDataDownloadURL(layer.scec_properties.station_id,frameType.NAM17);
        let downloadURL4 = getDataDownloadURL(layer.scec_properties.station_id,frameType.PCF14);

        html += `<tr data-point-gid="${layer.scec_properties.gid}">`;
        html += `<td style="width:25px" class="cgm-data-click button-container"> <button class="btn btn-sm cxm-small-btn" id="" title="highlight the station" onclick=''>
            <span class="cgm-data-row glyphicon glyphicon-unchecked"></span>
        </button></td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.station_id}</td>`;
        html += `<td class="cgm-data-click">${coordinates.lat}</td>`;
        html += `<td class="cgm-data-click">${coordinates.lng}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.type} </td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.horizontalVelocity}</td>`;
        html += `<td class="text-center">`;
        html = html+ `<a href=\"`+downloadURL1+`\" download> <button class=\"btn btn-xs cgm-download\" title=\"download igb14 frame\"><span id=\"download_igb14_${layer.scec_properties.gid}\" class=\"far fa-arrow-alt-circle-down\"></span>igb14</button></a>`;
        html = html+`<a href=\"`+downloadURL2+`\" download> <button class=\"btn btn-xs cgm-download\" title=\"download nam14 frame\"><span id=\"download_nam14_${layer.scec_properties.gid}\" class=\"far fa-arrow-alt-circle-down\"></span>nam14</button></a>`;
        html = html+`<a href=\"`+downloadURL3+`\" download> <button class=\"btn btn-xs cgm-download\" title=\"download nam17 frame\"><span id=\"download_nam17_${layer.scec_properties.gid}\" class=\"far fa-arrow-alt-circle-down\"></span>nam17</button></a>`;
        html = html+`<a href=\"`+downloadURL4+`\" download> <button class=\"btn btn-xs cgm-download\" title=\"download pcf14 frame\"><span id=\"download_pcf14_${layer.scec_properties.gid}\" class=\"far fa-arrow-alt-circle-down\"></span>pcf14</button></a>`;
        html += `</tr>`;

        return html;
    };

    this.showSearch = function (type) {
        window.console.log("calling showSeach");
        const $all_search_controls = $("#cgm-controls-container ul li");
        this.freshSearch();
        switch (type) {
            case this.searchType.stationName:
                $all_search_controls.hide();
                $("#cgm-station-name").show();
                break;
            case this.searchType.latlon:
                $all_search_controls.hide();
                $("#cgm-latlon").show();
                drawRectangle();
                break;
            default:
                $all_search_controls.hide();
        }
    };

    this.showModel = function () {

        window.console.log("showing model");
        let $cgm_model_checkbox = $("#cgm-model");

        if (this.searching) {
            this.search_result.addTo(viewermap);
        } else {
            this.cgm_layers.addTo(viewermap);
        }

        if (!$cgm_model_checkbox.prop('checked')) {
            $cgm_model_checkbox.prop('checked', true);
        }

        if (currentLayerName != 'shaded relief') {
            switchLayer('shaded relief');
            $("#mapLayer").val('shaded relief');
        }

    };

    this.hideModel = function () {
        if (CGM.searching) {
            CGM.search_result.remove();
        } else {
            this.cgm_layers.remove();
        }

    };

    this.reset = function() {
        window.console.log(">>> calling reset..");
        this.zeroSelectCount();
        this.showSearch('none');
        this.searching = false;
        this.search_result.removeLayer();
        this.search_result = new L.FeatureGroup();
        this.hideVectors();
        this.showModel();
        remove_bounding_rectangle_layer();
        skipRectangle();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        $("#cgm-controls-container input, #cgm-controls-container select").val("");

        $("#cgm-model-vectors").prop('checked', false);
        this.clearAllSelections();

    };

    this.resetSearch = function (){
window.console.log(">>> calling resetSearch..");
        // this.hideVectors();
        this.zeroSelectCount();
        viewermap.removeLayer(this.search_result);
        this.unselectAll();
        this.searching = false;
        this.search_result = new L.FeatureGroup();
        // $("#cgm-controls-container ul input, #cgm-controls-container ul select").val("");
        this.replaceResultsTableBody([]);
        skipRectangle();
        remove_bounding_rectangle_layer();
    };

    this.freshSearch = function (){
window.console.log(">>> calling freshSearch..");
        this.resetSearch();
        if ($("#cgm-model-vectors").prop('checked')) {
          this.showVectors();
          } else {
            this.hideVectors();
        }
        if ($("#cgm-model").prop('checked')) {
          this.showModel();
          } else {
          this.hideModel();
        }
    };


    this.getMarkerByStationId = function (station_id) {
        for (const index in cgm_station_data) {
            if (cgm_station_data[index].station_id == station_id) {
                return cgm_station_data[index];
            }
        }

        return [];
    };

    this.showVectors = function () {

        if (this.searching) {
            this.search_result.eachLayer(function (layer) {
                viewermap.addLayer(layer.scec_properties.vector);
            });
        } else {
            this.cgm_layers.eachLayer(function (layer) {
                viewermap.addLayer(layer.scec_properties.vector);
            });
        }
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
                viewermap.removeLayer(layer.scec_properties.vector);
            });
        } else {
            this.cgm_vectors.eachLayer(function(layer) {
                viewermap.removeLayer(layer);
            });
        }

        if ($("#cgm-model-vectors").prop('checked')) {
            $("#cgm-model-vectors").prop('checked', false);
        }
    };

        var calculateEndVectorLatLng = function (start_latlng, vel_north, vel_east, scaling_factor) {
            // see https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
            let dy = vel_north * scaling_factor;
            let dx = vel_east * scaling_factor;
            let r_earth = 6738;
            let pi = Math.PI;

            let start_lat = start_latlng.lat;
            let start_lng = start_latlng.lng;
            let end_lat = start_lat + (dy / r_earth) * (180 / pi);
            let end_lng = start_lng + (dx / r_earth) * (180 / pi) / Math.cos(start_lat * pi / 180);

            //calculateDistanceMeter({'lat':50.03, 'lng':-5.5 }, {'lat':58.5, 'lng':-3.04} );
//let d= calculateDistanceMeter({'lat':start_lat,'lng':start_lng}, {'lat':end_lat, 'lng':end_lng} );
//window.console.log("HERE.."+d);

            return [end_lat, end_lng];
        };

        var calculateDistanceMeter = function (start_latlng, end_latlng) {
             let start_lat = start_latlng.lat;
             let start_lng = start_latlng.lng;
             let end_lat = end_latlng.lat;
             let end_lng = end_latlng.lng;

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
             const d = R * c; // in metres
//             window.console.log("XXX distance between them.."+d);
             return d;
/*
             if (CGM.cgm_vector_max == -1) {
               CGM.cgm_vector_max=d;
               CGM.cgm_vector_min=d;
               return;
             }
             if (d > CGM.cgm_vector_max) {
                CGM.cgm_vector_max = d;
             }
             if (d < CGM.cgm_vector_min) {
                CGM.cgm_vector_min = d;
             }
*/
        }

        this.search = function (type, criteria) {
            let results = [];
            switch (type) {
                case CGM.searchType.stationName:
                    this.cgm_layers.eachLayer(function (layer) {
                        // if (layer.scec_properties.station_id.toLowerCase() == criteria.toLowerCase()) {
                        if (layer.scec_properties.station_id.toLowerCase().indexOf(criteria.toLowerCase()) > -1){
                            results.push(layer);
                        }
                    });
                    break;

                case CGM.searchType.latlon:
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

window.console.log(">> calling searchBox");
            this.hideModel();
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

                if (type == this.searchType.latlon) {
                    this.unselectAll();
                    markerLocations.push(L.latLng(criteria[0],criteria[1]));
                    markerLocations.push(L.latLng(criteria[2],criteria[3]));
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.fitBounds(bounds, {maxZoom: 12});
                    setTimeout(skipRectangle, 500);

                } else {
                    let bounds = L.latLngBounds(markerLocations);
                    viewermap.flyToBounds(bounds, {maxZoom: 12 });
                }
            }

            this.replaceResultsTableBody(results);

            $("#wait-spinner").hide();
        };

    var vectorVisible = function (){
            return $("#cgm-model-vectors").prop('checked');
        };

        // private function
       var generateResultsTable = function (results) {

window.console.log("generateResultsTable..");

            var html = "";
            html+=`
<thead>
<tr>
                         <th class="text-center button-container" style="width:2rem">
                             <button id="cgm-allBtn" class="btn btn-sm cxm-small-btn" title="select all visible stations" onclick="CGM.toggleSelectAll();">
                             <span class="glyphicon glyphicon-unchecked"></span>
                             </button>
                         </th>
                         <th class="hoverColor" onClick="sortMetadataTableByRow(1,'a')">Station&nbsp<span id='sortCol_1' class="fas fa-angle-down"></span><br>Name</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'n')">Latitude<span id='sortCol_2' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">Longitude<span id='sortCol_3' class="fas fa-angle-down"></span></th>
                        <th>Type</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(5,'n')">Horizontal&nbsp<span id='sortCol_5' class="fas fa-angle-down"></span><br>Velocity (mm/yr)</th>
                        <th style="width:40%;"><div class="col text-center">
                            <div class="btn-group download-now">
<!--time series plot -->
                                <button id="plotTS-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" disabled>
                                    PLOT TS<span id="plot-counter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <button class="dropdown-item" type="button" value="igb14"
                                            onclick="CGM.executePlotTS(this.value);">igb14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam14"
                                            onclick="CGM.executePlotTS(this.value);">nam14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam17"
                                            onclick="CGM.executePlotTS(this.value);">nam17
                                    </button>
                                    <button class="dropdown-item" type="button" value="pcf14"
                                            onclick="CGM.executePlotTS(this.value);">pcf14
                                    </button>
                                </div>
                            </div>
                            &nbsp; &nbsp;
<!--download all -->
                            <div class="btn-group download-now">
                                <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" disabled>
                                    DOWNLOAD ALL<span id="download-counter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <button class="dropdown-item" type="button" value="igb14"
                                            onclick="CGM.downloadURLsAsZip(this.value);">igb14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam14"
                                            onclick="CGM.downloadURLsAsZip(this.value);">nam14
                                    </button>
                                    <button class="dropdown-item" type="button" value="nam17"
                                            onclick="CGM.downloadURLsAsZip(this.value);">nam17
                                    </button>
                                    <button class="dropdown-item" type="button" value="pcf14"
                                            onclick="CGM.downloadURLsAsZip(this.value);">pcf14
                                    </button>
                                    <button class="dropdown-item" type="button" value="all"
                                          onclick="CGM.downloadURLsAsZip(this.value);">All of the Above
                                    </button>
                                </div>
                            </div>
                        </th>
</tr>
</thead>
<tbody>`;

            for (let i = 0; i < results.length; i++) {
                html += generateTableRow(results[i]);
                // CGM.selectStationByLayer(results[i]);
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
                // CGM.selectStationByLayer(results[i]);
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
http://geoweb.mit.edu/~floyd/scec/cgm/ts/<cont_site>.cgm.wmrss_<frame>.pos
http://geoweb.mit.edu/~floyd/scec/cgm/ts/<surv_site>.cgm.final_<frame>.pos
 
where <cont_site> is a four-character continuous site ID 
from the attached cont_site.txt file, 

<surv_site> is a four-character survey site ID from the
     attached surv_site.txt file,
<frame> is "igb14", "nam14", "nam17" or "pcf14".

http://geoweb.mit.edu/~floyd/scec/cgm/ts/TWMS.cgm.wmrss_igb14.pos
******/
        var getDataDownloadURL = function(station_id, frame)  {
let urlPrefix = "http://geoweb.mit.edu/~floyd/scec/cgm/ts/";
let url=urlPrefix + station_id + ".cgm.wmrss_"+frame+".pos";

          return url;

/*
          let urlPrefix = "https://files.scec.org/s3fs-public/projects/cgm/1.0/time-series/pos/";
          return urlPrefix + station_id + ".cgm.edits_nam08.pos";
*/
        };

        this.setupCGMInterface = function() {
            var $download_queue_table = $('#metadata-viewer');
            //refreshAll();
            this.activateData();
            $("div.mapData div.map-container").removeClass("col-7 pr-0 pl-2").addClass("col-12").css('padding-left','30px');
            $("#CGM_plot").css('height','400px');
            viewermap.invalidateSize();
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
            $download_queue_table.floatThead('destroy');

            this.replaceResultsTable([]);
            $download_queue_table.addClass('cgm');
            $("#data-download-select").val("cgm");

            $download_queue_table.floatThead({
                 // floatTableClass: 'cgm-metadata-header',
                 scrollContainer: function ($table) {
                     return $table.closest('div#metadata-viewer-container');
                 },
            });

            $("#wait-spinner").hide();
        };

        this.downloadHorizontalVelocities = function(gid_list) { // TODO };
    };

}
