<?php

require_once("CFM.php");

$search = "";

$search = new CFM;

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
