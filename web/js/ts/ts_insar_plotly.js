/***
   ts_insar_plotly.js
   plotting INSAR time series and velocity plot
***/

// for INSAR ts data
// [ { type:ttype, csv:plot_data }]
function plotly_plot_insar_ts(cdata) {

  let csv_data=cdata['csv'];
  let csv_type=cdata['type'];

  let margin_offset=60;

  let frameHeight=window.innerHeight;                                    
  let frameWidth=window.innerWidth-margin_offset-margin_offset;

  let margin_left_default=80;
  let margin_right_default=80;
  let margin_top_default=100;

//window.console.log("frame width "+frameWidth+" frame height "+frameHeight);

  let frameWidth_min=800;

  let nh=frameHeight;
  let nw=frameWidth;
  if(frameWidth < frameWidth_min) {
     window.console.log("plotting screen width is too small, should be at least "+frameWidth_min);
     nw=frameWidth_min;
//     nh= Math.floor((nw/3.5)*3);
  }
  nw=nw+margin_offset+margin_offset;

// adjust if need to
  let nnl=Math.floor((frameWidth - nw)/2);
  window.console.log("nnl is "+nnl);
  if(nnl < margin_offset)
     nnl=margin_offset;

  let margin_top=margin_top_default+Math.floor((frameHeight-nh)/2);
  let margin_left=margin_left_default+nnl;
  let margin_right=margin_right_default+nnl;

  window.console.log("nw "+nw+" nh "+nh);

  let plot=csv_data[0].plot;   
  let info=csv_data[0].info;

  let pUp=plot[0];   

  let scec_image=[{
        source: "img/SCEC_Traditional_Logo_Red.png",
        xref: "paper",
        yref: "paper",
        x:1,
        y:0,
        sizex: 0.1,
        sizey: 0.1,
        'xanchor':'left',
        'yanchor':'top'
      }];

  let traceUp = { x: pUp.x,
                  y: pUp.y,
                  name: '',
                  showlegend: false,
                  error_y: {
                        type: 'data',
                        array: pUp.yError,
                        visible: true,
                        color: '#000000',
                        thickness: 1,
                        width: 1.5,
                        opacity: 0.8 
                  },
                  mode: 'lines+markers',
                  type: 'scatter' };

  let data = [traceUp ];

  let layout = { 
paper_bgcolor: '#f1fff1',
plot_bgcolr: '#f1fff1',
title: info.cgm_title,
width: nw,
height: nh,
margin: { l:margin_left, t:margin_top, r:margin_right },
colorway: [ '#1f77b4','#1f77b4','#1f77b4'],
images: scec_image,
yaxis: {
    title: {text: 'LOS (mm)', font: { size:18,color:'#000000'}},
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: 'allticks',
    tickes: 'inside',
    nticks: 8,
    gridcolor: '#f1f1f1',
    gridwidth: 1,
    zerolinecolor: '#969696',
    zerolinewidth: 1,
    linecolor: '#636363',
    linewidth: 2 },
xaxis: {
    tickmode: "linear",
    tick0: '2015-01-01',
    dtick: 'M4', // number of months
    tickformat:'%b %Y',
    tickangle: 45,
    matches: 'x',
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: 'allticks',
    tickes: 'inside',
    gridcolor: '#f1f1f1',
    gridwidth: 1,
    zerolinecolor: '#969696',
    zerolinewidth: 2,
    linecolor: '#636363',
    linewidth: 2 },
grid: { rows: 3, columns: 1, pattern: 'independent' },
annotations: [ ]
};

  let config = {displayModeBar:true, toImageButtonOptions: {filename:makeUname(info.cgm_name)}};

  Plotly.newPlot('myDiv', data, layout, config);
  _savePlotly(info.cgm_name,data,layout,config,TS_PLOTLY_TYPE_INSAR_TS);

  window.top.postMessage({'call':'fromTSviewer', value:'done with loading'}, '*');
}

/******/
/* surface plot with countours
var data = [{
  z: z_data,
  type: 'surface',
  contours: {
    z: {
      show:true,
      usecolormap: true,
      highlightcolor:"#42f462",
      project:{z: true}
    }
  }
}];

var layout = {
  title: 'velocity plot with projected contour',
  scene: {camera: {eye: {x: 1.87, y: 0.88, z: -0.64}}},
  autosize: false,
  width: 500,
  height: 500,
  margin: { l: 65, r: 50, b: 65, t: 90, }
};
*/

// for INSAR ts data
// [ { type:ttype, csv:plot_data }]
function plotly_plot_insar_vs(cdata) {

  let csv_data=cdata['csv'];
  let csv_type=cdata['type'];

  let margin_offset=60;

  let frameHeight=window.innerHeight;                                    
  let frameWidth=window.innerWidth-margin_offset-margin_offset;

  let margin_left_default=80;
  let margin_right_default=80;
  let margin_top_default=100;

//window.console.log("frame width "+frameWidth+" frame height "+frameHeight);

  let frameWidth_min=800;

  let nh=frameHeight;
  let nw=frameWidth;
  if(frameWidth < frameWidth_min) {
     window.console.log("plotting screen width is too small, should be at least "+frameWidth_min);
     nw=frameWidth_min;
  }
  nw=nw+margin_offset+margin_offset;

// adjust if need to
  let nnl=Math.floor((frameWidth - nw)/2);
  window.console.log("nnl is "+nnl);
  if(nnl < margin_offset)
     nnl=margin_offset;

  let margin_top=margin_top_default+Math.floor((frameHeight-nh)/2);
  let margin_left=margin_left_default+nnl;
  let margin_right=margin_right_default+nnl;

  window.console.log("nw "+nw+" nh "+nh);

  let plot=csv_data[0].plot;   
  let info=csv_data[0].info;
  let pdata=plot[0];   

  let scec_image=[{
        source: "img/SCEC_Traditional_Logo_Red.png",
        xref: "paper",
        yref: "paper",
        x:1,
        y:0,
        sizex: 0.1,
        sizey: 0.1,
        'xanchor':'left',
        'yanchor':'top'
  }];

  let data = [{
    z: pdata['z'],
    type: 'surface',
    contours: {
      z: {
        show:true,
        usecolormap: true,
        highlightcolor:"#42f462",
        project:{z: true}
      }
    }
  }];

window.console.log("aspect ration is "+pdata['aspect']);

  let layout = { 
    paper_bgcolor: '#f1fff1',
    plot_bgcolr: '#f1fff1',
    title: info.cgm_title,
    width: nw,
    height: nh,
    autorange : false,
    aspectmode : 'manual',
    scene: { aspectratio : {x:1,y:pdata['aspect'],z:0.5},camera: {eye: {x: 0, y: -1, z: 0.50}}},
    margin: { l:margin_left, t:margin_top, r:margin_right },
    images: scec_image,
  };

  let config = {displayModeBar:true, toImageButtonOptions: {filename:makeUname(info.cgm_name)}};

  Plotly.newPlot('myDiv', data, layout, config);
  _savePlotly(info.cgm_name,data,layout,config,TS_PLOTLY_TYPE_INSAR_VS);

  window.top.postMessage({'call':'fromTSviewer', value:'done with loading'}, '*');
}
