/***
   cgm_insar.js
***/

var CGM_GNSS = new function () {

    this.cgm_velocity_max = -1;
    this.cgm_velocity_min = 0;
    this.cgm_velocity_loc = 0;

    this.cgm_layers = new L.FeatureGroup();
    this.search_result = new L.FeatureGroup();
    this.searching = false;

    var cgm_colors = {
        normal: '#006E90',
        selected: '#B02E0C',
        abnormal: '#00FFFF',
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

    this.searchType = {
        latlon: 'latlon',
        location: 'location',
    };

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="5">Metadata for selected points will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeProduct = Products.INSAR;
        this.showProduct();
        $("div.control-container").hide();
        $("#cgm-insar-controls-container").show();

    };

    //
    this.generateInSARLayers = function () {
        window.console.log(".....INSAR >> "+cgm_insar_data);
        let tmp=cgm_insar_data[0];
        let jblob=JSON.parse(tmp.replace(/'/g,'"'));
 
        for(let i=0; i< jblob.length; i++) {
          let item=jblob[i];
          let rlist=item['result'];
          for(let j=0; j< rlist.length; j++ ) {
              let r=rlist[j];
              window.console.log(r);
          }
        }
        
    };

    this.showSearch = function (type) {
        const $all_search_controls = $("#cgm-insar-controls-container ul li");
        this.freshSearch();
        switch (type) {
            case this.searchType.location:
                $all_search_controls.hide();
                $("#cgm-insar-location").show();
                break;
            case this.searchType.latlon:
                $all_search_controls.hide();
                $("#cgm-insar-latlon").show();
                drawRectangle();
                break;
            default:
                $all_search_controls.hide();
        }
    };

    this.showProduct = function () {
window.console.log("SHOW model");
        let $cgm_model_checkbox = $("#cgm-model-insar");

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

// XX CHECK
    this.hideProduct = function () {
window.console.log("Hide model/product");
        if (CGM_INSAR.searching) {
            CGM_INSAR.search_result.remove();
        } else {
            this.cgm_layers.remove();
        }
    };

    this.reset = function() {
        window.console.log("RESET>>> calling reset..");
        this.showSearch('none');
        this.searching = false;
        this.search_result.removeLayer();
        this.search_result = new L.FeatureGroup();

        this.resetVelocitySlider();

        this.showProduct();
        remove_bounding_rectangle_layer();
        skipRectangle();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        $("#cgm-insar-controls-container input, #cgm-insar-controls-container select").val("");

        this.clearAllSelections();
    };

    this.resetSearch = function (){
window.console.log("RESET>>> calling resetSearch..");
        this.zeroSelectCount();
        viewermap.removeLayer(this.search_result);
        this.unselectAll();
        this.searching = false;
        this.search_result = new L.FeatureGroup();

        this.replaceResultsTableBody([]);
        skipRectangle();
        remove_bounding_rectangle_layer();
    };

    this.freshSearch = function (){
window.console.log(">>> calling freshSearch..");
        this.resetSearch();
        if ($("#cgm-insar-model").prop('checked')) {
          this.showProduct();
          } else {
          this.hideProduct();
        }
        if ($("#cgm-model-cfm").prop('checked')) {
          CXM.showCFMFaults(viewermap);
          } else {
          CXM.hideCFMFaults(viewermap);
        }
    };


        this.search = function (type, criteria) {
            let results = [];
            switch (type) {
                case CGM_INSAR.searchType.location:
                    $("#cgm-insar-LatTxt").val(criteria[0]);
                    $("#cgm-insar-LonTxt").val(criteria[1]);
                    remove_marker_point_layer();
                    add_marker_point(criteria[0],criteria[1]);
//XXX
// TODO call the php to get the correct point right location  
//                           create a layer
//                           results.push(layer);
   
                    break;
                case CGM_INSAR.searchType.latlon:
                    $("#cgm-insar-firstLatTxt").val(criteria[0]);
                    $("#cgm-insar-firstLonTxt").val(criteria[1]);
                    $("#cgm-insar-secondLatTxt").val(criteria[2]);
                    $("#cgm-insar-secondLonTxt").val(criteria[3]);
                    remove_bounding_rectangle_layer();
                    add_bounding_rectangle(criteria[0],criteria[1],criteria[2],criteria[3]);
// TODO call the php to get the right location 
//                           create many layers
//                           results.push(layer);
                    break;
            }
            return results;
        };

        this.searchBox = function (type, criteria) {

window.console.log("SEARCH >> calling searchBox");
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
//XX TODO
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
                    setTimeout(skipRectangle, 500);

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


        var modelVisible = function (){
            return $("#cgm-insar-model").prop('checked');
        };

        // private function
       var generateResultsTable = function (results) {

window.console.log("generateResultsTable..");

            var html = "";
            html+=`
<thead>
<tr>
                         <th class="text-center button-container" style="width:2rem">
                             <button id="cgm-insar-allBtn" class="btn btn-sm cxm-small-btn" title="select all visible locations" onclick="CGM_INSAR.toggleSelectAll();">
                             <span class="glyphicon glyphicon-unchecked"></span>
                             </button>
                         </th>
                         <th class="hoverColor" onClick="sortMetadataTableByRow(1,'a')">Label&nbsp<span id='sortCol_1' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'n')">Lat&nbsp<span id='sortCol_2' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">Lon&nbsp<span id='sortCol_3' class="fas fa-angle-down"></span></th>
                        <th style="width:6rem">Type</th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(4,'n')">Velocity&nbsp<span id='sortCol_4' class="fas fa-angle-down"></span>(units)</th>

                        <th style="width:20%;"><div class="col text-center">
<!--download all -->
                            <div class="btn-group download-now">
                                <button id="download-all" type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" disabled>
                                    DOWNLOAD&nbsp<span id="download-counter"></span>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <button class="dropdown-item" type="button" value="track1"
                                            onclick="CGM_INSAR.downloadURLsAsZip(this.value);">track1
                                    </button>
                                    <button class="dropdown-item" type="button" value="track2"
                                            onclick="CGM_INSAR.downloadURLsAsZip(this.value);">track2
                                    </button>
                                    <button class="dropdown-item" type="button" value="track3"
                                            onclick="CGM_INSAR.downloadURLsAsZip(this.value);">track3
                                    </button>
                                    <button class="dropdown-item" type="button" value="track4"
                                            onclick="CGM_INSAR.downloadURLsAsZip(this.value);">track4
                                    </button>
                                    <button class="dropdown-item" type="button" value="all"
                                          onclick="CGM_INSAR.downloadURLsAsZip(this.value);">All of the Above
                                    </button>
                                </div>
                            </div>
                        </th>
</tr>
</thead>
<tbody>`;

            for (let i = 0; i < results.length; i++) {
                html += generateTableRow(results[i]);
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

        var getDataDownloadURL = function(fname, track)  {
          let urlPrefix = "./result/";
          let url=urlPrefix + fname;
          return url;
        } 

        this.setupCGMInterface = function() {
            var $download_queue_table = $('#metadata-viewer');

            this.activateData();

            $("div.mapData div.map-container").css('padding-left','30px');
            $("#CGM_plot").css('height','500px');
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
    };
}
