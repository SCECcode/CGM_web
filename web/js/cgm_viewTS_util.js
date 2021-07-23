/*** 
   cgm_viewTS_util.js
***/

// footer is about 58px
function setIframHeight(id) {
  let c_height = document.documentElement.clientHeight;
  let c_width= document.documentElement.clientWidth;
  let f_h=58;
  let height=c_height -(f_h*3);
  document.getElementById(id).height = height;
}

