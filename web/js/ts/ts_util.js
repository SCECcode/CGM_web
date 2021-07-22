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

  let traceNorth= { x: pNorth.x,
                    y: pNorth.y,
                    yaxis: 'x',
                    yaxis: 'y',
                    error_y: {
                          type: 'data',
                          array: pNorth.yError,
                          visible: true
                    },
                    type: 'scatter' };
  let traceEast = { x: pEast.x,
                    y: pEast.y,
                    xaxis: 'x',
                    yaxis: 'y2',
                    error_y: {
                          type: 'data',
                          array: pEast.yError,
                          visible: true
                    },
                    type: 'scatter' };

  let traceUp = { x: pUp.x,
                  y: pUp.y,
                  xaxis: 'x',
                  yaxis: 'y3',
                  error_y: {
                        type: 'data',
                        array: pUp.yError,
                        visible: true
                  },
                  type: 'scatter' };

  var data = [traceNorth, traceEast, traceUp ];
  var layout = { 
                 width: figw,
                 height: figh,
                 xaxis: {
showgrid: true,
zeroline: true,
showline: true,
mirror: 'ticks',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 2,
linecolor: '#636363',
linewidth: 4
                         },
                 yaxis: {
title: 
  {text: 'North(mm)', font: { family:'Courier New,monospace',size:18,color:'#000000'}},
showgrid: false,
zeroline: true,
showline: true,
mirror: 'ticks',
gridcolor: '#bdbdbd',
gridwidth: 1,
zerolinecolor: '#969696',
zerolinewidth: 2,
linecolor: '#636363',
linewidth: 2
                        },
                 yaxis2: {},
                 yaxis3: {},
                 grid: {
                    rows: 3,
                    columns: 1,
                    subplots: [ ['xy'],['xy2'], ['xy3'] ]
                 }
               };

   var config = {responsive: true}

  Plotly.newPlot('myDiv', data, layout, config);
}
