<?php
require_once("SpatialData.php");

class CGM extends SpatialData
{

	// TODO: once we're in a separate database
//	function __construct()
//	{
//		$this->connection = pg_connect("host=db port=5432 dbname=CGM1_DB user=webonly password=scec");
//		if (!$this->connection) { die('Could not connect'); }
//	}

	public function search($type, $criteria)
	{
		// TODO: Implement search() method.
	}

	public function getAllStationData()
	{
		$query = "select station_id, ref_north_latitude, ref_east_longitude, ref_velocity_north, ref_velocity_east from cgm_station_velocities tablesample system(20) -- where station_id = 'P255'--  -- LIMIT 100";

		//where station_id = 'P213'
		$result = pg_query($this->connection, $query);

		$velocity_data = array();

		while($row = pg_fetch_object($result)) {
			$velocity_data[] = $row;
		}

			$this->search_result = $velocity_data;

			return $this;

	}
}