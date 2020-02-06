<?php


abstract class SpatialData
{
	protected $connection;
	function __construct()
	{
		$this->connection = pg_connect("host=db port=5432 dbname=CFM52_db user=webonly password=scec");
		if (!$this->connection) { die('Could not connect'); }
	}

	abstract public function search($type, $criteria);

}

class CFM extends SpatialData {
	public function search($type, $criteria)
	{
		if (!is_array($criteria)) {
			$criteria = array($criteria);
		}

		$query = "";

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
				assert(count($criteria) === 2, "Invalid search criteria");
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM OBJECT_tb WHERE strike IS NOT NULL AND strike > $1 AND strike < $2";
				break;
			case "dip":
				assert(count($criteria) === 2, "Invalid search criteria");
				$query = "SELECT gid,name FROM OBJECT_tb WHERE dip IS NOT NULL AND dip > $1 AND dip < $2";
				break;
			case "latlon":
				assert(count($criteria) === 4, "Invalid search criteria");
				$query = "SELECT OBJECT_tb.gid,OBJECT_tb.name FROM TRACE_tb INNER JOIN OBJECT_tb ON TRACE_tb.gid = OBJECT_tb.trace_tb_gid where ST_INTERSECTS(ST_MakeEnvelope( $1, $2, $3, $4, 4326), TRACE_tb.geom)";
				break;


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

		return json_encode($query_result);
	}
}