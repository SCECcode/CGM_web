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
  let i;
  let plot_data;

  // just do one at a time
  for(i=0;i<sz;i++) {
    let data = ckExist(ulist[i]);
    plot_data=processPOS(i,nlist[i],data);
    plotly_plot_pos(plot_data,figw,figh);
  }
  
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
                 grid: {
                    rows: 3,
                    columns: 1,
                    subplots: [ ['xy'],['xy2'], ['xy3'] ],
                 }
               };

  Plotly.newPlot('myDiv', data, layout);
}
