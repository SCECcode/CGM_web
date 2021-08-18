<?php

require_once("SpatialData.php");

class CGM_INSAR extends SpatialData {

	function __construct()
	{
		$this->connection = pg_connect("host=db port=5432 dbname=CGM1_db user=webonly password=scec");
		if (!$this->connection) { die('Could not connect'); }
	}

	public function search($type, $criteria="") : CGM_INSAR
	{
		if (!is_array($criteria)) {
			$criteria = array($criteria);
		}

		$query = "";
		$error = false;

		switch ($type)
		{
			case "station":
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb,FAULT_tb where FAULT_tb.abb=$1 and FAULT_tb.gid=OBJECT_tb.FAULT_tb_gid";
				break;
			case "velocity":
				if (count($criteria) !== 2) {
					$error = true;
				}

				$criteria = array_map("floatVal", $criteria);

				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb WHERE strike IS NOT NULL AND strike > $1 AND strike < $2";
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

				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM TRACE_tb INNER JOIN OBJECT_tb ON TRACE_tb.gid = OBJECT_tb.trace_tb_gid where ST_INTERSECTS(ST_MakeEnvelope( $1, $2, $3, $4, 4326), TRACE_tb.geom)";
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
			$item->gid=$row[0];
			$item->name=$row[1];
			array_push($query_result, $item);
		}

		$this->search_result = $query_result;
		return $this;
	}

	public function getVelocityRange()
	{
		$query = "SELECT MAX(strike) as maxstrike, min(strike) as minstrike FROM OBJECT_tb LIMIT 1 ";
		$result = pg_query($this->connection, $query);
		return pg_fetch_object($result);
	}

        // InSAR
        public function doTesting()
        {
        $output = null;
        $retval = null;
        $command = escapeshellcmd("./py/test.py \"
          {'filelist':['./cgm_data/insar/USGS_D071_InSAR_v0_0_1.hdf5'],
           'result':['./result'],
           'pixellist':[
//                       {'label':'ANA1','lat':34.02,'lon':-119.36 },
                       {'label':'ref_p','lat':35.32064,'lon':-116.57164 },
                       {'label':'la_p', 'lat':34.0522, 'lon':-118.2437}
                       ]}\"");
        //$command = escapeshellcmd("./py/test.py \"hostname\"");
        //$command = escapeshellcmd("./py/test.py \"{'filelist':['myhost','shost']}\"");

        exec($command, $output, $retval);
        $this->php_result = $output;
        return $this;
        }


}
