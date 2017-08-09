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
var map, infoWindow, pos;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 15
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
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
      console.log(oData);

    });
