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
  let i;

  for(i=0;i<sz;i++) {
    let data = ckExist(ulist[i]);
    processPOS(i,nlist[i],data);
  }
  
/*** ???
  for(i=0;i<sz;i++) {
    let promise = $.get(ulist[i]);
    processPOS(i,nlist[i],promise);
  }
***/
}

// https://stackoverflow.com/questions/28295870/how-to-pass-parameters-through-iframe-from-parent-html
function getCallingParam(pname) {

  var url = window.location.search.substring(1);
  window.console.log("param url is .."+url);
  if(url == "") {
    return [];
  }
  var qArray = url.split('&'); //get key-value pairs
  for (var i = 0; i < qArray.length; i++)
  {
     var pArr = qArray[i].split('='); //split key and value
     if (pArr[0] == pname) {
         var r=decodeURI(pArr[1]);
         return [r, url];
     }
  }
  return [];
}

