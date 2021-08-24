<?php

require_once("CGM_INSAR.php");

$search = "";

$search = new CGM_INSAR;

$type = 
'location';
$criteria = [];

try {

	$result= $search->search($type, $criteria);
        $jresult=$result->outputJSON();
        print_r($jresult);exit;
//	print $search->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
	print "error";
}
