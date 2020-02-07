$searchResult = $("#searchResult");

function searchWithStrikeRange() {
  //grab the min and max from the slider..
  vals = $( "#slider-strike-range" ).slider("option", "values");
    CFM_search("strike", vals);
}

function searchWithDipRange() {
  //grab the min and max from the slider..
  vals = $( "#slider-dip-range" ).slider("option", "values");
    CFM_search('dip',vals);
}

function searchByFaultObjectName() {
    str=document.getElementById("faultNameTxt").value;
    CFM_search('fault',str);

}
function searchByKeyword() {
    let str=document.getElementById("keywordTxt").value;
    CFM_search('keyword',str);
}

// takes 2 or 4 entries
function searchByLatlon() {
    var firstlatstr=document.getElementById("firstLatTxt").value;
    var firstlonstr=document.getElementById("firstLonTxt").value;
    var secondlatstr=document.getElementById("secondLatTxt").value;
    var secondlonstr=document.getElementById("secondLonTxt").value;
    if(secondlatstr == "optional")
        secondlatstr="0";
    if(secondlonstr == "optional")
        secondlonstr="0";

    let criteria = [firstlatstr, firstlonstr, secondlatstr, secondlonstr ];

// if in hand input mode, need to add the marker+retangle..
    chk_and_add_bounding_rectangle();
    
    if (firstlatstr == "" || firstlonstr=="") {
        $searchResult.html("");
        return;
    } else {
        CFM_search("latlon", criteria);
    }
}

function searchByZone(str) {
    CFM_search('zone',str);
}

function CFM_search(type, criteria) {
    if (!type || !criteria) {
        $searchResult.html("");
    }
    if (!Array.isArray(criteria)) {
        criteria = [criteria];
    }

    let JSON_criteria = JSON.stringify(criteria);

    $.ajax({
            url: "php/search.php",
            data: {t: type, q: JSON_criteria},
        }
    ).done(function(data) {
            toggle_off_all_layer();
            cfm_active_gid_list=[];

            let tmp = JSON.parse(data);
            var sz=(Object.keys(tmp).length);
            for( var i=0; i< sz; i++) {
                var gid = parseInt(tmp[i]['gid']);
                cfm_active_gid_list.push(gid);
                if (!in_nogeo_gid_list(gid)) {
                    toggle_layer(gid);
                }
            }

            document.getElementById("phpResponseTxt").innerHTML = data;
            document.getElementById("searchResult").innerHTML = makeResultTable(data);
        }
    );
}

function searchBySection(str) {
    CFM_search('section',str);
}

function searchByArea(str) {
    CFM_search('area',str);
}

function searchByName(str) {
    CFM_search('name',str);
}


// returning 2 lists, one is gid list where each gid has a geo/shapefile
//                    one is nogid list where no gid has a geo/shapefile
function getGeoTraceList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            processGeoList();
        }
    };
    xmlhttp.open("GET","php/getGeoTraceList.php",true);
    xmlhttp.send();
}


function getAllTraces() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            var str=processTraceMeta("metaByAllTraces");
            document.getElementById("searchResult").innerHTML = makeResultTable(str);
            $.event.trigger({
                type: "tableLoadCompleted",
                "message": "completed",
            })
        }
    };
    xmlhttp.open("GET","php/getAllTraces.php",true);
    xmlhttp.send();
}

function getZoneList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            document.getElementById("zoneList").innerHTML = makeZoneList();
        }
    };
    xmlhttp.open("GET","php/getZoneList.php",true);
    xmlhttp.send();
}

function getSectionList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            document.getElementById("sectionList").innerHTML = makeSectionList();
        }
    };
    xmlhttp.open("GET","php/getSectionList.php",true);
    xmlhttp.send();
}

function getNameList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            document.getElementById("nameList").innerHTML = makeNameList();
        }
    };
    xmlhttp.open("GET","php/getNameList.php",true);
    xmlhttp.send();
}


function getAreaList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            document.getElementById("areaList").innerHTML = makeAreaList();
        }
    };
    xmlhttp.open("GET","php/getAreaList.php",true);
    xmlhttp.send();
}

function getNativeList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            makeNativeList();
        }
    };
    xmlhttp.open("GET","php/getNativeList.php",true);
    xmlhttp.send();
}

function get500mList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            make500mList();
        }
    };
    xmlhttp.open("GET","php/get500mList.php",true);
    xmlhttp.send();
}

function get1000mList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            make1000mList();
        }
    };
    xmlhttp.open("GET","php/get1000mList.php",true);
    xmlhttp.send();
}


function get2000mList() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            make2000mList();
        }
    };
    xmlhttp.open("GET","php/get2000mList.php",true);
    xmlhttp.send();
}


function getStrikeRange() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            document.getElementById("strikeRange").innerHTML = makeStrikeSlider();
            [rangeMin, rangeMax]=getStrikeRangeMinMax();
            setupStrikeRangeSlider(rangeMin, rangeMax);
        }
    };
    xmlhttp.open("GET","php/getStrikeRange.php",true);
    xmlhttp.send();
}

function getDipRange() {
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("phpResponseTxt").innerHTML = this.responseText;
            document.getElementById("dipRange").innerHTML = makeDipSlider();
            [rangeMin, rangeMax]=getDipRangeMinMax();
            setupDipRangeSlider(rangeMin, rangeMax);
        }
    };
    xmlhttp.open("GET","php/getDipRange.php",true);
    xmlhttp.send();
}



function getGeoJSONbyObjGid(gidstr, meta) {
    // if gidstr is not set look for it in the input field
    if(typeof gidstr == 'undefined')   
        gidstr=document.getElementById("objGidTxt").value;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("geoSearchByObjGidResult").innerHTML = this.responseText;
            // grab the geoJSON
            var geoJSON=getGeoJSON();
            var gid=parseInt(gidstr);
            var trace=makeGeoJSONFeature(geoJSON, gid, meta);
            if(trace != undefined)
              load_a_trace(gid,trace);
        }
    };
    xmlhttp.open("GET","php/getGeoJSON.php?obj_gid="+gidstr,true);
    xmlhttp.send();
}


function setupSearch()
{
   queryByType("area");
   queryByType("zone");
   queryByType("section");
   queryByType("name");
   getStrikeRange();
   getDipRange();
   getNativeList();
   get1000mList();
   get2000mList();
   get500mList();
}


