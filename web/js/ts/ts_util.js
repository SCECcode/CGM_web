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


function loadAndProcessFromFile(ulist,nlist) {
  let sz=ulist.length;

// assume there is just 1 for now
  let data = ckExist(ulist[0]);
  let plot_data=processPOS(0,nlist[0],data);
  plotly_plot_pos(plot_data);
  
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

