/*** 
   ts_pos.js

For INSAR
***/
//
// parsing csv file content and extract information for plotting
//
/******************* header format..
# dataset: GeoCSV 2.0
# field_unit: ISO 8601 datetime UTC, mm, mm
# field_type: string, float, float
# attribution: [future] 
# Request_URI: [future] 
# Source file: USGS_D071_InSAR_v0_0_1.hdf5 
# SAR mission: Sentinel-1 
# SAR track: D071
# LLH Reference Coordinate: Lon: -116.571640; Lat: 35.320640; Hgt: [future]
# Geometry Reference Date: 20190411 
# TS Reference Date: 
# Displacement Sign: positive towards satellite; negative away from satellite 
# Line-Of-Sight vector: E: 0.646579; N: -0.113908; U: 0.754294
# LLH Pixel: Lon: -118.152466; Lat: 34.011689; Hgt: 19.595402
# Pixel Height: ellipsoid 
# Version: 0.0.1 
# DOI: [future] 
Datetime, LOS, Std Dev LOS
2015-05-14T13:51:56Z, 0.000000, 0.000000
2015-06-07T13:51:58Z, -1.525490, 0.000000
2015-07-01T13:51:59Z, -3.069258, 0.000000
*******************/
// has 1 plot
// {id:idx, track: [ { cgm_id:'SOMETHING',
//                       cgm_name:'D071' }],
//          plot:[{xlabel:'time',
//                ylabel:'East(mm)',
//                x:[...],
//                y:[...],
//                yError:[],
//                color:'blue',
//                xrange:[-300,400],
//                yrange:[2000,2022]}, ...] }

function processCSV(data) {
   var csv_plot_data = [];
   var data_start=0;
   let dlines=data.split("\n");
   let sz=dlines.length;
   let i;
   let cgm_id='SOMETHING';
   let cgm_name;
   let xrange_start,xrange_end;
   let yrange_start,yrange_end;
   let Xtime=[];
   let Ynorth=[];
   let Ynorth_e=[];
   let start_epoch;
   let end_epoch;

   let data_count=0;

   for(i=0; i<sz; i++) {
     let line=dlines[i];

     if(line == "") { // there is an empty line at the very end
       continue;
     }
     //vals[0] vals[1] vals[2]
     if(data_start) {
         data_count=data_count+1;
         let vals=(line.trim().replace(/ +/g," ")).split(" ");
         let xtime=vals[0];
         let ynorth=parseFloat(vals[1]);
         let ynorth_e=parseFloat(vals[2]);

         Xtime.push(xtime);
         Ynorth.push(ynorth);
         Ynorth_e.push(ynorth_e);
         continue;
     }
   }

   csv_plot_data.push({
            station: { cgm_id:cgm_id,
                       cgm_name:cgm_name,
                       cgm_frame:cgm_frame},
            plot:[
                  {xlabel:'time',
                   ylabel:'North(mm)',
                   verticalReference: [],
                   x:Xtime,
                   y:Ynorth,
                   yError:Ynorth_e,
                   color:'blue',
// 'yrange':[-300,400],
//xrange:[xrange_start,xrange_end],
                  }});

   window.console.log("loading csv DONE...");
   return csv_plot_data;
}

