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

    $("#cgm-model-gnss").on('click', function () {
        if ($(this).prop('checked')) {
            CGM_GNSS.showProduct();
        } else {
            CGM_GNSS.hideProduct();
        }
    });

    $("#cgm-model-gnss-vectors").on('click', function () {
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


    $("#cxm-model-cfm").on('click', function () {
        if ($(this).prop('checked')) {
            CXM.showCFMFaults(viewermap);
        } else {
            CXM.hideCFMFaults(viewermap);
        }
    });

    $("#cxm-model-gfm").change(function() {
        if ($("#cxm-model-gfm").prop('checked')) {
            CXM.showGFMRegions(viewermap);
        } else {
              CXM.hideGFMRegions(viewermap);
      }
    });

    $("#gnss-search-select").on('change', function () {
        let type=$(this).val();
window.console.log("main(gnss) changing search type.."+type);
        CGM_GNSS.freshSearch();
        CGM_GNSS.showSearch(type);
    });


    $('.cgm-search-item').on('focus', function () {
      $(this).on('blur mouseout', function () {
          $(this).off('mouseout');
          $(this).off('blur');

window.console.log(">>>> causing a start of a  search..");

          if( activeProduct == Products.GNSS ) {
            if( $(this).val() != '' ) {
              let searchType = CGM_GNSS.searchType.latlon  // set default
              let $p=$(this).parent();
              let $criteria = $p.children("input");
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
                  CGM_GNSS.searchBox(searchType, criteria);
              }
            }
            //$(this).blur();

            } else { // it is InSAR

              if( $(this).val() != '' ) {
                let searchType = CGM_INSAR.searchType.location
                let $p=$(this).parent();
                let $criteria = $p.children("input");
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
                   // do nothing ???
                   CGM_INSAR.showSearch();
              }
              $(this).blur();
          }
      });
    });


    $("#insar-track-select").on('change', function () {
        CGM_INSAR.setTrackName($(this).val());
        CGM_INSAR.resetTrackView($(this).val());
    });

    $("#insar-search-select").on('change', function () {
        CGM_INSAR.freshSearch();
        CGM_INSAR.showSearch($(this).val());
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

// MAIN SETUP
    setup_infoTSTable();
    setup_warnTSTable();
    setup_pixi();

    CGM.setupCGMInterface();

    $("#wait-spinner").hide();

window.console.log("DONE initialize from  Main");
    $.event.trigger({ type: "page-ready", "message": "completed", });

});
