
var cgm_station_data = [];
// var cgm_arrows = [];
var cgm_line_path_style = {weight: 1, color: "blue"};
var cgm_line_pattern = {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 5, polygon: false, pathOptions: {stroke: true, color: "blue", weight:1}})};
var cgm_markers = [];


$(document).ready(function(){

   $("#cgm-model").on('click', function(){
       CGM.toggleStations();
   });

    $("#cgm-model-vectors").on('click', function() {
        CGM.toggleVectors();
    });

    $("#cgm-search-type").on('change',function(){
        CGM.showSearch($(this).val());
    });

    $("#cgm-controls-container ul button").on('click', function(){
        let searchType = $(this).data('searchType');
        let criteria = $(this).siblings("input").val();
        CGM.searchBox(searchType, criteria);
    });
});

var CGM = new function()  {

    var visible = {
        stations: false,
        vectors: false
    };

    this.searchType = {
        keyword: 'keyword',
        latlon: 'latlon',
        stationName: 'stationName',

    };

    this.showSearch = function(type) {
        switch(type) {
            case this.searchType.keyword:
                $("#cgm-keyword").show();
                break;
            case this.searchType.latlon:
                break;
        }
    };

    this.showModel = function () {
        this.addStationMarkers();
    };

    this.getMarkerByStationId = function(station_id) {
        for (const index in cgm_station_data) {
            if (cgm_station_data[index].station_id == station_id) {
                return cgm_station_data[index];
            }
        }

        return [];
    };

    // var addMarker = function(latlon, ) {};

    var showMarker = function(cgm_layer) {
        visible.stations = true;
        cgm_layer.scec_properties.visible = true;
        cgm_layer.marker.addTo(viewermap);
    };

    var hideMarker = function(marker) {
        marker.scec_properties.visible = false;
        viewermap.removeLayer(marker);
    };

    this.addStationMarkers = function() {

     if (visible.stations === true) {
         return;
     } else {
         visible.stations = true;
         if (!$("#cgm-model").prop('checked') ) {
             $("#cgm-model").attr('checked', true);
         }
     }

    for (const index in cgm_station_data) {
        if (cgm_station_data[index].hasOwnProperty("scec_properties")) {
            if (!cgm_station_data[index].scec_properties.visible) {
                continue;
            }
        }

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

        let marker = L.circle([lat, lon],
            {
                color: 'blue',
                fillColor: 'blue',
                fillOpacity: 0.5,
                radius: 500,
                weight: 1,
            }
        );

        let horizontalVelocity_mm =  (horizontalVelocity * 1000).toFixed(2); // convert to mm/year
        let station_info = `station id: ${station_id}, vel: ${horizontalVelocity_mm} mm/yr, lat/lng: ${lat}, ${lon}`;
        marker.bindTooltip(station_info).openTooltip();
        marker.addTo(viewermap);
        cgm_station_data[index].marker = marker;
        cgm_station_data[index].scec_properties =  {station_id: station_id, visible: true };
    }

    $("#cfm-controls-container").hide();
    $("#cgm-controls-container").show();
};

this.addVectors = function() {

    if (visible.vectors === true) {
        return;
    } else {
        visible.vectors = true;
        if (!visible.stations) {
            this.addStationMarkers();
        }
    }

    for (const index in cgm_station_data) {

        if (cgm_station_data[index].hasOwnProperty("scec_properties")) {
            if (!cgm_station_data[index].scec_properties.visible) {
                continue;
            }
        }

       let start_latlon = cgm_station_data[index].marker.getLatLng();
        let vel_north = parseFloat(cgm_station_data[index].ref_velocity_north);
        let vel_east = parseFloat (cgm_station_data[index].ref_velocity_east);

        let end_latlng = this.calculateEndVectorLatLng(start_latlon, vel_north, vel_east, 1000);

        let line_latlons = [
            [start_latlon.lat, start_latlon.lng],
            end_latlng
        ];

        let polyline = L.polyline(line_latlons, cgm_line_path_style).addTo(viewermap);
        var arrowHeadDecorator = L.polylineDecorator(polyline, {
            patterns: [cgm_line_pattern]
        }).addTo(viewermap);

        cgm_station_data[index].vectorLine = polyline;
        cgm_station_data[index].vectorArrowHead = arrowHeadDecorator;

    }

};

this.removeVectors = function () {
    if (visible.vectors === false) {
        return;
    } else {
        visible.vectors = false;
    }



    for (const index in cgm_station_data) {
        if (cgm_station_data[index].hasOwnProperty("scec_properties")) {
            if (!cgm_station_data[index].scec_properties.visible) {
                continue;
            }
        }

       viewermap.removeLayer(cgm_station_data[index].vectorLine);
        viewermap.removeLayer(cgm_station_data[index].vectorArrowHead);
    }

    if ($("#cgm-model-vectors").prop('checked') ) {
        $("#cgm-model-vectors").prop('checked', false);
    }
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

    this.hide = function () {
        this.removeStations();
        this.removeVectors();
    };

    this.calculateEndVectorLatLng = function (start_latlon, vel_north, vel_east, scaling_factor) {
        // see https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
    let dy = vel_north*scaling_factor;
    let dx = vel_east*scaling_factor;
    let r_earth = 6738;
    let pi = Math.PI;

    let start_lat = start_latlon.lat;
    let start_lon = start_latlon.lng;
    let end_lat = start_lat  + (dy / r_earth) * (180 / pi);
    let end_lon = start_lon + (dx / r_earth) * (180 / pi) /Math.cos(start_lat * pi/180);

    return [end_lat, end_lon];
};

    this.toggleVectors = function () {
        if (visible.vectors)  {
            this.removeVectors() ;
        } else {
            this.addVectors();
        }
    };

    this.toggleStations = function () {
        if (visible.stations)  {
            this.removeStations() ;
        } else {
            this.addStationMarkers();
        }
    };

    this.search = function (type, criteria) {

        let results = [];
        switch (type) {
            case CGM.searchType.keyword:
                let criteria = $("#cgm-keywordTxt").val();
                for (const index in cgm_station_data) {
                    if (cgm_station_data[index].scec_properties.station_id == criteria) {
                       results.push(cgm_station_data[index]);
                    }
                }
                break;
        }

        return results;
    };

    this.searchBox = function (type, criteria) {
        let results = this.search(type, criteria);

        this.removeStations();
        let markerLocations = [];

        for (let i=0;i<results.length;i++) {
            markerLocations.push(results[i].marker.getLatLng());
            // results[i].marker.addTo(viewermap);
            showMarker(results[i]);
        }
        let bounds = L.latLngBounds(markerLocations);
        viewermap.fitBounds(bounds, {maxZoom: 12});

    };

    this.displayResult = function(results) {
       let markerLocations = [];
       for (let i=0;i<results.length;i++) {
           markerLocations.push(results[i].getLatLng());
       }
       let bounds = L.latLngBounds(markerLocations);
       viewermap.fitBounds(bounds);
    };

};
