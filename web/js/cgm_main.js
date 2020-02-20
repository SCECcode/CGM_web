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

    $("#cgm-controls-container ul button").on('click', function () {
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
        CGM.searchBox(searchType, criteria);
    });

    CGM.generateLayers();

});

var CGM = new function () {

    this.cgm_layers = new L.FeatureGroup();
    this.cgm_vectors = new L.FeatureGroup();
    this.search_result = new L.FeatureGroup();
    this.searching = false;

    var cgm_marker_style = {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.5,
        radius: 500,
        weight: 1,
    };
    var cgm_line_path_style = {weight: 1, color: "blue"};
    var cgm_line_pattern = {
        offset: '100%',
        repeat: 0,
        symbol: L.Symbol.arrowHead({
            pixelSize: 5,
            polygon: false,
            pathOptions: {
                stroke: true,
                color: "blue",
                weight: 1
            }
        })
    };

    var visible = {
        stations: false,
        vectors: false
    };

    this.searchType = {
        keyword: 'keyword',
        latlon: 'latlon',
        stationName: 'stationName',

    };

    this.activateData = function() {
        activeModel = Models.CGM;
        this.showModel();
        $("div.control-container").hide();
        $("#cgm-controls-container").show();
    };

    this.generateLayers = function () {
        for (const index in cgm_station_data) {
            if (cgm_station_data.hasOwnProperty(index)) {
                let lat = parseFloat(cgm_station_data[index].ref_north_latitude);
                let lon = parseFloat(cgm_station_data[index].ref_east_longitude);
                let vel_north = parseFloat(cgm_station_data[index].ref_velocity_north);
                let vel_east = parseFloat(cgm_station_data[index].ref_velocity_east);
                let horizontalVelocity = Math.sqrt(Math.pow(vel_north, 2) + Math.pow(vel_east, 2));
                let station_id = cgm_station_data[index].station_id;

                while (lon < -180) {
                    lon += 360;
                }
                while (lon > 180) {
                    lon -= 360;

                }

                let marker = L.circle([lat, lon], cgm_marker_style);

                let horizontalVelocity_mm = (horizontalVelocity * 1000).toFixed(2); // convert to mm/year
                let station_info = `station id: ${station_id}, vel: ${horizontalVelocity_mm} mm/yr`;//, lat/lng: ${lat}, ${lon}`;
                marker.bindTooltip(station_info).openTooltip();
                marker.scec_properties = {
                    station_id: station_id,
                    horizontalVelocity: horizontalVelocity_mm,
                    vel_east: cgm_station_data[index].ref_velocity_east,
                    vel_north: cgm_station_data[index].ref_velocity_north
            };

                // generate vectors
                let start_latlon = marker.getLatLng();
                let end_latlng = calculateEndVectorLatLng(start_latlon, vel_north, vel_east, 1000);

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
                this.cgm_vectors.addLayer(marker.scec_properties.vector);

                // this.cgm_vectors.addLayer(polyline);
                // r.cgm_vectors.addLayer(arrowHeadDecorator);

                this.cgm_layers.addLayer(marker);
            }
        }
    };

    this.showSearch = function (type) {
        switch (type) {
            case this.searchType.keyword:
                $("#cgm-keyword").show();
                break;
            case this.searchType.latlon:
                $("#cgm-latlon").show();
                // latlon_sidebar = true;
                drawRectangle();
                // drawing_rectangle = true;
                break;
            default:
                $("#cgm-controls-container ul li").hide();
        }
    };

    this.showModel = function () {

        $cgm_model_checkbox = $("#cgm-model");

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
        CGM.searching = false;
        CGM.search_result.removeLayer();
        CGM.search_result = new L.FeatureGroup();
        this.hideVectors();
        this.showModel();
        remove_bounding_rectangle_layer();

        viewermap.setView([34.3, -118.4], 7);
        $("#cgm-controls-container input, #cgm-controls-container select").val("");
        $("#cgm-search-type").trigger('change');

        $("#cgm-model-vectors").prop('checked', false);
        refreshAll(); //refresh CFM

    };

    this.resetSearch = function (){
        CGM.searching = false;
        CGM.search_result = new L.FeatureGroup();
        latlon_sidebar = false;
    };

    this.getMarkerByStationId = function (station_id) {
        for (const index in cgm_station_data) {
            if (cgm_station_data[index].station_id == station_id) {
                return cgm_station_data[index];
            }
        }

        return [];
    };

    var showMarker = function (cgm_layer) {
        cgm_layer.addTo(viewermap);
    };

    var hideMarker = function (marker) {
        marker.scec_properties.visible = false;
        viewermap.removeLayer(marker);
    };

    var generateVectors = function() {

    };

    this.addStationMarkers = function () {

        if (visible.stations === true) {
            return;
        } else {
            visible.stations = true;
            if (!$("#cgm-model").prop('checked')) {
                $("#cgm-model").attr('checked', true);
            }
        }

        $("#cfm-controls-container").hide();
        $("#cgm-controls-container").show();
    };

    this.showVectors = function () {

        // if (this.cgm_vectors.getLayers().length == 0) {
        //
        //     var cgm_object = this;
        //
        // }
        //
        // viewermap.eachLayer(function(layer) {
        //     viewermap.addLayer(this.cgm_vectors);
        // });

        if (this.searching) {
            this.search_result.eachLayer(function (layer) {
                viewermap.addLayer(layer.scec_properties.vector);
            });
        } else {
            this.cgm_layers.eachLayer(function (layer) {
                viewermap.addLayer(layer.scec_properties.vector);
            });
        }
        // viewermap.eachLayer(function(layer){
        //    if ( layer.hasOwnProperty("scec_properties")) {
        //        layer.scec_properties.vector.addTo(viewermap);
        //        // viewermap.addLayer(layer.scec_properties.vector);
        //    }
        // });
    }


    this.hideVectors = function() {
      // viewermap.removeLayer(CGM.cgm_vectors);

        if (this.searching) {
            this.search_result.eachLayer(function(layer){
                viewermap.removeLayer(layer.scec_properties.vector);
            });
        } else {
            this.cgm_vectors.eachLayer(function(layer) {
                viewermap.removeLayer(layer);
            });
            // viewermap.removeLayer(this.cgm_vectors);
        }
        // viewermap.eachLayer(function(layer){
        //     if ( layer instanceof L.Polyline || layer instanceof L.PolylineDecorator) {
        //         // layer.scec_properties.vector.addTo(viewermap);
        //         // viewermap.addLayer(layer.scec_properties.vector);
        //         viewermap.removeLayer(layer);
        //     }
        // });

    };


        this.removeStations = function () {

            if (visible.stations === false) {
                return;
            } else {
                visible.stations = false;
            }

            if (visible.vectors) {
                this.removeVectors();
            }


            for (const index in cgm_station_data) {
                viewermap.removeLayer(cgm_station_data[index].marker);
                cgm_station_data[index].scec_properties.visible = false;
            }
        };

        // this.hide = function () {
        //
        // };

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
                case CGM.searchType.keyword:
                    this.cgm_layers.eachLayer(function (layer) {
                        if (layer.scec_properties.station_id == criteria) {
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

                    // at lat/lon bounds of box to results
                    // let corner1 = L.marker([criteria[0], criteria[1]]);
                    // let corner2 = L.marker([criteria[2], criteria[3]]);
                    // results.push(corner1);
                    // results.push(corner2);
                    break;
            }
            return results;
        };

        this.searchBox = function (type, criteria) {
            this.hideModel();
            this.resetSearch();

            this.searching = true;
            let results = this.search(type, criteria);

            let markerLocations = [];

            for (let i = 0; i < results.length; i++) {
                markerLocations.push(results[i].getLatLng());
                this.search_result.addLayer(results[i]);
            }
            viewermap.addLayer(this.search_result);

            if (type == this.searchType.latlon) {
                markerLocations.push(L.latLng(criteria[0],criteria[1]));
                markerLocations.push(L.latLng(criteria[2],criteria[3]));
                let bounds = L.latLngBounds(markerLocations);
                viewermap.fitBounds(bounds, {maxZoom: 12});

                setTimeout(drawRectangle, 500);

            } else {
                let bounds = L.latLngBounds(markerLocations);
                viewermap.fitBounds(bounds, {maxZoom: 12});
            }
        };

        this.displayResult = function (results) {
            let markerLocations = [];
            for (let i = 0; i < results.length; i++) {
                markerLocations.push(results[i].getLatLng());
            }
            let bounds = L.latLngBounds(markerLocations);
            viewermap.fitBounds(bounds);
        };

    };
