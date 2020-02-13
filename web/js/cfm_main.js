var viewermap;

jQuery(document).ready(function() {

  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

  viewermap=setup_viewer();

  $("#view3d-all").on('click',function() {
     $('#view3DIfram').attr('src',"http:localhost:9999/?name=[WTRA-USAV-INDH-Indian_Hill_fault-CFM5.stl,WTRA-USAV-SNJH-San_Jose_fault-CFM5.stl,WTRA-USAV-UPLD-Upland_fault_dipslip-CFM1.stl,WTRA-USAV-WLNC-Walnut_Creek_fault-CFM5.stl]&url=[http://localhost:9999/cfm_data/WTRA-USAV-INDH-Indian_Hill_fault-CFM5.stl,http://localhost:9999/cfm_data/WTRA-USAV-SNJH-San_Jose_fault-CFM5.stl,http://localhost:9999/cfm_data/WTRA-USAV-UPLD-Upland_fault_dipslip-CFM1.stl,http://localhost:9999/cfm_data/WTRA-USAV-WLNC-Walnut_Creek_fault-CFM5.stl]");
  });

// special handle keyword's input completion
  $("#keywordTxt").keyup(function(event) {
        if (event.keyCode === 13) {
            searchByKeyword();
        }
  });     

// special handling latlon's input completion
  $("#firstLonTxt").keyup(function(event) {
        if (event.keyCode === 13) {
           var firstlatstr=document.getElementById("firstLatTxt").value;
           var firstlonstr=document.getElementById("firstLonTxt").value;
           if(firstlatstr && firstlonstr) {
               entered_latlon_by_hand();
           }
        }
  });     
  $("#firstLatTxt").keyup(function(event) {
        if (event.keyCode === 13) {
           var firstlatstr=document.getElementById("firstLatTxt").value;
           var firstlonstr=document.getElementById("firstLonTxt").value;
           if(firstlatstr && firstlonstr) {
               entered_latlon_by_hand();
           }
        }
  });     

  $("#secondLonTxt").keyup(function(event) {
        if (event.keyCode === 13) {
           var secondlatstr=document.getElementById("secondLatTxt").value;
           var secondlonstr=document.getElementById("secondLonTxt").value;
           if(secondlatstr && secondlonstr) {
               entered_latlon_by_hand();
           }
        }
  });     
  $("#secondLatTxt").keyup(function(event) {
        if (event.keyCode === 13) {
           var secondlatstr=document.getElementById("secondLatTxt").value;
           var secondlonstr=document.getElementById("secondLonTxt").value;
           if(secondlatstr && secondlonstr) {
               entered_latlon_by_hand();
           }
        }
  });     

  $(document).ready(function(){
  initializeFaultObjectTable();
  setupSearch();
  addFaultColorsSelect();
  addDownloadSelect();
    $("#search-type").change(function () {
        var funcToRun = $(this).val();
        if (funcToRun != "") {
            window[funcToRun]();
        }
    });

    $("#search-type").trigger("change");

    for (const index in cgm_station_velocity_data) {
        let lat = parseFloat(cgm_station_velocity_data[index].ref_north_latitude);
        let lon = parseFloat(cgm_station_velocity_data[index].ref_east_longitude);
        let vel_north = parseFloat(cgm_station_velocity_data[index].ref_velocity_north);
        let vel_east = parseFloat(cgm_station_velocity_data[index].ref_velocity_east);
        let horizontalVelocity = Math.sqrt(vel_north^2 + vel_east^2) ;
        let station_id = cgm_station_velocity_data[index].station_id;

        while(lon < -180){
            lon +=360;
        }
        while (lon > 180){
            lon -= 360;
        }

        // let horizontalVelocityAdjustment = horizontalVelocity*100;
        let marker = L.circle([lat, lon],
            {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500
    }
        );

        marker.bindTooltip(`station id: ${station_id}, vel: ${horizontalVelocity}`).openTooltip();
// see https://stackoverflow.com/questions/7477003/calculating-new-longitude-latitude-from-old-n-meters
        let dy = vel_north*1000;
        let dx = vel_east*1000;
        let r_earth = 6738;
        let pi = Math.PI;
        let new_latitude  = lat  + (dy / r_earth) * (180 / pi);
        let new_longitude = lon + (dx / r_earth) * (180 / pi) /Math.cos(lat * pi/180);
        let line_latlons = [
            [lat, lon],
            [new_latitude, new_longitude],
        ];

        let polyline = L.polyline(line_latlons, {color: "red"}).addTo(viewermap);
        var decorator = L.polylineDecorator(polyline, {
            patterns: [
                {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 5, polygon: false, pathOptions: {stroke: true, color: "red"}})}
            ]
        }).addTo(viewermap);
        cgm_arrows.push(decorator);

        viewermap.on("zoomend", function(e) {
                let newZoom = viewermap.getZoom();
                let pixelSize = Math.floor(newZoom * (1.4));
                    for (let d in cgm_arrows) {
                        cgm_arrows[d].setPatterns([
                            {
                            offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: pixelSize, polygon: false, pathOptions: {stroke: true, color: "red"}})
                            // {offset: 25, repeat: 100, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {color:"red'", fillOpacity: 1, weight: 0}})}
                    }
                            ] );
                    }
            }
        );

        marker.addTo(viewermap);

    }
  });
}); // end of MAIN



