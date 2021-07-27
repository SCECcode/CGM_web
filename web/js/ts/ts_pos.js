
/*** 
   ts_pos.js
***/
//
// parsing pos file content and extract information for plotting
//
/******************* header format..
PBO Station Position Time Series. Reference Frame : IGb14
Format Version: 1.1.0
4-character ID: ANA1
Station name  : ANA1_SCGN_CS2002
First Epoch   : 20020511 120000
Last Epoch    : 20210710 120000
Release Date  :    00000 000000
XYZ Reference position :  -2595092.39425 -4612420.32313  3547838.93065 (IGb14)
NEU Reference position :    34.0150060755  240.6365287070   22.42738 (IGb14/WGS84)
Start Field Description
YYYYMMDD      Year, month, day for the given position epoch
HHMMSS        Hour, minute, second for the given position epoch
JJJJJ.JJJJJ   Modified Julian day for the given position epoch
X             X coordinate, Specified Reference Frame, meters
Y             Y coordinate, Specified Reference Frame, meters
Z             Z coordinate, Specified Reference Frame, meters
Sx            Standard deviation of the X position, meters
Sy            Standard deviation of the Y position, meters
Sz            Standard deviation of the Z position, meters
Rxy           Correlation of the X and Y position
Rxz           Correlation of the X and Z position
Ryz           Correlation of the Y and Z position
Nlat          North latitude, WGS-84 ellipsoid, decimal degrees
Elong         East longitude, WGS-84 ellipsoid, decimal degrees
Height (Up)   Height relative to WGS-84 ellipsoid, m
dN            Difference in North component from NEU reference position, meters
dE            Difference in East component from NEU reference position, meters
du            Difference in vertical component from NEU reference position, meters
Sn            Standard deviation of dN, meters
Se            Standard deviation of dE, meters
Su            Standard deviation of dU, meters
Rne           Correlation of dN and dE
Rnu           Correlation of dN and dU
Reu           Correlation of dEand dU
Soln          "rapid", "final", "suppl/suppf", "campd", or "repro" corresponding to products  generated with rapid or final orbit products, in supplemental processing, campaign data processing or reprocessing
End Field Description
*YYYYMMDD HHMMSS JJJJJ.JJJJ         X             Y             Z            Sx        Sy       Sz     Rxy   Rxz
Ryz            NLat         Elong         Height         dN        dE        dU         Sn
Se       Su Rne    Rnu    Reu  Soln
 20020511 120000 52405.5000 -2595092.10525 -4612420.61883  3547838.75005  0.00352  0.00548  0.00460  0.809 -0.709 
-0.782      34.0150041410  240.6365330035   22.42250    -0.21535   0.39644  -0.00488    0.00238 
 0.00182  0.00738  0.007  0.014 -0.047 avg04
*******************/

// each frame has 3 plots, one for North, East, and Up
// {id:idx, station: [ { cgm_id:'ANA1',
//                       cgm_name:'ANA1_SCGN_CS2002',
//                       cgm_frame:'IGb14'}],
//          plot:[{xlabel:'time',
//                ylabel:'East(mm)',
//                topRight:'WRMS=222.70mm;NRMS=141.08',
//                topLeft:'Reference longitude:240.6365287078?E',
//                verticalReference: [ {x:2009,label:'GU',pos:0,color:'orange'},
//                                     {x:2009.2,label:'2PS->',pos:1,color:'red'},
//                                     {x:2015,label:'2PS->',pos:1,color:'red'},
//                                     {x:2019,label:'49',pos:0,color:'orange'} ]
//                x:[...],
//                y:[...],
//                yError:[],
//                color:'blue',
//                xrange:[-300,400],
//                yrange:[2000,2022]}, ...] }
var pos_plot_data = [];

//'2013-10-04 22:23:00'
function toTime(dstr,tstr) {
   let d=dstr.split("");
   d.splice(6,0,"-");
   d.splice(4,0,"-");
   let t=tstr.split("");
   t.splice(4,0,":");
   t.splice(2,0,":");
   let str=d.join("")+" "+t.join("");
   return str;
}

