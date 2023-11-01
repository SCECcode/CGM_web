/***
   ts_util.js
***/
// tracking parsed data
var TS_pos_data=[];
var TS_csv_data=[];

const TS_PLOTLY_TYPE_GNSS_TS=0;
const TS_PLOTLY_TYPE_INSAR_TS=1;
const TS_PLOTLY_TYPE_INSAR_VS=2;

// tracking current plotly objects
var TS_plotly_name;
var TS_plotly_data;
var TS_plotly_layout;
var TS_plotly_config;
var TS_plotly_type;

function _savePlotly(name,data,layout,config,ptype) {
   TS_plotly_name=name;
   TS_plotly_data=data;
   TS_plotly_layout=layout;
   TS_plotly_config=config;
   TS_plotly_type=ptype;
}

function gnss_plot_size() {
   if(TS_plotly_layout) {
      return [TS_plotly_layout.width, TS_plotly_layout.height];
   }
   return [ 0, 0 ]; 
}

function plotly_plot_clear() {
  Plotly.purge('myDiv');
}


// Plotly.downloadImage('myDiv', {format: 'png', width: 800, height: 600, filename: fname});
// on safari, always store into Unknown_X.png
function plotly_plot_image_unknown() {
  let myfname=TS_plotly_name;
  window.console.log("fname used.."+myfname);
  if(TS_plotly_layout) {
      Plotly.downloadImage('myDiv', {format: 'png', width: TS_plotly_layout.width, height: TS_plotly_layout.height, filename: myfname});
  }
  window.console.log("called plotly_plot_image");
}

// this one does not work for surface-contour plot
function plotly_plot_image2() {
  if(TS_plotly_layout) {

/* -- this does not work..
     if(TS_plotly_type == TS_PLOTLY_TYPE_INSAR_VS) {
         plotly_plot_image_unknown();
         return;
     }
*/

     let fname=TS_plotly_name;
     var gd = document.getElementById('myDiv');
     Plotly.toImage(gd,{format: 'png', width: TS_plotly_layout.width, height: TS_plotly_layout.height}).
       then(function(dataURL) {
window.console.log("calling toImage, "+TS_plotly_layout.width+" "+TS_plotly_layout.height);
          let image=dataURL;
          savePNG(fname,dataURL);
     });
  }
}


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
  try { http.send();
  } catch(e) {
     window.console.log("bad http.send call..");
     alert("Unable to retrieve \n\n"+url);
     window.top.postMessage({'call':'fromTSviewer', value:'fail to load'}, '*');
     return null;
  }
  if(http.status !== 404) {
    return http.responseText;
    } else {
      return null;
  }
};

//https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript
function truncate(numstr, digits) {
    if (numstr.indexOf('.') > -1) {
        return numstr.substr(0 , numstr.indexOf('.') + digits+1 );
    } else {
        return numstr;
    }
}

//always the first one.
function load_GNSS_ProcessTSFromPOS(ulist,tlist) {

  let sz=TS_pos_data.length; // to be reused
  let ftype=tlist[0];
  let url=ulist[0];
  let i;
  let pos=null;
  for(i=0; i<sz; i++) {
     let item=TS_pos_data[i];
     let tmp=item['type'];
     if(ftype == tmp) { 
        pos=item;
        window.console.log("found existing pos data for >> "+tmp);
        break;
     }
   }
   if(pos == null) {
     let data = ckExist(url);
     if(data == null) {
        return; 
     }
     let plot_data=processPOS(data);
     pos={'type':ftype,'pos':plot_data};
     TS_pos_data.push(pos);
   }
   plotly_plot_gnss_ts(pos);
}

// { "dtype":"TS", "track": tType, "gid":gid };
function load_INSAR_ProcessTSFromCSV(ulist,params) {
   let url = ulist[0];
   let track = params['track'];
   let gid = params['gid'];
   let data = ckExist(url);

   let ts_plot_data = processCSV(data,gid,track);
    
   plotly_plot_insar_ts({'type':track,'csv':ts_plot_data});
}

// { "dtype":"VS", "track": tType, "gid":gid };
function load_INSAR_ProcessVSFromCSV(ulist,params) {
   let url = ulist[0];
   let track = params['track'];
   let gid = params['gid'];
   let nx = parseInt(params['nx']);
   let ny = parseInt(params['ny']);
   let data = ckExist(url);

   let vs_plot_data = processCSV4VS(data,gid,track,nx,ny);
    
   plotly_plot_insar_vs({'type':track,'csv':vs_plot_data});
}


function changeTSview(params) {
  window.top.postMessage({'call':'fromTSviewer', value:'start loading'}, '*');
  plotly_plot_clear();

  // grab new params,
  [urls, ptype, ftypes]=getParams(params);
  window.console.log("changeTSview.."+urls[0]+" "+ptype+" "+ftypes[0]);

  if(ptype == "gnss") {
  load_GNSS_ProcessTSFromPOS(urls,ftypes);
  } else {
    params=ftypes[0]; // { "dtype":"TS", "track": tType, "gid":gid };
    if(ftypes == params['dtype'] == "TS" ) {
      load_INSAR_ProcessTSFromCSV(urls,params);
      } else {
        load_INSAR_ProcessVSFromCSV(urls,params);
    }
  }
}

// for GNSS,  [url..url],GNSS,[ftype..ftype]
// for INSAR, [url],INSAR,[{...}]
// https://stackoverflow.com/questions/28295870/how-to-pass-parameters-through-iframe-from-parent-html
function getParams(param) {

  if(param == "") {
    // expecting  "urls=...&ptype=..&ftypes=...""
    param = window.location.search.substring(1);
  }
  window.console.log("param string is .."+param);
  if(param == "") {
    return [];
  }

  let myURL;
  let myPtype;
  let myFtype;

  let qArray = param.split('&'); //get key-value pairs
  for (var i = 0; i < qArray.length; i++)
  {
     let pArr = qArray[i].split('='); //split key and value
//window.console.log(pArr[1]);
     let dd=decodeURI(pArr[1]);
     switch (pArr[0]) {
        case "urls":
             myURL=JSON.parse(dd);
             break;
        case "ptype":
             myPtype=JSON.parse(dd);
             break;
        case "ftypes":
             myFtype=JSON.parse(dd);
             break;
        default:
// do nothing
             break;
     }
  }
window.console.log("myURL "+ myURL);
window.console.log("myPtype "+ myPtype);
window.console.log("myFtype "+ myFtype);

  return [myURL, myPtype, myFtype];
}


// unique name
function makeUname(n) {
    let d=new Date();
    let timestamp = d.getTime();
    let nfname=n+'_'+timestamp;
    return nfname;
}

// plotly's have funny file name
function savePNG(fname,image) {
    let nfname=makeUname(fname);
    let a = document.createElement('a');
    a.href = image;
    a.download = nfname+".png";
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove()
}

// working around plotly's toImage not working for some of the plots
//
function plotly_plot_image() {
    let fname=TS_plotly_name;
    let elt=document.getElementById('myDiv');
    html2canvas(elt).then(function(canvas) {
           let img = canvas.toDataURL("image/png");
           savePNG(fname,img);
    });
}

