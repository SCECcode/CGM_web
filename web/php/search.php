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

//	$result= $search->search($type, $criteria);
//       $jresult=$result->outputJSON();
//        print_r($jresult);exit;
	print $search->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
	print "error";
}
