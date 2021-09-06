/***
   ts_util.js
***/
// tracking parsed pos data

var TS_pos_data=[];
var TS_csv_data=[];

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
    
   plotly_plot_insar_ts({'type':ttype,'csv':ts_plot_data});
}

// { "dtype":"VS", "track": tType, "gid":gid };
function load_INSAR_ProcessVSFromCSV(ulist,params) {
   let url = ulist[0];
   let ttype = params['track'];
   let gid = params['gid'];
   let nx = parseInt(params['nx']);
   let ny = parseInt(params['ny']);
   let data = ckExist(url);

   let vs_plot_data = processCSV4VS(data,gid,ttype,nx,ny);
    
   plotly_plot_insar_vs({'type':ttype,'csv':vs_plot_data});
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


// plotly's have funny file name
function savePNG(fname,image) {
    let d=new Date();
    let timestamp = d.getTime();
    let a = document.createElement('a');
    a.href = image;
    a.download = fname+'_'+timestamp+'.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove()
}

