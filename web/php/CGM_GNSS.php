<?php
require_once("SpatialData.php");

class CGM_GNSS extends SpatialData
{

	// TODO: once we're in a separate database
	function __construct()
	{
		$this->connection = pg_connect("host=db port=5432 dbname=CGM_db user=webonly password=scec");
		if (!$this->connection) { die('Could not connect'); }
	}

	public function search($type, $extra, $criteria)
	{
		// TODO: Implement search() method.
	}

	public function getAllSiteData() {
                $query = "select ulabel,type from cgm_gnss_sites";
                $result = pg_query($this->connection, $query);
                $site_data = array();
                while($row = pg_fetch_object($result)) {
                        $site_data[] = $row;
                }
                $this->php_result = $site_data;
                return $this;
        }

	public function getAllStationData()
	{
//		$query = "select gid, station_id, ref_north_latitude, ref_east_longitude, ref_velocity_north, ref_velocity_east, ref_velocity_up, station_type from cgm_gnss_station_velocities -- tablesample system(30) -- where station_id = 'P255'--  -- LIMIT 100";
		$query = "select gid, Dot, Ref_Nlat, Ref_Elong, dNOdt, dEOdt, dUOdt, SNd, SEd,stationType, ulabel from cgm_gnss_station_velocities";


		$result = pg_query($this->connection, $query);

		$velocity_data = array();

		while($row = pg_fetch_object($result)) {
			$velocity_data[] = $row;
		}

			$this->php_result = $velocity_data;

			return $this;

	}
}
