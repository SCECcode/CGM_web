/***
    cgm_query.js
***/

$searchResult = $("#searchResult");

var CGM_searchType = {
// singleton
    station: 'station',
// 2 sets of latlon
    latlon: 'latlon',
// range of 2
    vector: 'vector',
    velocity: 'velocity'
};

function searchWithVector() {
  //grab the min and max from the slider..
  vals = $( "#slider-vector-range" ).slider("option", "values");
  CGM_search(CGM_searchType.vector, vals);
}

function searchByStationName() {
    str=document.getElementById("StationNameTxt").value;
    CGM_search(CGM_searchType.station,str);
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
//    chk_and_add_bounding_rectangle();
    
    if (firstlatstr == "" || firstlonstr=="") {
        $searchResult.html("");
        return;
    } else {
        CGM_search(CGM_searchType.latlon, criteria);
    }
}

function CGM_search(type, criteria) {
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

            let tmp = JSON.parse(data);
            var sz=(Object.keys(tmp).length);
            for( var i=0; i< sz; i++) {
//XXX
            }
        }
    );
}

