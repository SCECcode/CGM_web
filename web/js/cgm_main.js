/***
   cgm_main.js
***/

var initial_page_load = true;

const Products = {
    GNSS: 'gnss',
    INSAR: 'insar',
};
var activeProduct = Products.GNSS;
var viewermap;
var cgm_gnss_station_data;
var cgm_insar_data;

$(document).ready(function () {

    viewermap=setup_viewer();

    $("#cgm-model").on('click', function () {
//??        if (viewermap.hasLayer(CGM_GNSS.cgm_layers) ||  CGM_GNSS.searching) {
        if ($(this).prop('checked')) {
            CGM_GNSS.showProduct();
        } else {
            CGM_GNSS.hideProduct();
        }
    });

    $("#cgm-model-vectors").on('click', function () {
        if ($(this).prop('checked')) {
            CGM_GNSS.showVectors();
        } else {
            CGM_GNSS.hideVectors();
        }
    });

    $("#cgm-model-cfm").on('click', function () {
        if ($(this).prop('checked')) {
            CXM.showCFMFaults(viewermap);
        } else {
            CXM.hideCFMFaults(viewermap);
        }
    });


    $("#cgm-search-type").on('change', function () {
        CGM_GNSS.showSearch($(this).val());
    });

    $('.cgm-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
        $(this).off('mouseout');
        $(this).off('blur');
window.console.log(">>>> causing a start of search..");
// these is where the change in latlon causes a new search..
// 
          if( $(this).val() != '' ) {
            let searchType = CGM_GNSS.searchType.latlon  // set default
            let $p=$(this).parent();
            let $criteria = $p.children("input");

            let criteria = [];
            let skip = false;

            if ($criteria.length === 1) {
               searchType = CGM_GNSS.searchType.stationName;
               criteria = $criteria.val();
            } else { // 2 or 4
                $criteria.each(function(){
                    if(!isNaN($(this).val()) && $(this).val() !='') {
                      criteria.push($(this).val());
                      } else {
                        skip=true;
                    }
                });
            }
            if ($criteria.length === 2) {
               searchType = CGM_GNSS.searchType.vectorSlider;
            }

            if(!skip) {
              $("div#wait-spinner").show(400, function(){
                  CGM_GNSS.searchBox(searchType, criteria);
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
        let isElemSelected = CGM_GNSS.toggleStationSelectedByGid(gid);

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
           CGM_GNSS.setupCGMInterface();
       }
    });

    CGM_GNSS.generateLayers();
//    CGM_GNSS.generateInSARLayers();

    $.event.trigger({
        type: "page-ready",
        "message": "completed",
    });


    CGM_GNSS.setupCGMInterface();

    setup_infoTSTable();
    setup_warnTSTable();

    $("#wait-spinner").hide();

});
