
/***
   cgm_ui.js

   specific to cgm's viewer.php to 
      expand the leaflet map view
      manage the boreholes
      manage the opacity slider
***/

/************************************************************************************/
var big_map=0; // 0,1(some control),2(none)

function _toMedView()
{
let elt = document.getElementById('banner-container');
let celt = document.getElementById('top-intro');
let c_height = elt.clientHeight+(celt.clientHeight/2);
let h=576+c_height;

$('#top-intro').css("display", "none");
$('#CGM_plot').css("height", h);
$('#dataProductSelect').css("display", "none");
$('.leaflet-control-attribution').css("width", "70rem");
$('#top-map').removeClass('col-7').addClass('row');
$('#top-map').removeClass('pl-1').addClass('pl-0');
$('#mapDataBig').addClass('col-12').removeClass('row');
resize_map();
}

function _toMinView()
{
let height=window.innerHeight;
let width=window.innerWidth;

$('#top-control').css("display", "none");
$('#top-select').css("display", "none");
$('.navbar').css("margin-bottom", "0px");
$('.container').css("max-width", "100%");
$('.leaflet-control-attribution').css("width", "100rem");
$('.container').css("padding-left", "0px");
$('.container').css("padding-right", "0px");
// minus the height of the container top 
let elt = document.getElementById('banner-container');
let c_height = elt.clientHeight;
let h = height - c_height-4.5;
let w = width - 15;
//window.console.log( "height: %d, %d > %d \n",height, c_height,h);
//window.console.log( "width: %d, %d  \n",width, w);
$('#CGM_plot').css("height", h);
$('#CGM_plot').css("width", w);
resize_map();
}

function _toNormalView()
{
$('#top-control').css("display", "");
$('#top-select').css("display", "");
$('#CGM_plot').css("height", "576px");
$('#CGM_plot').css("width", "635px");
$('.navbar').css("margin-bottom", "20px");
$('.container').css("max-width", "1140px");
$('.leaflet-control-attribution').css("width", "35rem");
$('.container').css("padding-left", "15px");
$('.container').css("padding-right", "15px");

$('#top-intro').css("display", "");
$('#dataProductSelect').css("display","");
$('#top-map').removeClass('row').addClass('col-7');
$('#top-map').removeClass('pl-1').addClass('pl-0');
$('#mapDataBig').removeClass('col-12').addClass('row');
resize_map();
}

function toggleBigMap()
{
  // need to go to Model view if it is in 'Get Data' mode
  $('#searchTypeModel').click();
  switch (big_map)  {
    case 0:
      big_map=1;
      _toMedView();		   
      break;
    case 1:
      big_map=2;
      _toMinView();		   
      break;
    case 2:
      big_map=0;
      _toNormalView();		   
      break;
  }
}

/************************************************************************************/
function _toPercent(v) {
// change 0.8 to "80%"
  let nv=Math.floor(v*100);
  let str=String(nv);
  return str;
}

function setupOpacitySlider(alpha) {
    var handle = $( "#opacitySlider-handle" );

    $( "#opacitySlider" ).slider({
      value:0.8,
      min: 0,
      max: 1,
      step: 0.1, 
      create: function() {
        handle.text( _toPercent($( this ).slider( "value" )) );
      },
      change: function ( event, ui ) { 
        handle.text( _toPercent(ui.value) );
        CGM.changePixiLayerOpacity(ui.value);
      }
    });
}

function setOpacitySliderHandle(alpha) {
//window.console.log("calling opacitySliderHandle..");
    $( "#opacitySlider" ).slider( "option", "value", alpha);
}

/************************************************************************************/
function downloadHDF5InSAR(() {
    let type=$("#insar-track-select").val();
    window.console.log("TYPE ..", type);
//  saveAsURLFile('./csm_data/LuttrellHardebeckJGR2021_Table1.csv');
//  saveAsURLFile('https://files.scec.org/s3fs-public/LuttrellHardebeckJGR2021_Table1.csv');
}

