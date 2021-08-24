<?php

require_once("CGM_INSAR.php");

$insar = new CGM_INSAR();
$cwd=getcwd();

$type = 'location';
$criteria = array();
array_push($criteria, 35.0522);
array_push($criteria, -118.2437);

if (is_object($criteria[0])) {
	$criteria = (array)$criteria[0];
}
//print_r($criteria);exit;
//print($qq);exit;
print($cwd);exit;

try {
//      $r= $insar->doPreTesting()->outputJSON();
//      print $insar->hello();
//      print $insar->search($type, $criteria)->outputJSON();
} catch (BadFunctionCallException $e) {
	print "error";
}
