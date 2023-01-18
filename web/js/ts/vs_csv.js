/*** 
   vs_pos.js

For INSAR velocity file
***/
//
// parsing csv file content and extract information for plotting
//
//-118.295000, 34.011000, -21.540298, 0.656191, -0.114709, 0.745825, D071
//-118.293000, 34.011000, -21.557138, 0.656059, -0.114694, 0.745944, D071
//
function _getV(line) {
   let vals=line.split(",")
   let v=parseFloat(vals[2].trim());
   return v;
}

function processCSV4VS(data,gid,track,nx,ny) {
   let dlines=data.split("\n");
   let sz=dlines.length;
   let zvlist=[];
   let vs_plot_data=[];
   let cgm_title=gid+"("+track+")";

   let idx=0;
   let data_count=0;
   for(let yy=0;yy<ny;yy++) {
     let row=[];
     for(let xx=0; xx<nx; xx++) {
        idx=xx+(yy * nx); 
        row.push(_getV(dlines[idx])); 
     }
     zvlist.push(row);
   }     

   let yratio=ny/nx;

   vs_plot_data.push(
           {
            info: { cgm_title:cgm_title,
                    cgm_name:gid,
                    cgm_frame:track },
            plot:[{xlabel:'x', ylabel:'y', z:zvlist, aspect:yratio}]
           });

   window.console.log("loading vs DONE...");
   return vs_plot_data;
}

