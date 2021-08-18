#!/usr/bin/env python3
# Perform a pixel extraction into GeoCSV with all the metadata! 

import cgm_library

# wherever the file is located locally
scec_filename = "./cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5"   

# a list of files, one for each track we have
scec_filename_list = [scec_filename];

# read into internal structure. Each track is a dictionary. 
python_data_dict_list = cgm_library.io_cgm_hdf5.read_cgm_hdf5_full_data(scec_filename); 

reference_pixel = [-116.57164, 35.32064];
los_angeles = [-118.2437, 34.0522];
distant_pixel = [-122.2437, 34.0522];
ocean_pixel = [-119, 33.5];
pixel_list = [reference_pixel, los_angeles, distant_pixel, ocean_pixel];
cgm_library.hdf5_to_geocsv.extract_csv_from_file(scec_filename, pixel_list, "../result");

# if we have multiple HDF5 files (one for each track):
cgm_library.hdf5_to_geocsv.extract_csv_wrapper(scec_filename_list, pixel_list, "../result");
