/***
   ts_plotly.js
   plotting GNSS triplet time series (triplet)
***/

// for GNSS ts data
// [ { type:ftype, pos:plot_data }]
function plotly_plot_gnss_ts(pdata) {

  let pos_data=pdata['pos'];
  let pos_type=pdata['type'];

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

  let plot=pos_data[0].plot;   
  let info=pos_data[0].info;

  let pNorth=plot[0]; 
  let pEast=plot[1];
  let pUp=plot[2];

  let scec_image=[{
        source: "img/scec-statewide-logo-final-289x300_whitebg-v2.png",
        xref: "paper",
        yref: "paper",
        x:1,
        y:0,
        sizex: 0.1,
        sizey: 0.1,
        'xanchor':'left',
        'yanchor':'top'
      }];



  let traceEast = { x: pEast.x,
                    y: pEast.y,
                    xaxis: 'x',
                    yaxis: 'y',
                    name: '',
                    showlegend: false,
                    error_y: {
                          type: 'data',
                          array: pEast.yError,
                          visible: true,
    color: '#000000',
    thickness: 1,
    width: 1.5,
    opacity: 0.8 
                    },
                    type: 'scatter' };
  let traceNorth= { x: pNorth.x,
                    y: pNorth.y,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    name: '',
                    showlegend: false,
                    error_y: {
                          type: 'data',
                          array: pNorth.yError,
                          visible: true,
    color: '#000000',
    thickness: 1,
    width: 1.5,
    opacity: 0.8 
                    },
                    type: 'scatter' };
  let traceUp = { x: pUp.x,
                  y: pUp.y,
                  xaxis: 'x3',
                  yaxis: 'y3',
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
                  type: 'scatter' };

  let data = [traceEast, traceNorth, traceUp ];

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
        title: {text: 'East (mm)', font: { size:18,color:'#000000'}},
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
        linewidth: 2, },
    yaxis2: {
        title: {text: 'North (mm)', font: { size:18,color:'#000000'}},
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
    yaxis3: {
        title: {text: 'Up (mm)', font: { size:18,color:'#000000'}},
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
        tick0: '2000-01-01',
        dtick: 'M24', // number of months
        showgrid: true,
        zeroline: true,
        showline: true,
        mirror: 'allticks',
        tickes: 'inside',
        gridcolor: '#f1f1f1',
        gridwidth: 1,
        zerolinecolor: '#969696',
        zerolinewidth: 1,
        linecolor: '#636363',
        linewidth: 2 },
    xaxis2: {
        tickmode: "linear",
        tick0: '2000-01-01',
        dtick: 'M24', // number of months
        matches: 'x',
        showgrid: true,
        zeroline: true,
        showline: true,
        mirror: 'allticks',
        tickes: 'inside',
        gridcolor: '#f1f1f1',
        gridwidth: 1,
        zerolinecolor: '#969696',
        zerolinewidth: 1,
        linecolor: '#636363',
        linewidth: 2 },
    xaxis3: {
        tickmode: "linear",
        tick0: '2000-01-01',
        dtick: 'M24', // number of months
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
    annotations: [
        { text: pEast.topLeft, showarrow:false, x:0, xref:"x domain",y:1.18, yref:"y domain"},
        { text: pNorth.topLeft, showarrow:false, x:0, xref:"x domain",y:1.18, yref:"y2 domain"},
        { text: pUp.topLeft, showarrow:false, x:0, xref:"x domain",y:1.18, yref:"y3 domain"},
        { text: pEast.topRight, showarrow:false, x:1, xref:"x domain",y:1.18, yref:"y domain"},
        { text: pNorth.topRight, showarrow:false, x:1, xref:"x domain",y:1.18, yref:"y2 domain"},
        { text: pUp.topRight, showarrow:false, x:1, xref:"x domain",y:1.18, yref:"y3 domain"}
        ]
    };

  var config = {displayModeBar:true, toImageButtonOptions: {filename:makeUname(info.cgm_name)}};

  Plotly.newPlot('myDiv', data, layout, config);
  _savePlotly(info.cgm_name,data,layout,config, TS_PLOTLY_TYPE_GNSS_TS);

  window.top.postMessage({'call':'fromTSviewer', value:'done with loading'}, '*');
}

