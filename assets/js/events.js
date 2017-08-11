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
    initAutocomplete();
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

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('location')),
        {types: ['geocode']});

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
  type:"GET",
  url:"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3",
  async:true,
  dataType: "json",
  success: function(json) {
    console.log(json)
    
              for(i = 0; i < json._embedded.events.length; i++){
                var eventObj = json._embedded.events;
                var currentEvent = eventObj[i]
                var eventBox = $("<div>").addClass("col-md-4 event");
                var name = currentEvent.name;
                var image = $("<img>").addClass("eventImg").attr("src", currentEvent.images[5].url);
                var info; 
                $("#eventRow").append(eventBox);

                // $(eventBox).append(name, image, "<br>");

                if(i % 3 === 0 || i === 0 ){
                  var displayRow = $("<div>").addClass("row displayRow");
                  $("#eventRow").append(displayRow);
                  $(displayRow).append(eventBox);
                  $(eventBox).append(name, image, "<br>");
                } else {
                  $(".displayRow").last().append(eventBox);
                  $(eventBox).append(name, image, "<br>");
                }
              }
              // Parse the response.
              // Do other things.
           },
  error: function(xhr, status, err) {
              // This time, we do not end up here!
           }
});