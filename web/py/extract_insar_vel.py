#!/usr/bin/env python3

### only 1 track at a time

import cgm_library
import io
import os
import json
import sys
from contextlib import redirect_stdout
import shutil

######################################
def getLoc(locs,idx) :
  i=idx
  if(len(locs) <= idx):
    i=len(locs)-1 
  return locs[i]
######################################
json_data = json.loads(sys.argv[1])

flist=json_data["filelist"]
track=json_data["track"]
gid=json_data["gid"]
plist=json_data["pixellist"]
rlocs=json_data["result"]


sw=plist['sw']
ne=plist['ne']
bounding_box=[sw[0],ne[0],sw[1],ne[1]]
latlon=[[sw[0],sw[1]],[ne[0],ne[1]]]
idx=0;
returnlist=[]
vlist=[]

for filename in flist: 
  tt=track[idx]
  rloc=getLoc(rlocs,idx)
  dirpath=rloc+"/"+gid+"_"+tt
  os.makedirs(dirpath, exist_ok=True)
  with redirect_stdout(io.StringIO()) as f:
    cgm_library.hdf5_to_geocsv.velocities_to_csv(filename, bounding_box, dirpath);
  s = f.getvalue()

  vel_file=dirpath+"/velocity_list.csv"
  fname=gid+"_"+tt+"_velocity_list.csv"
  n_vel_file=rloc+"/"+fname;
#  fname=gid+"_"+tt+"/velocity_list.csv"
#  fname="velocity_list.csv"
  if os.path.isfile(vel_file): 
     shutil.copyfile(vel_file, n_vel_file)
     vlist.append({"bb":latlon,"track":tt,"file":fname})
  idx=idx+1

if(len(vlist) != 0): 
  returnlist.append({"gid":gid,"vlist":vlist} )

print(str(returnlist))
