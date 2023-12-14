/****

  cgm_model_util.js

"For more model details and metrics, see [LINK TO ZENODO ARCHIVE]"
****/

function infoInSAR(){
// grab the current track name
    let track=CGM_INSAR.track_name;
// should be the 2nd one
    let insar=CGM_tb['products'][1];
    let tlist=insar['tracks'];
    let tbhtml="<div class=\"cgm-table\"><table>";
    tbhtml=tbhtml+"<thead><b>Availabel InSAR Tracks:</b></thead><tbody>";

    let sz=tlist.length;
    let term=null;
    for( let i=0; i< sz; i++) {
       term=tlist[i];
       let name=term['label'];
       let descript=term['description'];

       let t="<tr><td style=\"width:60vw;\"><b>"+name+":</b><br>"+descript+"</td></tr>";
       tbhtml=tbhtml+t;
    }
    tbhtml=tbhtml+"</tbody></table></div>";

    var html=document.getElementById('infoProductTable-container');
    html.innerHTML=tbhtml;

window.console.log("infoInSAR.. "+track);
}


function refGNSSInSAR(track){
// should be the 2nd one
    let insar=CGM_tb['products'][1];
    let tlist=insar['tracks'];

    let sz=tlist.length;
    let term=null;
    for( let i=0; i< sz; i++) {
       term=tlist[i];
       if(track == term.name ) {
         let gnss=term['gnss'];
         return gnss;
       }
    }
    return ("HUM... can not find this track.."+track);
}

function descriptInSAR(track){
// should be the 2nd one
    let insar=CGM_tb['products'][1];
    let tlist=insar['tracks'];

    let sz=tlist.length;
    let term=null;
    for( let i=0; i< sz; i++) {
       term=tlist[i];
       if(track == term.name ) {
         let descript=term['description'];
         return descript;
       }
    }
    return ("HUM... can not find this track.."+track);
}


// list all of them
function infoGNSS(){

    let gnss=CGM_tb['products'][0];
    let tlist=gnss['frames'];
    let sz=tlist.length;

    let tbhtml="<div class=\"cgm-table\"><table>";
    tbhtml=tbhtml+"<thead><b>Available GNSS Frames:</b></thead><tbody>";
    for( let i=0; i< sz; i++) {
        let term=tlist[i];
    
        let name=term['label'];
        let descript=term['description'];

        let t="<tr><td style=\"width:60vw;\"><b>"+name+":</b> "+descript+"</td></tr>";
        tbhtml=tbhtml+t;
    }
    tbhtml=tbhtml+"</tbody></table></div>";
    
    var html=document.getElementById('infoProductTable-container');
    html.innerHTML=tbhtml;

window.console.log("infoGNSS.. "+frame);
}
