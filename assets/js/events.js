// Initialize Firebase
var config = {
    apiKey: "AIzaSyD1wgfoAUkJgqcXW9JCHlavzc86jWoZMb4",
    authDomain: "events-here-now-1502232251792.firebaseapp.com",
    databaseURL: "https://events-here-now-1502232251792.firebaseio.com",
    projectId: "events-here-now-1502232251792",
    storageBucket: "events-here-now-1502232251792.appspot.com",
    messagingSenderId: "762881140092"
};
firebase.initializeApp(config);

var database = firebase.database();

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow, pos, geoPoint, marker, myLatLng, lat, lng;
var venues = [];

function geoLocate() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            geoPoint = JSON.stringify(pos.lat) + "," + JSON.stringify(pos.lng);
            console.log(geoPoint)
            lat = JSON.stringify(pos.lat);
            lng = JSON.stringify(pos.lng);

            map.setCenter(pos);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function initMap() {
    geoLocate();

    myLatLng = {
        lat: lat,
        lng: lng
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 15
    });


    marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });

    initAutocomplete();

}




function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('location')), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
}

//uses a json p callback ; 

var oArgs = {

    app_key: "RDpX8hD4VzsNsP63",

    q: "music",

    where: "San Diego",

    page_size: 5,

    sort_order: "popularity",

};

EVDB.API.call("/events/search", oArgs, function(oData) {

    // Note: this relies on the custom toString() methods below
    console.log(oData.events.event[0]);

});



$.ajax({
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3",
    async: true,
    dataType: "json",
    success: function(json) {
        console.log(json)

        for (i = 0; i < json._embedded.events.length; i++) {
            var eventObj = json._embedded.events;
            var eventLocation = json._embedded.events[i]._embedded.venues[0].location;
            var currentEvent = eventObj[i]
            var eventBox = $("<div>").addClass("col-md-4 event");
            var name = $("<h5>").text(currentEvent.name).addClass("text-center");
            var image = $("<img>").addClass("eventImg").attr("src", currentEvent.images[5].url);
            var info;
            $("#eventDisplay").append(eventBox);
            venues.push(eventLocation);

            // $(eventBox).append(name, image, "<br>");

            if (i % 3 === 0 || i === 0) {
                var displayRow = $("<div>").addClass("row displayRow");
                $("#eventDisplay").append(displayRow);
                $(displayRow).append(eventBox);
                $(eventBox).append(image, name, "<br>");
            } else {
                $(".displayRow").last().append(eventBox);
                $(eventBox).append(image, name, "<br>");
            }
        }
        console.log(venues)
            // Parse the response.
            // Do other things.
    },
    error: function(xhr, status, err) {
        // This time, we do not end up here!
    }
});

var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3";
var rootUrl = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3";
var searchInput;


function generateQuery() {
    event.preventDefault();
    changeMap();

    searchLocation = $("#location").val();
    splitter = searchLocation.split(',');
    state = splitter[1];
    searchInput = $("#search").val().trim();
    category = $(".category").text().trim();

    if (category === "Categories") {
        category = undefined;
    }
    // queryUrl = rootUrl + "&keyword=" + searchInput + "&geoPoint=" + geoPoint;
    queryUrl = rootUrl + "&keyword=" + searchInput + "&classificationName=" + category + "&city=" + searchLocation.substr(0, searchLocation.indexOf(','));
    console.log(queryUrl);

    $.ajax({
        type: "GET",
        url: queryUrl,
        async: true,
        dataType: "json",
        success: function(json) {
            console.log(json)
            $("#eventDisplay").empty();
            for (i = 0; i < json._embedded.events.length; i++) {
                console.log("for")
                var eventObj = json._embedded.events;
                var currentEvent = eventObj[i]
                var eventBox = $("<div>").addClass("col-md-4 event");
                var name = $("<h5>").text(currentEvent.name).addClass("text-center");
                var image = $("<img>").addClass("eventImg").attr("src", currentEvent.images[5].url);
                var info;
                $("#eventRow").append(eventBox);

                // $(eventBox).append(name, image, "<br>");

                if (i % 3 === 0 || i === 0) {
                    var displayRow = $("<div>").addClass("row displayRow");
                    $("#eventDisplay").append(displayRow);
                    $(displayRow).append(eventBox);
                    $(eventBox).append(image, name, "<br>");
                } else {
                    $(".displayRow").last().append(eventBox);
                    $(eventBox).append(image, name, "<br>");
                }
            }

            // Parse the response.
            // Do other things.
        },
        error: function(xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

function changeCategory() {
    var caret = $("<span class='caret'></span>")
    var chosenCategory = $(this).text();
    $(".category").html(chosenCategory);
    $(".category").append(caret);
}

function changeMap() {
    alert("changeMap")
    event.preventDefault();

    var address = $("#location").val().trim();


    if (address === "") {
        address = "Raleigh, NC"
    }
    console.log(address)
        // var address = 'Raleigh, NC';

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var Lat = results[0].geometry.location.lat();
            var Lng = results[0].geometry.location.lng();
            var myOptions = {
                zoom: 11,
                center: new google.maps.LatLng(Lat, Lng)
            };
            
            var map = new google.maps.Map(
                document.getElementById("map"), myOptions);
            
             for(i = 0; i < 10; i++) {
              console.log(venues[i].longitude);
              var marker =  new google.maps.Marker({
                position: new google.maps.LatLng(venues[i].latitude,venues[i].longitude),
                map: map,
              });
              console.log(marker.position)
             }

            // var marker = new google.maps.Marker({
            //     position: new google.maps.LatLng(Lat + .1, Lng + .1),
            //     map: map,
            //     title: 'Hello World!'
            // });
        } else {
            alert("Something got wrong " + status);
        }
    });
}



$("#submit").on("click", generateQuery);
$(".categoryOption").on("click", changeCategory)