<?php

require_once("CGM_INSAR.php");

$search = "";

$search = new CGM_INSAR;

$type = $_REQUEST["t"];
$criteria = json_decode($_REQUEST["q"]);

//if (is_object($criteria[0])) {
//	$criteria = (array)$criteria[0];
//}
//print_r($criteria);exit;
try {
	print $search->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
	print "error";
}
