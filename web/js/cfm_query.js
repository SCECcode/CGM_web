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


function generateResultsTable() {
    var str=processTraceMeta(all_traces);
    document.getElementById("searchResult").innerHTML = makeResultTable(str);
    $.event.trigger({
        type: "tableLoadCompleted",
        "message": "completed",
    });
}
// function getAllTraces() {
//     $.ajax({
//             url: "php/search.php",
//             data: {t: 'alltraces', q: ''},
//         }
//     ).done(function(data) {
//                 var str=processTraceMeta(data);
//         document.getElementById("phpResponseTxt").innerHTML = data;
//                 document.getElementById("searchResult").innerHTML = makeResultTable(str);
//                 $.event.trigger({
//                     type: "tableLoadCompleted",
//                     "message": "completed",
//                 });
//     });
//
//     // if (window.XMLHttpRequest) {
//     //     // code for IE7+, Firefox, Chrome, Opera, Safari
//     //     xmlhttp = new XMLHttpRequest();
//     // } else {
//     //     // code for IE6, IE5
//     //     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//     // }
//     // xmlhttp.onreadystatechange = function() {
//     //     if (this.readyState == 4 && this.status == 200) {
//     //         document.getElementById("phpResponseTxt").innerHTML = this.responseText;
//     //         var str=processTraceMeta("metaByAllTraces");
//     //         document.getElementById("searchResult").innerHTML = makeResultTable(str);
//     //         $.event.trigger({
//     //             type: "tableLoadCompleted",
//     //             "message": "completed",
//     //         })
//     //     }
//     // };
//     // xmlhttp.open("GET","php/getAllTraces.php",true);
//     // xmlhttp.send();
// }


function getStrikeRange() {

    let rangeMin = parseInt($("#dataValues").data("minstrike"));
    let rangeMax = parseInt($("#dataValues").data("maxstrike"));
    document.getElementById("strikeRange").innerHTML = makeStrikeSlider();
    setupStrikeRangeSlider(rangeMin, rangeMax);

}

function getDipRange() {
    let rangeMin = parseInt($("#dataValues").data("mindip"));
    let rangeMax = parseInt($("#dataValues").data("maxdip"));
    document.getElementById("dipRange").innerHTML = makeDipSlider();
    setupDipRangeSlider(rangeMin, rangeMax);
}

function getAllGeoJSON() {

    // let JSON_data = JSON.parse(data);
    for (const gid in all_geo_json) {
        let geojson = all_geo_json[gid];
        let trace = makeGeoJSONFeature(geojson, gid, find_meta_list(gid).meta);
        if (trace != undefined)
            load_a_trace(gid, trace);
    }
    // $.ajax({
    //         url: "php/search.php",
    //         data: {t: 'allgeojson'},
    //     }
    // ).done(function(data) {
    //     let JSON_data = JSON.parse(data);
    //     for (const gid in JSON_data) {
    //         let geojson = JSON_data[gid];
    //         let trace = makeGeoJSONFeature(geojson, gid, find_meta_list(gid).meta);
    //         if(trace != undefined)
    //             load_a_trace(gid,trace);
    //     }
    // });
}


function setupSearch()
{
   // queryByType("area");
   // queryByType("zone");
   // queryByType("section");
   // queryByType("name");
   getStrikeRange();
   getDipRange();
   // getNativeList();
   // get1000mList();
   // get2000mList();
   // get500mList();
}


