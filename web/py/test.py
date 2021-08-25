#!/usr/bin/env python3

import cgm_library
import sys
import json
import io
from contextlib import redirect_stdout

#print(sys.argv[1])

myarg=sys.argv[1].replace('"','$').replace("'",'"').replace("\\","").replace("$","")
#print(myarg)

mmy='{"filelist":["./cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5","./cgm_data/insar/USGS_D071_InSAR_v0_0_2.hdf5"],"result":["./result"],"pixellist":[{"label":"ref_p","lat":35.32064,"lon":-116.57164},{"label":"la_p","lat":34.0522,"lon":-118.2437}]}'
#print(mmy)

#mmyy="\"\\{\\'filelist\\':\\[\\'..\/cgm_data\/insar\/USGS_D071_InSAR_v0_0_1.hdf5\\',\\'..\/cgm_data\/insar\/USGS_D071_InSAR_v0_0_2.hdf5\\'\\],\\'result\\':\\[\\'..\/result\\'\\],\\'pixellist\\':\\[\\{\\'label\\':\\'ref_p\\',\\'lat\\':35.32064,\\'lon\\':-116.57164\\},\\{\\'label\\':\\'la_p\\',\\'lat\\':34.0522,\\'lon\\':-118.2437\\}\\]\\}\""
".\/py\/test.py \"\\{\\'filelist\\':\\[\\'.\/cgm_data\/insar\/USGS_D071_InSAR_v0_0_1.hdf5\\',\\'.\/cgm_data\/insar\/USGS_D071_InSAR_v0_0_2.hdf5\\'\\],\\'result\\':\\[\\'.\/result\\'\\],\\'pixellist\\':\\[\\{\\'label\\':\\'ref_p\\',\\'lat\\':35.32064,\\'lon\\':-116.57164\\},\\{\\'label\\':\\'la_p\\',\\'lat\\':34.0522,\\'lon\\':-118.2437\\}\\]\\}\""

#nnmyarg=mmyy.replace('"','$').replace("'",'"').replace("\\","").replace("$","")
#print(nnmyarg)

json_data = json.loads(myarg)

flist=json_data["filelist"]
rloc=json_data["result"]
plist=json_data["pixellist"]

result=rloc[0]
pixel_list= []
for term in plist :
  pixel_list.append( [ term['lon'], term['lat'] ] )

with redirect_stdout(io.StringIO()) as f:
    cgm_library.hdf5_to_geocsv.extract_csv_wrapper(flist, pixel_list, result);
s = f.getvalue()

##Reading file ../cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5 
##Reading track D071: 
##Writing ../result/pixel_-116.57164_35.32064_D071.csv 
##Writing ../result/pixel_-118.2437_34.0522_D071.csv 

tokens=s.split()
ttype=99 #file=0, track=1, csv=2 
ofile=None
otrack=None
ocsvlist=[]
returnlist=[]
for t in tokens :
#    print(t)
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
                  returnlist.append( {"fname":ofile,"track":otrack,"result":ocsvlist} );
                ocsvlist=[]
                ofile=t
           elif ttype == 1:
                otrack=t[:-1]
           elif ttype == 2:
                ocsvlist.append(t);
           else:
                print("BAD..."+ttype);
           ttype=99
## get the last one
if(len(ocsvlist) != 0): 
  returnlist.append( {"fname":ofile,"track":otrack,"result":ocsvlist} );

#print(str(returnlist))