function processPOS(data) {
   var data_start=0;
   let dlines=data.split("\n");
   let sz=dlines.length;
   let i;
   let cgm_id;
   let cgm_name;
   let cgm_frame;
   let xrange_start,xrange_end;
   let yrange_start,yrange_end;
   let ref_lat, ref_lng, ref_up;
   let Xtime=[];
   let Yeast=[];
   let Ynorth=[];
   let Yup=[];
   let Yeast_e=[];
   let Ynorth_e=[];
   let Yup_e=[];
   let start_epoch;
   let end_epoch;

/*
wrms = sqrt[sum(dN^2/Sn^2)/sum(1/Sn^2)] where num is the number of records.
nrms = sqrt[sum(dN^2/Sn^2)/(n-p)], where n is the number of data (time series) points 
and p is the number of parameters estimated (zero in the case of plotting 
raw time series, as we are here)
*/

   let wrms_top_north=0;
   let wrms_bottom_north=0;
   let wrms_top_east=0;
   let wrms_bottom_east=0;
   let wrms_top_up=0;
   let wrms_bottom_up=0;
   let data_count=0;

   for(i=0; i<sz; i++) {
     let line=dlines[i];

     if(line == "") { // there is an empty line at the very end
       continue;
     }
     if(data_start) {
         data_count=data_count+1;
         let vals=(line.trim().replace(/ +/g," ")).split(" ");
         let xtime= toTime(vals[0],vals[1]); 

         let ynorth=parseFloat(vals[15])*1000;
         let ynorth_e=parseFloat(vals[18])*1000;
         wrms_top_north=wrms_top_north+( (ynorth * ynorth)/(ynorth_e * ynorth_e));
         wrms_bottom_north= wrms_bottom_north + (1/(ynorth_e * ynorth_e));

         let yeast=parseFloat(vals[16])*1000;
         let yeast_e=parseFloat(vals[19])*1000;
         wrms_top_east=wrms_top_east+( (yeast * yeast)/(yeast_e * yeast_e));
         wrms_bottom_east= wrms_bottom_east + (1/(yeast_e * yeast_e));

         let yup=parseFloat(vals[17])*1000;
         let yup_e=parseFloat(vals[20])*1000;
         wrms_top_up=wrms_top_up+( (yup * yup)/(yup_e * yup_e));
         wrms_bottom_up= wrms_bottom_up + (1/(yup_e * yup_e));

         Xtime.push(xtime);
         Yeast.push(yeast);
         Ynorth.push(ynorth);
         Yup.push(yup);
         Yeast_e.push(yeast_e);
         Ynorth_e.push(ynorth_e);
         Yup_e.push(yup_e);
         continue;
     }

     let pair=line.split(":"); 
     let terms=pair[0].split(" ");

     if(terms[0]=="*YYYYMMDD") {
         data_start=1;
         continue;
     }
     if(terms[0]=="PBO") {
         cgm_frame=pair[1].trim();
         continue;
     }
     if(terms[0]=="4-character") {
         cgm_id=pair[1].trim();
         continue;
     }
     if(terms[0]=="Station" && terms[1]=="name") {
         cgm_name=pair[1].trim();
         continue;
     }
     if(terms[0]=="First" && terms[1]=="Epoch") {
         let tmp=pair[1].trim().split(" ");
         start_epoch=tmp[0];
         xrange_start=toTime(tmp[0],tmp[1]);
         continue;
     }
     if(terms[0]=="Last" && terms[1]=="Epoch") {
         let tmp=pair[1].trim().split(" ");
         end_epoch=tmp[0];
         xrange_end=toTime(tmp[0],tmp[1]);
         continue;
     }
     if(terms[0]=="NEU" && terms[1]=="Reference") {
         let tmp=(pair[1].trim().replace(/ +/g," ")).split(" ");
         ref_lat=parseFloat(tmp[0]);
         ref_lng=parseFloat(tmp[1]);
         ref_up=parseFloat(tmp[2]);
         continue;
     }

   }
   let wrms_north = Math.floor((Math.sqrt(wrms_top_north / wrms_bottom_north)*1000))/1000;
   let wrms_east = Math.floor((Math.sqrt(wrms_top_east / wrms_bottom_east)*1000))/1000;
   let wrms_up = Math.floor((Math.sqrt(wrms_top_up / wrms_bottom_up)*1000))/1000;
   let nrms_north = Math.floor((Math.sqrt(wrms_top_north /data_count)*1000))/1000;
   let nrms_east = Math.floor((Math.sqrt(wrms_top_east /data_count)*1000))/1000;
   let nrms_up = Math.floor((Math.sqrt(wrms_top_up /data_count)*1000))/1000;

   pos_plot_data.push({
            station: { cgm_id:cgm_id,
                       cgm_name:cgm_name,
                       cgm_frame:cgm_frame},
            plot:[
                  {xlabel:'time',
                   ylabel:'North(mm)',
                   topRight:'WRMS='+wrms_north+'mm;NRMS='+nrms_north,
                   topLeft:'Reference latitude:'+ref_lat+'N',
                   verticalReference: [],
                   x:Xtime,
                   y:Ynorth,
                   yError:Ynorth_e,
                   color:'blue',
                   /* 'yrange':[-300,400], */
                   xrange:[xrange_start,xrange_end]},
                  {xlabel:'time',
                   ylabel:'East(mm)',
                   topRight:'WRMS='+wrms_east+'mm;NRMS='+nrms_east,
                   topLeft:'Reference longitude:'+ref_lng+'E',
                   verticalReference: [],
                   x:Xtime,
                   y:Yeast,
                   yError:Yeast_e,
                   color:'blue',
                   /* 'yrange':[-300,400], */
                   xrange:[xrange_start,xrange_end]},
                  {xlabel:'time',
                   ylabel:'Up(mm)',
                   topRight:'WRMS='+wrms_up+'mm;NRMS='+nrms_up,
                   topLeft:'Reference ellipsoid height:'+ref_up+'m',
                   verticalReference: [],
                   x:Xtime,
                   y:Yup,
                   yError:Yup_e,
                   color:'blue',
                   /* 'yrange':[-300,400], */
                   xrange:[xrange_start,xrange_end]}]},
                  );

   window.console.log("DONE...");

   return pos_plot_data;
}

