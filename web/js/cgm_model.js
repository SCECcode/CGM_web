/****

  cgm_model.js

"For more model details and metrics, see [LINK TO ZENODO ARCHIVE]"
****/

var CGM_tb={
products: [
    {name: 'GNSS', 
     label: 'GNSS - label',
     contact: 'Mike Floyd',
     description: '<b>GNSS</b> product ....',
     frames : [
        { name: 'igb14',
          label: 'GNSS - IGB14 - label',
	  description: '<b>IGB14</b> frame info ...'},
        { name: 'nam14',
          label: 'GNSS - NAM14 - label',
	  description: '<b>NAM14</b> frame info ...'},
        { name: 'nam17',
          label: 'GNSS - NAM17 - label',
	  description: '<b>NAM17</b> frame info ...'},
        { name: 'pcf14',
          label: 'GNSS - PCF14 - label',
	  description: '<b>PCF14</b> frame info ...'}
     ]
    },
    {name: 'INSAR', 
     label: 'InSAR - label',
     contact: 'Ekaterina Tymofyeyeva',
     description: '<b>INSAR</b> product ... ',
     tracks : [
        { name: 'D071',
          file: 'D071_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_D071_velocity_list.csv',
          label: 'InSAR - D071 - label',
          description: '<b>D071</b> (Descending) ...'},
        { name: 'D073',
          file: 'D073_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_D073_velocity_list.csv',
          label: 'InSAR - D073 - label',
          description: '<b>D073</b> (Descending) ...'},
        { name: 'A064',
          file: 'A064_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_A064_velocity_list.csv',
          label: 'InSAR - A064 - label',
          description: '<b>A064</b> (Ascending) ...'},
        { name: 'A166',
          file: 'A166_COMB_CGM_InSAR_v0_0_1.hdf5',
          baseline: 'insar_baseline_A166_velocity_list.csv',
          label: 'InSAR - A166 - label',
          description: '<b>A166</b> (Ascending)...'}
      ]
    },
]};
