#!/usr/bin/env python3

### only 1 track at a time
import cgm_library
import sys
import json
import io
from contextlib import redirect_stdout
import pdb

######################################
##Writing ../result/pixel_-118.2437_34.0522_D071.csv 
def parse_latlon(file):
    fname=file.split("/")[-1]
    item=fname.split("_")
    lon=float(item[1])
    lat=float(item[2])
    track=item[3].split(".")[0]
    return [lat, lon, fname, track]

######################################

json_data = json.loads(sys.argv[1])

flist=json_data["filelist"]
rloc=json_data["result"]
plist=json_data["pixellist"]
gid=json_data["gid"]

result=rloc[0]
pixel_list= []
for term in plist :
  pixel_list.append( [ term['lon'], term['lat'] ] )

with redirect_stdout(io.StringIO()) as f:
    rout=cgm_library.hdf5_to_geocsv.extract_csv_wrapper(flist, pixel_list, result);
s = f.getvalue()


##Reading file ../cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5 
##Reading track D071: 
##Writing ../result/pixel_-116.57164_35.32064_D071.csv 
##Writing ../result/pixel_-118.2437_34.0522_D071.csv 

tokens=s.split()
ttype=99 #file=0, track=1, csv=2 
ofile=None
otrack=None
nlat=None
nlon=None
ocsvlist=[]
returnlist=[]
ogid=gid
idx=0

for t in tokens :
##    print(t)
    if t == 'Reading':
           ttype=99 
    elif t == 'file':
           ttype=0 
    elif t == 'track':
           ttype=1
    elif t == 'Writing':
           ttype=2
    else :
#           print("What to do..."+t);
           if ttype == 0:
                if(len(ocsvlist) != 0): 
                  returnlist.append( {"gid":ogid,"tslist":ocsvlist} )
                gidlist=[]
                ocsvlist=[]
                ofile=t
           elif ttype == 1:
                otrack=t[:-1]
                ogid=gid+"_"+otrack
           elif ttype == 2:
                [nlat, nlon, nfile, ntrack]=parse_latlon(t)
                nvel=rout[idx][2]
                ocsvlist.append({"lat":nlat,"lon":nlon,"velocity":nvel,"track":ntrack,"file":nfile})
                idx=idx+1
           else:
                print("BAD...",ttype);
           ttype=99
## get the last one
if(len(ocsvlist) != 0): 
  returnlist.append({"gid":ogid,"tslist":ocsvlist} );

print(str(returnlist))
