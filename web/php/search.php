<?php

require_once("SpatialData.php");

$search = "";

$search = new CFM;

$type = $_REQUEST["t"];
$criteria = json_decode($_REQUEST["q"]);


print $search->search($type, $criteria);

//echo $type;
//print_r(json_decode($criteria));
//exit;
