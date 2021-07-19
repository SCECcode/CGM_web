/*** 
   cgm_viewTS_util.js
***/

// footer is about 58px
function setIframHeight(id) {
  let top = document.documentElement.clientHeight;
  var f_h=58;
  var height=top -(f_h*3);
  document.getElementById(id).height = height;
}
