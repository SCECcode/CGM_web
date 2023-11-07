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
          label: 'GNSS - IGB14 - label',
	  description: "<b>IGB14</b> is the International GNSS Service’s (IGS’s) second version of the International Terrestrial Reference Frame (ITRF) 2014 (Altamimi et al., 2016)"},
        { name: 'nam14',
          label: 'GNSS - NAM14 - label',
	  description: '<b>NAM14</b> is relative to North America, defined for ITRF2014 (Altamimi et al., 2017)'},
        { name: 'nam17',
          label: 'GNSS - NAM17 - label',
	  description: '<b>NAM17</b> is relative to North America, defined by Kreemer et al. (2018)'},
        { name: 'pcf14',
          label: 'GNSS - PCF14 - label',
	  description: '<b>PCF14</b> is relative to the Pacific, defined for ITRF2014 (Altamimi et al., 2017)'}
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
          label: 'D071_COMB_CGM_InSAR_v0_0_1',
          description: '<b>D071</b> (Descending) ...'},
        { name: 'D173',
          file: 'D173_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_D173_velocity_list.csv',
          label: 'D173_COMB_CGM_InSAR_v0_0_1',
          description: '<b>D173</b> (Descending) ...'},
        { name: 'A064',
          file: 'A064_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_A064_velocity_list.csv',
          label: 'A064_COMB_CGM_InSAR_v0_0_1',
          description: '<b>A064</b> (Ascending) ...'},
        { name: 'A166',
          file: 'A166_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_A166_velocity_list.csv',
          label: 'A166_COMB_CGM_InSAR_v0_0_1',
          description: '<b>A166</b> (Ascending)...'}
      ]
    },
]};
