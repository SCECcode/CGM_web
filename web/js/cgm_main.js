/***
   cgm_main.js
***/

var initial_page_load = true;
const Models = {
    CGM: 'cgm',
};
var activeModel = Models.CFM;
var viewermap;
var cgm_station_data;

$(document).ready(function () {

    viewermap=setup_viewer();

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

    $('.cgm-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
        $(this).off('mouseout');
        $(this).off('blur');
window.console.log("causing a start of search..");
// these is where the change in latlon causes a new search..
          if( $(this).val() != '' ) {
            let searchType = CGM.searchType.latlon
            let $p=$(this).parent();
            let $criteria = $p.children("input");

            let criteria = [];
            let skip = false;

            if ($criteria.length === 1) {
               searchType = CGM.searchType.stationName;
               criteria = $criteria.val();
            } else {
                $criteria.each(function(){
                    if(!isNaN($(this).val()) && $(this).val() !='') {
                      criteria.push($(this).val());
                      } else {
                        skip=true;
                    }
                });
            }

            if(!skip) {
              $("div#wait-spinner").show(400, function(){
                  CGM.searchBox(searchType, criteria);
              });
            }
           } else {
              $(this).blur();
           }
       });
    });

    $("#metadata-viewer-container").on('click','td.cgm-data-click', function(){
        if ($(this).find('button[id="cgm-allBtn"]').length != 0) {
            return;
        }

        let $glyphElem = $(this).find('span.cgm-data-row'); 
        let parent = $(this).parent();

        let gid = $(parent).data('point-gid');
        let isElemSelected = CGM.toggleStationSelectedByGid(gid);

        if (isElemSelected) {
            $(parent).addClass('row-selected');
            $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');
        } else {
            $(parent).removeClass('row-selected');
            $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');
        }

    });

    $("#data-download-select").on('change', function(){
       if ($(this).val() == 'cgm') {
           CGM.setupCGMInterface();
       }
    });

    CGM.generateLayers();

    $.event.trigger({
        type: "page-ready",
        "message": "completed",
    });


    CGM.setupCGMInterface();

    setup_infoTSTable();
    setup_warnTSTable();

    $("#wait-spinner").hide();

});
