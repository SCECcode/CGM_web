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


function loadAndProcessFromFile(ulist,tlist) {
  let sz=ulist.length;
  let i;
  let pos=[];

  for(i=0;i<sz;i++) {
// assume there is just 1 for now
    let data = ckExist(ulist[i]);
    let plot_data=processPOS(data);
    pos.push( {'type':tlist[i], 'pos':plot_data});
  }
  plotly_plot_pos(pos);
  
/**??
    let promise = $.get(ulist[i]);
    processPOS(i,nlist[i],promise);
***/
}

// https://stackoverflow.com/questions/28295870/how-to-pass-parameters-through-iframe-from-parent-html
function getParams() {

  // expecting  "urls=...&ftypes=...""
  let tmp = window.location.search.substring(1);

  window.console.log("param string is .."+tmp);
  if(tmp == "") {
    return [];
  }

  let qArray = url.split('&'); //get key-value pairs
  for (var i = 0; i < qArray.length; i++)
  {
     let pArr = qArray[i].split('='); //split key and value
     switch (pArr[0]) {
        case "urls":
             myURL=pArr[1];
             break;
        case "ftypes":
             myFtypes=pArr[1];
             break;
        default:
// do nothing
             break;
     }
  }

  return [myURL, myFtypes];
}

