/***
   ts_util.js
***/
// tracking parsed pos data

var TS_pos_data=[];

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

//always the first one.
function loadAndProcessFromFile(ulist,tlist) {

  let sz=TS_pos_data.length;
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

   plotly_plot_pos(pos);
}

function changeTSview(params) {
  window.top.postMessage({'call':'fromTSviewer', value:'start loading'}, '*');
  plotly_plot_clear();

  // grab new params,
  [urls, ftypes]=getParams(params);
  window.console.log("changeTSview.."+urls[0]+" "+ftypes[0]);

  loadAndProcessFromFile(urls,ftypes);
}

// https://stackoverflow.com/questions/28295870/how-to-pass-parameters-through-iframe-from-parent-html
function getParams(param) {

  if(param == "") {
    // expecting  "urls=...&ftypes=...""
    param = window.location.search.substring(1);
  }
  window.console.log("param string is .."+param);
  if(param == "") {
    return [];
  }

  let myURL;
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
        case "ftypes":
             myFtype=JSON.parse(dd);
             break;
        default:
// do nothing
             break;
     }
  }
window.console.log("myURL "+ myURL);
window.console.log("myFtype "+ myFtype);

  return [myURL, myFtype];
}

