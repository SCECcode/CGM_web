var viewermap;
var cfm_metadataViewerHTML;

jQuery(document).ready(function() {
  frameHeight=window.innerHeight;
  frameWidth=window.innerWidth;

  viewermap=setup_viewer();
  cfm_metadataViewerHTML = $("#metadata-viewer").html();

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

  $(document).ready(function() {
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

      $("#cfm-model").on('click', function () {
          if (cfm_visible) {
              hideCFMLayer();
          } else {
              showCFMLayer();
          }
      });

      $("#data-download-select").on('change', function(){
         if ($(this).val() == 'cfm') {
             activeModel = Models.CFM;
             $("div.control-container").hide();
             $("#cfm-controls-container").show();
             CGM.reset();
             if (!$("#cfm-model").prop('checked')) {
                $("#cfm-model").click();
             }

             var $download_queue_table = $('#metadata-viewer');

             $download_queue_table.floatThead('destroy');
             $download_queue_table.html(cfm_metadataViewerHTML);
             $download_queue_table.removeClass('cgm');
             $("div.cfm-search-result-container").attr('style', '');
             $("div.mapData div.map-container").addClass("col-7").removeClass("col-12").css('padding-left','inherit');

             $("#CFM_plot").css('height','400px');
             viewermap.invalidateSize();
             switchLayer('esri topo');
             var $download_queue_table = $('#metadata-viewer');
             $download_queue_table.floatThead({
                 scrollContainer: function ($table) {
                     return $table.closest('div#metadata-viewer-container');
                 },
             });
      } else if ($(this).val() == 'cgm') {

             CGM.setupCGMInterface();

      }
      });

      $.event.trigger({
          type: "page-ready",
          "message": "completed",
      });

  });

}); // end of MAIN



