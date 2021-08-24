<?php

require_once("SpatialData.php");

class CGM_INSAR extends SpatialData {

	function __construct()
	{
		$this->connection = pg_connect("host=db port=5432 dbname=CGM1_db user=webonly password=scec");
		if (!$this->connection) { die('Could not connect'); }
	}

	public function search($type, $criteria="") 
	{
		if (!is_array($criteria)) {
			$criteria = array($criteria);
		}

		$query = "";
		$error = false;

		switch ($type)
		{
			case "location":
				if (count($criteria) !== 2) {
					$error = true;
				}
				$criteria = array_map("floatVal", $criteria);
				list($lat, $lon) = $criteria;

                                $command = escapeshellcmd("./py/test.py \"
                                {'filelist':['./cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5'],
                                 'result':['./result'],
                                 'pixellist':[ {'label':'ref_p','lat':35.32064,'lon':-116.57164 }]}\"");

                                exec($command, $output, $retval);
                                $this->php_result = $command;
                                return $this;
				break;
			case "velocity":
				if (count($criteria) !== 2) {
					$error = true;
				}
				$criteria = array_map("floatVal", $criteria);
				list($minv, $maxv) = $criteria;
				$query = "SELECT lat, lon, velocity FROM cgm_insar_velocities WHERE velocity IS NOT NULL AND velocity > $minv AND velocity < $maxv";
				break;
			case "latlon":
				if (count($criteria) !== 4) {
					$error = true;
				}

				$criteria = array_map("floatVal", $criteria);
				list($firstlat, $firstlon, $secondlat, $secondlon) = $criteria;

				if($secondlat == "0") {
					$secondlat = $firstlat+0.001;
					$firstlat = $firstlat-0.001;
				}
				if($secondlon == "0") {
					$secondlon = $firstlon+0.001;
					$firstlon = $firstlon-0.001;
				}

				$minlon = $firstlon;
				$maxlon = $secondlon;
				if($firstlon > $secondlon) {
					$minlon = $secondlon;
					$maxlon = $firstlon;
				}

				$minlat = $firstlat;
				$maxlat = $secondlat;
				if($firstlat > $secondlat) {
					$minlat = $secondlat;
					$maxlat = $firstlat;
				}

				$criteria = array($minlon, $minlat, $maxlon, $maxlat);

				$query = "SELECT lat,lon,velocity FROM cgm_insar_velocities where ST_INTERSECTS(ST_MakeEnvelope( $1, $2, $3, $4, 4326), geom)";
				break;

		}

		if ($error) {
			throw new BadFunctionCallException("Invalid criteria");
		}

		pg_prepare($this->connection, "search_query", $query);
		$result = pg_execute($this->connection, "search_query", $criteria);

		$query_result = array();
		while($row = pg_fetch_row($result)) {
			$item = new \stdClass();
			$item->lat=$row[0];
			$item->lon=$row[1];
			$item->velocity=$row[1];
			array_push($query_result, $item);
		}

		$this->php_result = $query_result;
		return $this;
	}

	public function getVelocityRange()
	{
		$query = "SELECT MAX(velocity) as maxvelocity, min(velocity) as minvelocity FROM cgm_insar_velocities LIMIT 1 ";
		$result = pg_query($this->connection, $query);
		return pg_fetch_object($result);
	}

        public function hello() {
          $this->php_result = 'hello from php';
          return $this;
        }

        // InSAR
        public function doPreTesting()
        {
        $output = null;
        $retval = null;
        $command = escapeshellcmd("./py/test.py \"
          {'filelist':['./cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5',
                       './cgm_data/insar/USGS_D071_InSAR_v0_0_2.hdf5'],
           'result':['./result'],
           'pixellist':[
                       {'label':'ref_p','lat':35.32064,'lon':-116.57164 },
                       {'label':'la_p', 'lat':34.0522, 'lon':-118.2437}
                       ]}\"");
        //$command = escapeshellcmd("./py/test.py \"hostname\"");
        //$command = escapeshellcmd("./py/test.py \"{'filelist':['myhost','shost']}\"");

        exec($command, $output, $retval);
        $this->php_result = $retval;
        return $this;
        }


}
