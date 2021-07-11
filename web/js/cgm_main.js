var cgm_station_data;

$(document).ready(function () {

    $("#cgm-model").on('click', function () {
        if (viewermap.hasLayer(CGM.cgm_layers) ||  CGM.searching) {
            CGM.hideModel();
        } else {
            CGM.showModel();
        }
    });

    $("#cgm-model-vectors").on('click', function () {
        if ($(this).prop('checked')) {
            CGM.showVectors();
        } else {
            CGM.hideVectors();
        }
    });

    $("#cgm-search-type").on('change', function () {
        CGM.showSearch($(this).val());
    });

    $("#cgm-controls-container ul button").not('#cgm-drawRect').on('click', function () {
        let searchType = $(this).data('searchType');
        let $criteria = $(this).siblings("input");

        let criteria = [];

        if ($criteria.length === 1) {
            criteria = $criteria.val();
        } else {
            $criteria.each(function(){
                criteria.push($(this).val());
            });
        }

        $("div#wait-spinner").show(400, function(){
            CGM.searchBox(searchType, criteria);
           });
    });

    $("#cgm-drawRect").on('click', function(){
       drawRectangle();
    });

    $("#cgm-controls-container input").keyup(function(event){
            if (event.keyCode === 13) {
               $(this).siblings('button').trigger('click');
            }
    });

    $("#metadata-viewer-container").on('click','#metadata-viewer.cgm tr', function(){
        if ($(this).find('button[id="cgm-allBtn"]').length != 0) {
            return;
        }

        let $glyphElem = $(this).find('span');
        let gid = $(this).data('point-gid');
        let isElemSelected = CGM.toggleStationSelectedByGid(gid);

        if (isElemSelected) {
            $(this).addClass('row-selected');
            $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');
        } else {
            $(this).removeClass('row-selected');
            $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');
        }


    });

    CGM.generateLayers();

});

