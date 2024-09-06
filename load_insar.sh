#/bin/bash

mkdir -p insar
cd insar
wget https://files.scec.org/s3fs-public/projects/cgm/2.0.0/data/cgm-v2.0.0-insar.tar.gz
tar xvf cgm-v2.0.0-insar.tar.gz
cd ..
mv insar web/cgm_data
chmod og+rw web/result
