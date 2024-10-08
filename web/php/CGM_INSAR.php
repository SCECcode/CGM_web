<?php

require_once("SpatialData.php");

function make_pixel($lat, $lon)
{
    $pixel=new \stdClass();
    $pixel->lat = $lat;
    $pixel->lon = $lon;
    return $pixel;
}

function track_info($track)
{
    switch ($track)
    {
      case "A166":
        $loc="/app/web/cgm_data/insar/A166_COMB_CGM_InSAR_v2.0.0.hdf5";
        break;
      case "A064":
        $loc= "/app/web/cgm_data/insar/A064_COMB_CGM_InSAR_v2.0.0.hdf5";
        break;
      case "D173":
        $loc= "/app/web/cgm_data/insar/D173_COMB_CGM_InSAR_v2.0.0.hdf5";
        break;
      case "D071":
        $loc="/app/web/cgm_data/insar/D071_COMB_CGM_InSAR_v2.0.0.hdf5";
        break;
      default:
        print "eek\n";
     }
     return $loc;
}


class CGM_INSAR extends SpatialData {

    function __construct()
    {
        $this->connection = pg_connect("host=db port=5432 dbname=CGM_db user=webonly password=scec");
        if (!$this->connection) { die('Could not connect'); }
    }

    // criteria is an JSON array,
    // type ==> "location","latlon"
    // track ==> "DO74"...
    // { criteria=[lat1,lat,lon,lon] }
    public function search($type, $track, $criteria="") 
    {
        if (!is_array($criteria)) {
            $criteria = array($criteria);
        }
        $query = "";
        $error = false;
        $track_loc = track_info($track);

        switch ($type)
        {
            case "location":
                if (count($criteria) !== 2) {
                    $error = true;
                }
                $criteria = array_map("floatVal", $criteria);
                list($lat, $lon) = $criteria;

                $gid=uniqid("insar_");
                $arg = new \stdClass();
                $arg->gid = $gid;
                $arg->filelist = array();
                array_push($arg->filelist,$track_loc);
                $arg->result = array();
                  array_push($arg->result,"/app/web/result");
                $arg->pixellist = array();
                array_push($arg->pixellist,make_pixel($lat,$lon));

                $jarg=json_encode($arg,JSON_UNESCAPED_SLASHES);
                $command = "/app/web/py/extract_insar_ts.py '".$jarg."'";
     
                exec($command, $output, $retval);
                $this->php_result = $output;
                return $this;
                break;
            case "latlon":
                if (count($criteria) !== 4) {
                    $error = true;
                }

                $criteria = array_map("floatVal", $criteria);
                list($firstlat, $firstlon, $secondlat, $secondlon) = $criteria;

                $minlon = $firstlon;
                $maxlon = $secondlon;
                if($firstlon > $secondlon) {
                    $minlon = $secondlon;
                    $maxlon = $firstlon;
                }

                $minlat = $firstlat;
                $maxlat = $secondlat;
                if($firstlat > $secondlat) {
                    $minlat = $secondlat;
                    $maxlat = $firstlat;
                }

                $gid=uniqid("insar_");
                $arg = new \stdClass();
                $arg->gid = $gid;
                $arg->filelist = array();
                array_push($arg->filelist,$track_loc);
                $arg->result = array();
                  array_push($arg->result,"/app/web/result");
                $arg->track = array();
                array_push($arg->track,$track);
                $plist = new \stdClass();
                $plist->sw= array();
                array_push($plist->sw,$minlon);
                array_push($plist->sw,$minlat);
                $plist->ne= array();
                array_push($plist->ne,$maxlon);
                array_push($plist->ne,$maxlat);
                $arg->pixellist = $plist;


                $jarg=json_encode($arg,JSON_UNESCAPED_SLASHES);
                $command = "/app/web/py/extract_insar_vel.py '".$jarg."'";

                exec($command, $output, $retval);
                $this->php_result = $output;
                return $this;
                break;

        }
        $this->php_result = "BAD";
        return $this;
    }

    public function getVelocityRange()
    {
        $query = "SELECT MAX(velocity) as maxvelocity, min(velocity) as minvelocity FROM cgm_insar_velocities LIMIT 1 ";
        $result = pg_query($this->connection, $query);
        return pg_fetch_object($result);
    }

    public function getAllTrackData()
    {
        $query = "select file,track,color,bb1_lat,bb1_lon,bb2_lat,bb2_lon,bb3_lat,bb3_lon,bb4_lat,bb4_lon,ref_lat,ref_lon from cgm_insar_tracks";

        $result = pg_query($this->connection, $query);
        $bb_data = array();
        while($row = pg_fetch_object($result)) {
            $bb_data[] = $row;
        }
        $this->php_result = $bb_data;
        return $this;
    }
 
    // for debugging
        public function doTesting()
        {
        $output = null;
        $retval = null;
	$track="D071";
	$track_loc=track_info($track);

        $gid=uniqid("insar_");
        $arg = new \stdClass();
        $arg->gid = $gid;
        $arg->filelist = array();
	array_push($arg->filelist,$track_loc);
        $arg->result = array();
        array_push($arg->result,"/app/web/result");
        $arg->pixellist = array();
        array_push($arg->pixellist,make_pixel(35.32064,-116.57164));
        array_push($arg->pixellist,make_pixel(34.0522,-118.2437));

        $jarg=json_encode($arg,JSON_UNESCAPED_SLASHES);
        $command = "/app/web/py/extract_insar_ts.py '".$jarg."'";
     
        exec($command, $output, $retval);
        $this->php_result = $command;
        return $this;
        }

}
