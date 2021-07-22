/***
   ts_util.js
***/

// should be a very small file and used for testing and so can ignore
// >>Synchronous XMLHttpRequest on the main thread is deprecated
// >>because of its detrimental effects to the end user's experience.
function ckExist(url) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function () {
    if (this.readyState == 4) {
 // okay
    }
  }
  http.open("GET", url, false);
  http.send();
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
};


function loadAndProcessFromFile(ulist,nlist,figw,figh) {
  let sz=ulist.length;

// assume there is just 1 for now
  let data = ckExist(ulist[0]);
  let plot_data=processPOS(0,nlist[0],data);
  plotly_plot_pos(plot_data,figw,figh);
  
/*** ???
  for(i=0;i<sz;i++) {
    let promise = $.get(ulist[i]);
    processPOS(i,nlist[i],promise);
  }
***/
}

// https://stackoverflow.com/questions/28295870/how-to-pass-parameters-through-iframe-from-parent-html
function getCallingParams() {

  // expecting  "URL", and "fname"
  let url = window.location.search.substring(1);
  var myURL=null;
  var myFname=null;

  window.console.log("param url is .."+url);
  if(url == "") {
    return [];
  }
  let qArray = url.split('&'); //get key-value pairs
  for (var i = 0; i < qArray.length; i++)
  {
     let pArr = qArray[i].split('='); //split key and value
     switch (pArr[0]) {
        case "URL":
             myURL=pArr[1];
             break;
        case "fileName":
             myFname=pArr[1];
             break;
        default: 
// do nothing
             break;
     }
  }
  return [myURL, myFname];
}


// plotly 
function plotly_plot_pos(pos_data,figw,figh) {

  let plot=pos_data[0].plot;   

  let pNorth=plot[0]; 
  let pEast=plot[1];
  let pUp=plot[2];

window.console.log("HERE..");

  let traceEast = { x: pEast.x,
                    y: pEast.y,
                    xaxis: 'x',
                    yaxis: 'y',
                    showlegend: false,
                    error_y: {
                          type: 'data',
                          array: pEast.yError,
                          visible: true
                    },
                    type: 'scatter' };
  let traceNorth= { x: pNorth.x,
                    y: pNorth.y,
                    xaxis: 'x2',
                    yaxis: 'y2',
                    showlegend: false,
                    error_y: {
                          type: 'data',
                          array: pNorth.yError,
                          visible: true
                    },
                    type: 'scatter' };
  let traceUp = { x: pUp.x,
                  y: pUp.y,
                  xaxis: 'x3',
                  yaxis: 'y3',
                  showlegend: false,
                  error_y: {
                        type: 'data',
                        array: pUp.yError,
                        visible: true
                  },
                  type: 'scatter' };

  var data = [traceEast, traceNorth, traceUp ];
  var layout = { 
                 width: figw,
                 height: figh,
                 
                 yaxis: {
title: {text: 'East(mm)', font: { size:18,color:'#000000'}},
showgrid: true,
zeroline: true,
showline: true,
mirror: 'allticks',
tickes: 'inside',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 1,
linecolor: '#636363',
linewidth: 2,
                        },
                 yaxis2: {
title: {text: 'North(mm)', font: { size:18,color:'#000000'}},
showgrid: true,
zeroline: true,
showline: true,
mirror: 'allticks',
tickes: 'inside',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 1,
linecolor: '#636363',
linewidth: 2
                         },
                 yaxis3: {
title: {text: 'Up(mm)', font: { size:18,color:'#000000'}},
showgrid: true,
zeroline: true,
showline: true,
mirror: 'allticks',
tickes: 'inside',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 1,
linecolor: '#636363',
linewidth: 2
                         },
                 xaxis: {
showgrid: true,
zeroline: true,
showline: true,
mirror: 'allticks',
tickes: 'inside',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 1,
linecolor: '#636363',
linewidth: 2
                         },
                 xaxis2: {
matches: 'x',
showgrid: true,
zeroline: true,
showline: true,
mirror: 'allticks',
tickes: 'inside',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 1,
linecolor: '#636363',
linewidth: 2
                         },
                 xaxis3: {
matches: 'x',
showgrid: true,
zeroline: true,
showline: true,
mirror: 'allticks',
tickes: 'inside',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 2,
linecolor: '#636363',
linewidth: 2
                         },
                 grid: { rows: 3, columns: 1,  pattern: 'independent' },
annotations: [
{ text: pEast.topLeft, showarrow:false, x:0, xref:"x domain",y:1.2, yref:"y domain"},
{ text: pNorth.topLeft, showarrow:false, x:0, xref:"x domain",y:1.2, yref:"y2 domain"},
{ text: pUp.topLeft, showarrow:false, x:0, xref:"x domain",y:1.2, yref:"y3 domain"},
{ text: pEast.topRight, showarrow:false, x:1, xref:"x domain",y:1.2, yref:"y domain"}
]
               };

   var config = {responsive: true}

  Plotly.newPlot('myDiv', data, layout, config);
}
