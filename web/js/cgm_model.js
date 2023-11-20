/****

  cgm_model.js

"For more model details and metrics, see [LINK TO ZENODO ARCHIVE]"
****/

var CGM_tb={
products: [
    {name: 'GNSS', 
     label: 'GNSS - label',
     contact: 'Mike Floyd',
     description: '<b>GNSS</b> product is in GAGE’s “pos” format',
     frames : [
        { name: 'igb14',
          label: 'IGB14',
	  description: "the International GNSS Service’s (IGS’s) second version of the International Terrestrial Reference Frame (ITRF) 2014 (Altamimi et al., 2016)"},
        { name: 'nam14',
          label: 'NAM14',
	  description: 'relative to North America, defined for ITRF2014 (Altamimi et al., 2017)'},
        { name: 'nam17',
          label: 'NAM17',
	  description: 'relative to North America, defined by Kreemer et al. (2018)'},
        { name: 'pcf14',
          label: 'PCF14',
	  description: 'relative to the Pacific, defined for ITRF2014 (Altamimi et al., 2017)'}
     ]
    },
    {name: 'INSAR', 
     label: 'InSAR - label',
     contact: 'Ekaterina Tymofyeyeva',
     description: '<b>INSAR</b> product is GMT-style “grd” (netCDF) file',
     tracks : [
        { name: 'D071',
          file: 'D071_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_D071_velocity_list.csv',
          label: 'D071_COMB_CGM_InSAR_v2_0_0',
          gnss: 'p617',
          description: 'Descending InSAR track D071 with GNSS reference station P617, Lat:35.32064, Lon: -116.57164'},
        { name: 'D173',
          file: 'D173_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_D173_velocity_list.csv',
          label: 'D173_COMB_CGM_InSAR_v2_0_0',
          gnss: 'p625',
          description: 'Descending InSAR track D173 with GNSS reference station P625, Lat:34.84444, Lon: -114.96514'},
        { name: 'A064',
          file: 'A064_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_A064_velocity_list.csv',
          label: 'A064_COMB_CGM_InSAR_v2_0_0',
          gnss: 'p617',
          description: 'Ascending InSAR track A064 with GNSS reference station P617, Lat:35.32064, Lon: -116.57164'},
        { name: 'A166',
          file: 'A166_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_A166_velocity_list.csv',
          label: 'A166_COMB_CGM_InSAR_v2_0_0',
          gnss: 'p625',
          description: 'Ascending InSAR track A166 with GNSS reference station P625, Lat:34.84444, Lon: -114.96514'}
      ]
    },
]};
