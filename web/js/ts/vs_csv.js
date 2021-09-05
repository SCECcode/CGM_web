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
function processCSV4VS(data) {
   let dlines=data.split("\n");
   let sz=dlines.length;
   let zvlist=[];

   let data_count=0;
   for(let i=0; i<sz; i++) {
     let line=dlines[i];

     if(line == "") { // there is an empty line at the very end
       continue;
     }
     //vals[0] vals[1] vals[2]
     data_count=data_count+1;
//-118.295000, 34.011000, -21.540298, 0.656191, -0.114709, 0.745825, D071
     let vals=line.split(",")
     let v=parseFloat(vals[2].trim());
     zvlist.push(v);
   }

   vs_plot_data.push({plot:[{xlabel:'x', ylabel:'y', z:zvlist}]});

   window.console.log("loading vs DONE...");
   return vs_plot_data;
}

