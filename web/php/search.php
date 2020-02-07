<?php

require_once("SpatialData.php");

$search = "";

$search = new CFM;

$type = $_REQUEST["t"];
$criteria = json_decode($_REQUEST["q"]);


try {
	print $search->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
	print "";
}
