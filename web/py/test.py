#!/usr/bin/env python3

import cgm_library
import sys
import json

myarg=sys.argv[1].replace("'",'"').replace("\\","")
json_data = json.loads(myarg)
#print(str(json_data));

flist=json_data["filelist"]
rloc=json_data["result"]
plist=json_data["pixellist"]

filename=flist[0]
result=rloc[0]
pixel_list= []
for term in plist :
  pixel_list.append( [ term['lon'], term['lat'] ] )

#cgm_library.hdf5_to_geocsv.extract_csv_from_file(filename, pixel_list, result);
cgm_library.hdf5_to_geocsv.extract_csv_wrapper(flist, pixel_list, result);

