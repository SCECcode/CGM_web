/***
   cgm_main.js
***/

var initial_page_load = true;
const Products = {
    GNSS: 'gnss',
    INSR: 'insar'
};

var activeProduct = Products.GNSS;

var viewermap;

var cgm_gnss_station_data;
var cgm_insar_data;

$(document).ready(function () {

    viewermap=setup_viewer();

    $("#cgm-model-gnss").on('click', function () {
//??        if (viewermap.hasLayer(CGM.cgm_layers) ||  CGM.searching) {
        if ($(this).prop('checked')) {
            CGM_GNSS.showModel();
        } else {
            CGM_GNSS.hideModel();
        }
    });

    $("#cgm-model-gnss-vectors").on('click', function () {
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

    $("#cgm-gnss-search-type").on('change', function () {
        CGM_GNSS.showSearch($(this).val());
    });

    $('.cgm-gnss-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
        $(this).off('mouseout');
        $(this).off('blur');

// these is where the change in any cgm-search-item causes a new search..
window.console.log(">>>> causing a start of CGM search..");

          if( $(this).val() != '' ) {
            let searchType = CGM_GNSS.searchType.latlon  // set default
            let $p=$(this).parent();
            let $criteria = $p.children("input");

            let criteria = [];
            let skip = false;

// criteria 1/station, 2/vector, 4/latlon
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

    $("#cgm-insar-search-type").on('change', function () {
        CGM_INSAR.showSearch($(this).val());
    });

    $('.cgm-insar-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
        $(this).off('mouseout');
        $(this).off('blur');

// these is where the change in any cgm-insar-search-item causes a new search..
window.console.log(">>>> causing a start of CGM search..");

          if( $(this).val() != '' ) {
            let searchType = CGM_INSAR.searchType.location
            let $p=$(this).parent();
            let $criteria = $p.children("input");

            let criteria = [];
            let skip = false;

//criteria 3/location, 2/velocity, 4/location
            if ($criteria.length >= 2) {
                $criteria.each(function(){
                    if(!isNaN($(this).val()) && $(this).val() !='') {
                      criteria.push($(this).val());
                      } else {
                        skip=true;
                    }
                });
            }
            if ($criteria.length === 4) {
               searchType = CGM_INSAR.searchType.latlon;
            }
            if ($criteria.length === 2) {
               searchType = CGM_INSAR.searchType.velocity;
            }

            if(!skip) {
              $("div#wait-spinner").show(400, function(){
                  CGM_INSAR.searchBox(searchType, criteria);
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
       if ($(this).val() == 'gnss') {
           CGM.setupGNSSInterface();
       }
       if ($(this).val() == 'insar') {
           CGM.setupINSARInterface();
       }
    });

    CGM_GNSS.generateGNSSLayers();
    CGM_INSAR.generateINSARLayers();

    $.event.trigger({
        type: "page-ready",
        "message": "completed",
    });


    CGM.setupCGMInterface();

    setup_infoTSTable();
    setup_warnTSTable();

    $("#wait-spinner").hide();

});
