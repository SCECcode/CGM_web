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
          label: 'InSAR - D071 - label',
          description: '<b>D071</b> track info ...'},
        { name: 'D073',
          label: 'InSAR - D073 - label',
          description: '<b>D073</b> track info ...'},
        { name: 'A064',
          label: 'InSAR - A064 - label',
          description: '<b>A064</b> track info ...'},
        { name: 'A166',
          label: 'InSAR - A166 - label',
          description: '<b>A166</b> track info ...'}
      ]
    },
]};
