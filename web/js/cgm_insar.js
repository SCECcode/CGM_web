/***
   cgm_insar.js
***/

var CGM_INSAR = new function () {

    this.cgm_velocity_max = -1;
    this.cgm_velocity_min = 0;
    this.cgm_velocity_loc = 0;

    // cgm_track_layers <== all polygon layers for each insar track
    //                      setup once from viewer.php 
    this.cgm_track_layers = new L.FeatureGroup();

    // label <= locally generated unique id for a search
    this.cgm_select_label = [];

    // for each session, collect all the searches in here
    //   by location = marker layer
    //   by latlon area = polygon layer 
    this.cgm_layers = new L.FeatureGroup();

    // refresh from reset/freshSearch ??
    this.search_result = new L.FeatureGroup();
    this.searching = false;

    var cgm_colors = {
//        normal: '#006E90',
        normal: '#FF6E90',
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

    this.defaultMapView = {
        // coordinates: [34.3, -118.4],
        coordinates: [34.16, -118.57],
        zoom: 7
    };

    this.searchType = {
        latlon: 'latlon',
        location: 'location',
    };

    var tablePlaceholderRow = `<tr id="placeholder-row">
                        <td colspan="6">Metadata for selected points will appear here.</td>
                    </tr>`;

    this.activateData = function() {
        activeProduct = Products.INSAR;
        this.showProduct();
        $("div.control-container").hide();
        $("#cgm-insar-controls-container").show();

    };

    this.upSelectCount = function(label) {
       let i=this.cgm_select_label.indexOf(label);
       if(i != -1) {
         window.console.log("this is bad.. already in selected list "+label);
         return;
       }

       let tmp=this.cgm_select_label.length;
       window.console.log("=====adding to list "+label+" ("+tmp+")");
       this.cgm_select_label.push(label);
       updateDownloadCounter(this.cgm_select_label.length);
    };

    this.downSelectCount = function(label) {
       if(this.cgm_select_label.length == 0) { // just ignore..
         return;
       }
       let i=this.cgm_select_label.indexOf(label);
       if(i == -1) {
         window.console.log("this is bad.. not in selected list "+label);
         return;
       }
       let tmp=this.cgm_select_label.length;
//       window.console.log("=====remove from list "+label+"("+tmp+")");
       this.cgm_select_label.splice(i,1);
       updateDownloadCounter(this.cgm_select_label.length);
    };

    this.zeroSelectCount = function() {
        this.cgm_select_label = [];
        updateDownloadCounter(0);
    };

    // get make the track boundary layers
    this.generateLayers = function () {
        if(cgm_insar_track_data == null)
          return;

        this.cgm_track_layers = new L.FeatureGroup();

        for (const index in cgm_insar_track_data) {
            if (cgm_insar_track_data.hasOwnProperty(index)) {
                let lat1 = parseFloat(cgm_insar_track_data[index].bb1_lat);
                let lon1 = parseFloat(cgm_insar_track_data[index].bb1_lon);
                let lat2 = parseFloat(cgm_insar_track_data[index].bb2_lat);
                let lon2 = parseFloat(cgm_insar_track_data[index].bb2_lon);
                let lat3 = parseFloat(cgm_insar_track_data[index].bb3_lat);
                let lon3 = parseFloat(cgm_insar_track_data[index].bb3_lon);
                let lat4 = parseFloat(cgm_insar_track_data[index].bb4_lat);
                let lon4 = parseFloat(cgm_insar_track_data[index].bb4_lon);
                let track_name = cgm_insar_track_data[index].track;
                let track_color = cgm_insar_track_data[index].color;
                let track_file = cgm_insar_track_data[index].file;

                while (lon1 < -180) { lon1 += 360; }
                while (lon1 > 180) { lon1 -= 360; }
                while (lon2 < -180) { lon2 += 360; }
                while (lon2 > 180) { lon2 -= 360; }
                while (lon3 < -180) { lon3 += 360; }
                while (lon3 > 180) { lon3 -= 360; }
                while (lon4 < -180) { lon4 += 360; }
                while (lon4 > 180) { lon4 -= 360; }
              
                let latlngs = [[lat1,lon1],[lat2,lon2],[lat3,lon3],[lat4,lon4]];
                let mypoly=polygon_options;
                mypoly['color']=track_color;
                let track=L.polygon(latlngs, mypoly);

                track.scec_properties = {
                    file: track_file,
                    track:track_name,
                    latlngs:latlngs
                };

                let bb_info = `InSAR track name: ${track_name}`;
                track.bindTooltip(bb_info);
                this.cgm_track_layers.addLayer(track);
            }
        }
    };

// for InSAR
// Station == Location
// Gid == Label
    this.toggleLocationSelected = function(layer, clickFromMap=false) {
        if (typeof layer.scec_properties.selected === 'undefined') {
            layer.scec_properties.selected = true;
        } else {
            layer.scec_properties.selected = !layer.scec_properties.selected;
        }

        if (layer.scec_properties.selected) {
            this.selectLocationByLayer(layer, clickFromMap);
            // if this locatin is not in search result, should add it in XXX
            let i=this.search_result.getLayerId(layer);
            if(!containsLayer(this.search_result,layer)) {
                let tmp=this.search_result;
                this.search_result.addLayer(layer);
            }
        } else {
            this.unselectLocationByLayer(layer);
        }

       return layer.scec_properties.selected;
    };

    this.toggleLocationSelectedByGid = function(gid) {
        let layer = this.getLayerByGid(gid);
        return this.toggleLocationSelected(layer, false);
    };

    this.selectLocationByLayer = function (layer, moveTableRow=false) {
        layer.scec_properties.selected = true;
        layer.setStyle(cgm_marker_style.selected);
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
            $("#metadata-viewer.insar tbody").prepend($rowHTML);
        }
    };

    this.unselectLocationByLayer = function (layer) {
        layer.scec_properties.selected = false;
        layer.setStyle(cgm_marker_style.normal);

        let gid = layer.scec_properties.gid;

        let $row = $(`tr[data-point-gid='${gid}'`);
        $row.removeClass('row-selected');
        let $glyphElem = $row.find('span.cgm-data-row');
        $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');

        this.downSelectCount(gid);
    };

    this.showLocationsByLayers = function(layers) {
        viewermap.addLayer(layers);
        var cgm_object = this;
/** ???
        this.search_result.eachLayer(function(layer){
            cgm_object.addToResultsTable(layer);
        });
**/
    };


    this.toggleSelectAll = function() {
        var cgm_object = this;

        let $selectAllButton = $("#cgm-allBtn span");
        if (!$selectAllButton.hasClass('glyphicon-check')) {
            this.search_result.eachLayer(function(layer){
                cgm_object.selectLocationByLayer(layer);
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
            cgm_object.unselectLocationByLayer(layer);
        });
        $("#cgm-allBtn span").removeClass('glyphicon-check').addClass('glyphicon-unchecked');
    };

    // unselect every layer
    this.clearAllSelections = function() {
        var cgm_object = this;
        this.cgm_layers.eachLayer(function(layer){
            if (layer.scec_properties.selected) {
                cgm_object.unselectLocationByLayer(layer);
            }
        });
        $("#metadata-viewer.insar tr.row-selected button span.glyphicon.glyphicon-check").removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        $("#metadata-viewer.insar tr.row-selected").removeClass('row-selected');
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
        let $table = $("#metadata-viewer.insar tbody");
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

// TODO, insar does not have fType
    this.executePlotTS = function(downloadURL, fType) {
      showTSview(downloadURL, fType);
      showPlotTSWarning();
    }

    this.downloadURLsAsZip = function(layer) {
XXX
        var nzip=new JSZip();
        var layers=CGM_INSAR.search_result.getLayers();
        let timestamp=$.now();
      
        var cnt=layers.length;
        for(var i=0; i<cnt; i++) {
          let layer=layers[i];

          if( !layer.scec_properties.selected ) {
            continue;
          }
      
// TODO
          let downloadURL = getDataDownloadURL(layer.scec_properties.location);
          let dname=downloadURL.substring(downloadURL.lastIndexOf('/')+1);
          let promise = $.get(downloadURL);
          nzip.file(dname,promise);
        }
      
        var zipfname="CGM_INSAR_"+timestamp+".zip"; 
        nzip.generateAsync({type:"blob"}).then(function (content) {
          // see FileSaver.js
          saveAs(content, zipfname);
        })
    }

var generateTableRow = function(layer) {
        let $table = $("#metadata-viewer");
        let html = "";
     
        let coordinates = layer.getLatLng();
        coordinates = {lat: parseFloat(coordinates.lat).toFixed(2), lng: parseFloat(coordinates.lng).toFixed(2) };

// XXX??
        let downloadURL = getDataDownloadURL(layer.scec_properties.location);
        let label = layer.scec_properties.gid;

        html += `<tr data-point-gid="${layer.scec_properties.gid}">`;
        html += `<td style="width:25px" class="cgm-data-click button-container"> <button class="btn btn-sm cxm-small-btn" id="" title="highlight the station" onclick=''>
            <span class="cgm-data-row glyphicon glyphicon-unchecked"></span>
        </button></td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.track}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.lat}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.lon}</td>`;
        html += `<td class="cgm-data-click">${layer.scec_properties.velocity}</td>`;
        html += `<td class="text-center">`;
        html += `<button class=\"btn btn-xs\" title=\"show time series\" onclick=CGM_INSAR.executePlotTS([\"${downloadURL}\"],[\"${label}\"])>plotTS&nbsp<span class=\"far fa-chart-line\"></span></button>`;
        html += `</tr>`;

        return html;
    };

    this.showSearch = function (type) {
        const $all_search_controls = $("#cgm-insar-controls-container ul li");
        switch (type) {
            case this.searchType.location:
                $all_search_controls.hide();
                $("#cgm-insar-location").show();
                drawPoint();
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
        let $cgm_model_checkbox = $("#cgm-model-insar");

/* This does not apply to INSAR
        if (this.searching) {
            this.search_result.addTo(viewermap);
        } else {
            this.cgm_layers.addTo(viewermap);
        }
*/
        // and show the boundary layer
        if (!$cgm_model_checkbox.prop('checked')) {
            $cgm_model_checkbox.prop('checked', true);
        }
        this.cgm_track_layers.addTo(viewermap);

        if (currentLayerName != 'shaded relief') {
            switchLayer('shaded relief');
            $("#mapLayer").val('shaded relief');
        }

    };

// XX CHECK
    this.hideProduct = function () {
window.console.log("Hide model/product");
/** 
        if (CGM_INSAR.searching) {
            CGM_INSAR.search_result.remove();
        } else {
            this.cgm_layers.remove();
        }
**/
        let $cgm_model_checkbox = $("#cgm-model-insar");
        if ($cgm_model_checkbox.prop('checked')) {
            $cgm_model_checkbox.prop('checked', false);
        }
        this.cgm_track_layers.remove();
    };

    this.reset = function() {
        window.console.log("insar calling -->>> reset");
        $("#wait-spinner").hide();
        this.zeroSelectCount()
        this.showSearch('none');
        this.searching = false;
        this.search_result.removeLayer();
        this.search_result = new L.FeatureGroup();

        //?? this.showProduct();

        skipRectangle();
        skipPoint();
        remove_bounding_rectangle_layer();
        remove_marker_point_layer();
        this.replaceResultsTableBody([]);

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        $("#cgm-insar-controls-container input, #cgm-insar-controls-container select").val("");

        this.clearAllSelections();
    };

    this.resetSearch = function (){
window.console.log("gnss calling -->> resetSearch..");
        $("#wait-spinner").hide();
        viewermap.removeLayer(this.search_result);
        this.searching = false;
        this.search_result = new L.FeatureGroup();

        this.replaceResultsTableBody([]);
        skipRectangle();
        skipPoint();
        remove_bounding_rectangle_layer();
        remove_marker_point_layer();

        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        this.clearAllSelections();
    };

    this.freshSearch = function (){
window.console.log(">>> calling freshSearch..");
        $("#cgm-insar-controls-container input").val("");
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

    this.showPHP = function(type, results, ncriteria) {

        if (results.length === 0) {
            viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        } else {
            let markerLocations = [];

            for (let i = 0; i < results.length; i++) {
                markerLocations.push(results[i].getLatLng());
                this.search_result.addLayer(results[i]);
            }

            this.showLocationsByLayers(this.search_result);

            if( !modelVisible()) {
                this.showProduct();
            }

            if (type == this.searchType.latlon) {
                this.unselectAll();
                markerLocations.push(L.latLng(ncriteria[0],ncriteria[1]));
                markerLocations.push(L.latLng(ncriteria[2],ncriteria[3]));
                let bounds = L.latLngBounds(markerLocations);
                viewermap.fitBounds(bounds, {maxZoom: 12});
                setTimeout(skipRectangle, 500);

            } else if (type == this.searchType.location) {
                let bounds = L.latLngBounds(markerLocations);
                viewermap.flyToBounds(bounds, {maxZoom: 12 });
// make sure the search box is refilled with actual lat lon
                $("#cgm-insar-LatTxt").val(ncriteria[0]);
                $("#cgm-insar-LonTxt").val(ncriteria[1]);
            }
        }

        this.replaceResultsTableBody(results);

        $("#wait-spinner").hide();
    };


    this.search = function(type, criteria) {
        window.console.log("insar  -->  calling search..");

        $searchResult = $("#searchResult");
        if (!type || !criteria) {
            $searchResult.html("");
        }
        if (!Array.isArray(criteria)) {
            criteria = [criteria];
        }

        let JSON_criteria = JSON.stringify(criteria);
window.console.log("calling search() with the type.."+type);
window.console.log("calling search() with the string.."+JSON_criteria);
        $("#wait-spinner").show();
        $.ajax({
            url: "php/search.php",
            data: {t: type, q: JSON_criteria},
        }).done(function(cgm_insar_data) {

            let results=[];
            let ncriteria=[];
window.console.log(cgm_insar_data);
            if(cgm_insar_data === "[]") {
window.console.log("Did not find any result");
            } else {
                 let tmp=JSON.parse(cgm_insar_data); 
                 let jblob=JSON.parse(tmp[0].replace(/'/g,'"'));
/*****
[{'gid':'label1', 
'tslist':[{'lat':35.32064,'lon':-116.57164,'track':'D071','file':'../result/pixel_-116.57164_35.32064_D071.csv'}, 
       {'lat':34.0522,'lon':-118.2437,'track':'D071','file':'../result/pixel_-118.2437_34.0522_D071.csv'}]},
{'gid':'label1',
 'tslist':[{'lat':35.32064,'lon':-116.57164,'track':'D077','file':'../result/pixel_-116.57164_35.32064_D077.csv'},
        {'lat':34.0522,'lon':-118.2437,'track':'D077','file':'../result/pixel_-118.2437_34.0522_D077.csv'}]}]
****/
                 for(let i=0; i< jblob.length; i++) {
                     let item=jblob[i];
                     let ngid=item['gid']
                     let tslist=item['tslist'];
                     for(let j=0; j<tslist.length; j++) {
                         let ts=tslist[i];
                         if(type==CGM_INSAR.searchType.location) {
                           let nlat=ts['lat'];
                           let nlon=ts['lon'];
                           let track_name=ts['track']
                           let file=ts['file'];
                           // create a ncriteria
                           ncriteria.push(nlat);
                           ncriteria.push(nlon);
                           let marker_layer=add_marker_point(nlat,nlon);
                           marker_layer.scec_properties = {
                                 track: track_name,
                                 lat: nlat,
                                 lon: nlon,
                                 file: file,
                                 velocity: 99,
                                 type: type,
                                 gid: ngid,
                                 selected: false,
                                 };
                           let bb_info = `track:${track_name}<br>lat:${nlat} lon:${nlon}`;
                           marker_layer.bindTooltip(bb_info);
                           results.push(marker_layer);
                         }
// XX this is not done.. yet, locations should be a bunch
                         if(type==CGM_INSAR.searchType.latlon) {
                             let latlon=latlonlist[j];
                             let nlat1=latlon['lat1'];
                             let nlon1=latlon['lon1'];
                             let nlat2=latlon['lat2'];
                             let nlon2=latlon['lon2'];
                             // create a ncriteria
                             ncriteria.push(nlat1);
                             ncriteria.push(nlon1);
                             ncriteria.push(nlat2);
                             ncriteria.push(nlon2);
                             let layer=add_bounding_rectangle(nlat1,nlon1,nlat2,nlon2);
                             layer.scec_properties = {
                                 lat: [ nlat1, nlon1 ],
                                 lon: [ nlat2, nlon2 ],
                                 velocity: 99,
                                 type: type,
                                 gid: ngid,
                                 selected: false,
                             };
                             results.push(layer);
                        }
                   }
                 }
            }
            CGM_INSAR.showPHP(type, results, ncriteria);
        });
    };

    this.searchBox = function (type, criteria) {

        if(!this.searching) { // don't restart 
          this.hideProduct();
          this.resetSearch();
        }

        this.searching = true;
        let results = this.search(type, criteria);
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
                         <th class="hoverColor" onClick="sortMetadataTableByRow(1,'a')">Track&nbsp<span id='sortCol_1' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(2,'n')">Lat&nbsp<span id='sortCol_2' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">Lon&nbsp<span id='sortCol_3' class="fas fa-angle-down"></span></th>
                        <th class="hoverColor" onClick="sortMetadataTableByRow(3,'n')">Velocity&nbsp<span id='sortCol_4' class="fas fa-angle-down"></span>(units)</th>

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

        $("#cgm-controlers-container").css('display','none');
        $("#cgm-insar-controlers-container").css('display','');

        $("div.mapData div.map-container").css('padding-left','30px');
        $("#CGM_plot").css('height','500px');
        viewermap.invalidateSize();
        viewermap.setView(this.defaultMapView.coordinates, this.defaultMapView.zoom);
        $download_queue_table.floatThead('destroy');

        this.replaceResultsTable([]);
        $download_queue_table.addClass('insar');
        $("#data-product-select").val("insar");

        $download_queue_table.floatThead({
             // floatTableClass: 'cgm-metadata-header',
             scrollContainer: function ($table) {
                 return $table.closest('div#metadata-viewer-container');
             },
        });

        $("#wait-spinner").hide();
    };

   
}
