<?php

require_once("SpatialData.php");

class CGM_INSAR extends SpatialData {

	function __construct()
	{
		$this->connection = pg_connect("host=db port=5432 dbname=CGM_INSAR52_db user=webonly password=scec");
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
			case "area":
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb,AREA_tb where AREA_tb.abb=$1 and AREA_tb.gid=OBJECT_tb.AREA_tb_gid";
				break;
			case "zone":
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb,ZONE_tb where ZONE_tb.abb=$1 and ZONE_tb.gid=OBJECT_tb.ZONE_tb_gid";
				break;
			case "section":
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb,SECTION_tb where SECTION_tb.abb=$1 and SECTION_tb.gid=OBJECT_tb.SECTION_tb_gid";
				break;
			case "fault":
				$query = "SELECT gid,name FROM OBJECT_tb WHERE name = $1";
				break;
			case "keyword":
				$query = "SELECT gid,name FROM OBJECT_tb WHERE to_tsvector(name) @@ plainto_tsquery($1)";
				break;
			case "name":
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb,FAULT_tb where FAULT_tb.abb=$1 and FAULT_tb.gid=OBJECT_tb.FAULT_tb_gid";
				break;
			case "strike":
				if (count($criteria) !== 2) {
					$error = true;
				}

				$criteria = array_map("floatVal", $criteria);

				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb WHERE strike IS NOT NULL AND strike > $1 AND strike < $2";
				break;
			case "dip":
				if (count($criteria) !== 2) {
					$error = true;
				}

				$criteria = array_map("floatVal", $criteria);

				$query = "SELECT gid,name FROM OBJECT_tb WHERE dip IS NOT NULL AND dip > $1 AND dip < $2";
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
			case "alltraces":
				include("util.php");
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name,alternative,source_Author,CGM_INSAR_version,model_description,descriptor,strike,dip,area,exposure,slip_sense,reference,reference_check,ID_comments,USGS_ID,blind,AREA_tb.name,ZONE_tb.name,SECTION_tb.name,FAULT_tb.name FROM OBJECT_tb, AREA_tb,ZONE_tb, SECTION_tb, FAULT_tb where AREA_tb_gid = AREA_tb.gid and ZONE_tb_gid = ZONE_tb.gid and SECTION_tb_gid = SECTION_tb.gid and FAULT_tb_gid = FAULT_tb.gid";

				$result = pg_query($this->connection, $query);
				$metaList = array();
				while($row = pg_fetch_row($result)) {
					array_push($metaList, makeObj($row));
				}
				$this->search_result = $metaList;
				return $this;
				break;
			case "allgeojson":
				$query = "select OBJECT_tb.gid, ST_AsGeoJSON(ST_TRANSFORM(TRACE_tb.geom,4326)) as geojsonstring  from OBJECT_tb,TRACE_tb where OBJECT_tb.trace_tb_gid=TRACE_tb.gid";
				$result = pg_query($this->connection, $query);

				$allGeoJSON = array();

				while($row = pg_fetch_object($result)) {
					$gid = $row->gid;
					array_push($allGeoJSON, $row);
				}

				$this->search_result = $allGeoJSON;

				return $this;
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

	public function loadMenuData($type) {
		$query = "";

		switch($type) {
			case "area":
				$query = "SELECT name,abb as value FROM AREA_tb";
				break;
			case "zone":
				$query = "SELECT name,abb as value FROM ZONE_tb";
				break;
			case "name":
				$query = "SELECT name,abb as value FROM FAULT_tb";
				break;
			case "section":
				$query = "SELECT name,abb as value FROM SECTION_tb";
				break;
		}

		if (empty($query)) {
			throw new BadFunctionCallException("Invalid criteria");
		}

		$result = pg_query($this->connection, $query);
		$optionsOutput = array();

		while($row = pg_fetch_object($result)) {
			array_push($optionsOutput, $row);
		}

		$this->search_result = $optionsOutput;
		return $this;
	}

	public function outputHTMLOptions()
	{
		$output = "";
		foreach($this->search_result as $object) {
			$output .= "<option value='{$object->value}'>{$object->name}</option>";
		}

		return $output;
	}

	public function outputDataInHTML($element_id) {


	}



	public function getStrikeRange()
	{
		$query = "SELECT MAX(strike) as maxstrike, min(strike) as minstrike FROM OBJECT_tb LIMIT 1 ";
		$result = pg_query($this->connection, $query);
		return pg_fetch_object($result);
	}

	public function getDipRange()
	{
		$query = "SELECT MAX(dip) as maxdip, min(dip) as mindip FROM OBJECT_tb LIMIT 1 ";
		$result = pg_query($this->connection, $query);

		return pg_fetch_object($result);
	}

	public function getObjectDetails($resolution)
	{
		switch($resolution) {
			case "native":
				$query = "SELECT OBJECT_native_tb.gid, OBJECT_native_tb.name, OBJECT_native_tb.url, OBJECT_tb.gid as objgid FROM OBJECT_tb, OBJECT_native_tb where OBJECT_tb.object_native_tb_gid=OBJECT_native_tb.gid ";
				break;
			case "500m":
				$query = "SELECT OBJECT_500m_tb.gid, OBJECT_500m_tb.name, OBJECT_500m_tb.url, OBJECT_tb.gid as objgid FROM OBJECT_tb, OBJECT_500m_tb where OBJECT_tb.object_500m_tb_gid=OBJECT_500m_tb.gid ";
				break;
			case "1000m":
				$query = "SELECT OBJECT_1000m_tb.gid, OBJECT_1000m_tb.name, OBJECT_1000m_tb.url, OBJECT_tb.gid as objgid FROM OBJECT_tb, OBJECT_1000m_tb where OBJECT_tb.object_1000m_tb_gid=OBJECT_1000m_tb.gid ";
				break;
			case "2000m":
				$query = "SELECT OBJECT_2000m_tb.gid, OBJECT_2000m_tb.name, OBJECT_2000m_tb.url, OBJECT_tb.gid as objgid FROM OBJECT_tb, OBJECT_2000m_tb where OBJECT_tb.object_2000m_tb_gid=OBJECT_2000m_tb.gid ";
				break;
		}

		if (empty($query)) {
			throw new BadFunctionCallException("Invalid criteria");
		}

		$result = pg_query($this->connection, $query);

		$objList=array();

		while($row = pg_fetch_object($result)) {
			array_push($objList, $row);
		}

		$this->search_result = $objList;

		return $this;

	}

	public function getGeoTraceList() {
		$query = "SELECT gid,name FROM OBJECT_tb where Trace_tb_gid is not null";
		$result = pg_query($this->connection, $query);
		$gidList=array();

		while($row = pg_fetch_row($result)) {
			array_push($gidList, $row[0]);
		}

		$query = "SELECT gid,name FROM OBJECT_tb where Trace_tb_gid is null";
		$result = pg_query($this->connection, $query);

		$nogidList=array();
		while($row = pg_fetch_row($result)) {
			array_push($nogidList, $row[0]);
		}

		$this->search_result = [];
		$this->search_result["gidlist"] = $gidList;
		$this->search_result["nogidlist"] = $nogidList;

		return $this;
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
