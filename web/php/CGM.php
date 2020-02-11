<?php
require_once("SpatialData.php");

class CGM extends SpatialData
{
	function __construct()
	{
		SpatialData::__construct();
		$this->connection = pg_connect("host=db port=5432 dbname=CFM52_db user=webonly password=scec");
		if (!$this->connection) { die('Could not connect'); }
	}

	public function search($type, $criteria)
	{
		// TODO: Implement search() method.
	}

	public function outputJSON()
	{
		// TODO: Implement outputJSON() method.
	}
}