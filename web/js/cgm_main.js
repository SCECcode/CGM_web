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
var cgm_gnss_station_data=null;
var cgm_insar_data=null;

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

    $("#cgm-model-insar").on('click', function () {
        if ($(this).prop('checked')) {
            CGM_INSAR.showProduct();
        } else {
            CGM_INSAR.hideProduct();
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
        let type=$(this).val();
window.console.log("main(gnss) changing search type.."+type);
        CGM_GNSS.freshSearch();
        CGM_GNSS.showSearch(type);
    });

    $('.cgm-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
          $(this).off('mouseout');
          $(this).off('blur');

window.console.log(">>>> causing a start of gnss search..");
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
          }
          $(this).blur();
       });
    });

    $("#cgm-insar-search-type").on('change', function () {
        CGM_INSAR.showSearch($(this).val());
    });

    $('.cgm-insar-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
        $(this).off('mouseout');
        $(this).off('blur');
window.console.log(">>>>XXX causing a start of inar search..");
// these is where the change in latlon causes a new search..
// 
          if( $(this).val() != '' ) {
            let searchType = CGM_INSAR.searchType.location
            let $p=$(this).parent();
            let $criteria = $p.children("input");

            let criteria = [];
            let skip = false;

            $criteria.each(function(){
               let val=$(this).val();
window.console.log("FOUND..."+val);
                let n=isNaN(val);
                if(!isNaN(val) && val !='') {
                  criteria.push(parseFloat(val));
                  } else {
                    skip=true;
                }
            });

            if ($criteria.length === 4) {
               searchType = CGM_INSAR.searchType.latlon;
            }

            if(!skip) {
              $("div#wait-spinner").show(400, function(){
                  CGM_INSAR.searchBox(searchType, criteria);
              });
            }
            } else {
               CGM_INSAR.showSearch();
          }
          $(this).blur();
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


    $("#metadata-viewer-container").on('click','td.cgm-insar-data-click', function(){
window.console.log("HERE..");
        if ($(this).find('button[id="cgm-allBtn"]').length != 0) {
            return;
        }

        let $glyphElem = $(this).find('span.cgm-insar-data-row'); 
        let parent = $(this).parent();

        let gid = $(parent).data('point-gid');
        let isElemSelected = CGM_INSAR.toggleLocationSelectedByGid(gid);

        if (isElemSelected) {
            $(parent).addClass('row-selected');
            $glyphElem.removeClass('glyphicon-unchecked').addClass('glyphicon-check');
        } else {
            $(parent).removeClass('row-selected');
            $glyphElem.addClass('glyphicon-unchecked').removeClass('glyphicon-check');
        }

    });

    $("#data-product-select").on('change', function(){

       if(activeProduct == Products.GNSS) {
window.console.log("==> reset what was there/GNSS");
          CGM_GNSS.reset();
       } else {
window.console.log("==> reset what was there/INSAR");
          CGM_INSAR.reset();
       }

// set to new interface
       if ($(this).val() == 'gnss') {
           CGM_GNSS.setupCGMInterface();
       }
       if ($(this).val() == 'insar') {
           CGM_INSAR.setupCGMInterface();
       }
    });

    $.event.trigger({
        type: "page-ready",
        "message": "completed",
    });

    CGM_GNSS.generateLayers();
    CGM_INSAR.generateLayers();

    CGM_GNSS.setupCGMInterface();

    setup_infoTSTable();
    setup_warnTSTable();

    $("#wait-spinner").hide();

});