var CGM = new function () {

    this.cgm_layers = new L.FeatureGroup();
    this.cgm_vectors = new L.FeatureGroup();
    this.search_result = new L.FeatureGroup();
    this.searching = false;

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
                        <td colspan="12">Metadata for selected points will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeModel = Models.CGM;
        this.showModel();
        $("div.control-container").hide();
        $("#cgm-controls-container").show();

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
                let start_latlon = marker.getLatLng();
                let end_latlng = calculateEndVectorLatLng(start_latlon, vel_north, vel_east, 750);

                let line_latlons = [
                    [start_latlon.lat, start_latlon.lng],
                    end_latlng
                ];

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
            console.log(event.layer.scec_properties.station_id);
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
        layer.scec_properties.vector.setStyle({color: cgm_marker_style.selected.color});
        let gid = layer.scec_properties.gid;

        let $row = $(`tr[data-point-gid='${gid}'`);
        let rowHTML = "";
        if ($row.length == 0) {
           this.addToResultsTable(layer);
        }

        $row = $(`tr[data-point-gid='${gid}'`);
        let $glyphElem = $row.find('span');
        $row.addClass('row-selected');
        $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');

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
        let $glyphElem = $row.find('span');
        $row.removeClass('row-selected');
        $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');
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
        this.search_result.eachLayer(function(layer){
            cgm_object.addToResultsTable(layer);
        });
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
            $selectAllButton.addClass('glyphicon-check').removeClass('glyphicon-unchecked')
        } else {
            this.unselectAll();

        }
    };

    this.unselectAll = function() {
        var cgm_object = this;
        this.search_result.eachLayer(function(layer){
            cgm_object.unselectStationByLayer(layer);
        });
        $("#cgm-allBtn span").removeClass('glyphicon-check').addClass('glyphicon-unchecked')
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


    var generateTableRow = function(layer) {
        let $table = $("#metadata-viewer");
        let html = "";

        let coordinates = layer.getLatLng();
        coordinates = {lat: parseFloat(coordinates.lat).toFixed(2), lng: parseFloat(coordinates.lng).toFixed(2) };

        let downloadURL = getDataDownloadURL(layer.scec_properties.station_id);

        html += `<tr data-point-gid="${layer.scec_properties.gid}">`;
        html += `<td style="width:25px" class="button-container"> <button class="btn btn-sm cfm-small-btn" id="" title="highlight the fault" onclick=''>
            <span class="cgm-data-row glyphicon glyphicon-unchecked"></span>
        </button></td>`;
        html += `<td>${layer.scec_properties.station_id}</td>`;
        html += `<td>${coordinates.lat}</td>`;
        html += `<td>${coordinates.lng}</td>`;
        html += `<td>${layer.scec_properties.type} </td>`;
        html += `<td>${layer.scec_properties.horizontalVelocity} mm/yr</td>`;
        html += `<td><a href="${downloadURL}">Download POS</a></td>`;
        html += `</tr>`;

        return html;
    };

    this.showSearch = function (type) {
        const $all_search_controls = $("#cgm-controls-container ul li");
        this.resetSearch();
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
        // this.hideVectors();
        viewermap.removeLayer(this.search_result);
        this.searching = false;
        this.search_result = new L.FeatureGroup();
        // $("#cgm-controls-container ul input, #cgm-controls-container ul select").val("");
        this.replaceResultsTable([]);
        skipRectangle();

        remove_bounding_rectangle_layer();
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


        var calculateEndVectorLatLng = function (start_latlon, vel_north, vel_east, scaling_factor) {
            // see https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
            let dy = vel_north * scaling_factor;
            let dx = vel_east * scaling_factor;
            let r_earth = 6738;
            let pi = Math.PI;

            let start_lat = start_latlon.lat;
            let start_lon = start_latlon.lng;
            let end_lat = start_lat + (dy / r_earth) * (180 / pi);
            let end_lon = start_lon + (dx / r_earth) * (180 / pi) / Math.cos(start_lat * pi / 180);

            return [end_lat, end_lon];
        };

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


            this.replaceResultsTable(results);

            $("#wait-spinner").hide();
        };

    var vectorVisible = function (){
            return $("#cgm-model-vectors").prop('checked');
        };

        // private function
       var generateResultsTable = function (results) {

            var html = "";
           // html+=`<div class="cgm-table"><table class="cgm" >`;
            html+=`
<thead>
<tr>
<th class="text-center button-container">
    <button id="cgm-allBtn" class="btn btn-sm cfm-small-btn" title="select all visible stations" onclick="CGM.toggleSelectAll();">
    <span class="glyphicon glyphicon-unchecked"></span>
</button>
</th>
<th>Station Name</th>
<th>Latitude</th>
<th>Longitude</th>
<th>Type</th>
<th>Hor. Vel.</th>
<th>Download All</th>
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
            html=html+ "</tbody>";
            return html;
        };

        this.replaceResultsTable = function(results) {
            $("#metadata-viewer").html(generateResultsTable(results));

        };

        var getDataDownloadURL = function(station_id)  {
          let urlPrefix = "https://files.scec.org/s3fs-public/projects/cgm/1.0/time-series/pos/";
          return urlPrefix + station_id + ".cgm.edits_nam08.pos";
        };

        this.setupCGMInterface = function() {
            var $download_queue_table = $('#metadata-viewer');
            refreshAll();
            this.activateData();
            $("div.cfm-search-result-container").attr('style', 'display:none !important;');
            $("div.mapData div.map-container").removeClass("col-7 pr-0 pl-2").addClass("col-12").css('padding-left','30px');
            $("#CFM_plot").css('height','400px');
            viewermap.invalidateSize();
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
            $download_queue_table.floatThead('destroy');

            this.replaceResultsTable([]);
            $download_queue_table.addClass('cgm');
            $("#data-download-select").val("cgm");
            // $download_queue_table.floatThead({
            //     // floatTableClass: 'cgm-metadata-header',
            //     scrollContainer: function ($table) {
            //         return $table.closest('#metadata-viewer-container');
            //     },
            // });

            $("#wait-spinner").hide();
        };

        this.downloadHorizontalVelocities = function(gid_list) { // TODO };
    };
