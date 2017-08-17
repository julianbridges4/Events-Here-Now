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
var user = firebase.auth().currentUser;
var infoWindow;
var searchCounter = 0; 



function registerUser() {
    event.preventDefault();
    var userEmail = $("#inputEmail").val().trim();
    var userPassword = $("#inputPassword").val().trim();

    if (userPassword.length < 8) {
        $("#newUserError").text("Please enter a password over 8 characters");
        return;
    } else {
        firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            $("#newUserError").text(errorMessage);
            console.log(errorMessage);
        });
        $("#newUserError").text("");
        $("#inputEmail").val("");
        $("#inputPassword").val("");
        window.location.replace("index.html");
        sendEmailVerification();
    }
}

//this creates a login and password for a user 
$("#submitLogin").on("click", registerUser);



// function for an exisitng user to sign in 
function signInUser() {
    event.preventDefault();
    var existingEmail = $("#existingEmail").val().trim();
    var existingPassword = $("#existingPassword").val().trim();

    firebase.auth().signInWithEmailAndPassword(existingEmail, existingPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == 'auth/invalid-email') {
            $("#errorMessage").text(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
            $("#errorMessage").text(errorMessage);
        }

        console.log(error);
        console.log(errorCode);
        console.log(errorMessage);

        $("#sign-in-form").append("username or password incorrect");
    });

    $("#existingEmail").val("");
    $("#existingPassword").val("");

}

  $("#closeModal").on("click", function() {
  $('#sign-in-modal').modal('hide');

})

//calls signInUser function for exisitng users
$("#existingLogin").on("click", signInUser);

// function to log out of the account
function logout() {
    firebase.auth().signOut().then(function() {
        console.log("signout successfull");
        // Sign-out successful.
    }).catch(function(error) {
        console.log("signout not successful");
        // An error happened.
    });
}
//calls logout function upon clicking on logout button
$("#logout").on("click", logout);

function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        console.log('Email Verification Sent!');
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

//performs these functions where the state of the authorization is changed 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      console.log("user signed in");
      console.log("user Email: " + email); 
      console.log("user ID:" + uid);
      $('#sign-in-modal').modal('hide');
      $("#login-button").hide();
      $("#logout").show();
      $("#lastSearch").show();

       database.ref('users/' + firebase.auth().currentUser.uid).once("value", function(snapshot) {
         searchCounter = snapshot.val().searchNumber; 
         console.log(snapshot.val());
         console.log("search counter on load is:" + searchCounter);

        var userSearchDirectory = 'users/' + firebase.auth().currentUser.uid + '/recentSearch/';

          database.ref(userSearchDirectory + searchCounter).once("value", function(snapshot) {       
            var sv = snapshot.val(); 
            console.log("location:" + sv.searchLocation); 
            console.log(sv.searchItem); 
         

            function recentSearch(event) {
              event.preventDefault();
              $("#location").val(sv.searchLocation); 
              $("#search").val(sv.searchItem); 
              generateQuery();
            }

            $("#lastSearch0").text(sv.searchLocation); 
            $("#lastSearch0").on("click", recentSearch);
           
          });

          database.ref(userSearchDirectory + (searchCounter - 1)).once("value", function(snapshot) {       
            var sv = snapshot.val(); 
            console.log("location:" + sv.searchLocation); 
            console.log(sv.searchItem); 
           

            function recentSearch(event) {
              event.preventDefault();
              $("#location").val(sv.searchLocation); 
              $("#search").val(sv.searchItem); 
              generateQuery();
            }

            $("#lastSearch1").text(sv.searchLocation); 
            $("#lastSearch1").on("click", recentSearch);

          });

           database.ref(userSearchDirectory + (searchCounter - 2)).once("value", function(snapshot) {       
            var sv = snapshot.val(); 
            console.log("location:" + sv.searchLocation); 
            console.log(sv.searchItem); 
           

            function recentSearch(event) {
              event.preventDefault();
              $("#location").val(sv.searchLocation); 
              $("#search").val(sv.searchItem); 
              generateQuery();
            }

            $("#lastSearch2").text(sv.searchLocation); 
            $("#lastSearch2").on("click", recentSearch);

          });

      })

      //this stores last search data to a user specific folder on firebase
      $("#submit").on("click", function() {
          var searchItem = $("#search").val().trim(); 
          var searchLocation = $("#location").val().trim(); 
          searchCounter++; 
          console.log("Search counter now: " + searchCounter); 

          var userSearchDirectory = 'users/' + firebase.auth().currentUser.uid + '/recentSearch/';

          database.ref(userSearchDirectory + searchCounter).update({
          searchItem: searchItem,
          searchLocation: searchLocation,
        })


          database.ref('users/' + firebase.auth().currentUser.uid ).update({
            searchNumber: searchCounter
          })


          database.ref(userSearchDirectory + searchCounter).once("value", function(snapshot) {       
            var sv = snapshot.val(); 
            console.log("location:" + sv.searchLocation); 
            console.log(sv.searchItem); 

            function recentSearch(event) {
              event.preventDefault();
              $("#location").val(sv.searchLocation); 
              $("#search").val(sv.searchItem); 
              generateQuery();
            }

            $("#lastSearch0").text(sv.searchLocation); 
            $("#lastSearch0").on("click", recentSearch);
           
          });

          database.ref(userSearchDirectory + (searchCounter - 1)).once("value", function(snapshot) {       
            var sv = snapshot.val(); 
            console.log("location:" + sv.searchLocation); 
            console.log(sv.searchItem); 

            function recentSearch(event) {
              event.preventDefault();
              $("#location").val(sv.searchLocation); 
              $("#search").val(sv.searchItem); 
              generateQuery();
            }

            $("#lastSearch1").text(sv.searchLocation); 
            $("#lastSearch1").on("click", recentSearch);

          });

           database.ref(userSearchDirectory + (searchCounter - 2)).once("value", function(snapshot) {       
            var sv = snapshot.val(); 
            console.log("location:" + sv.searchLocation); 
            console.log(sv.searchItem); 

            function recentSearch(event) {
              event.preventDefault();
              $("#location").val(sv.searchLocation); 
              $("#search").val(sv.searchItem); 
              generateQuery();
            }

            $("#lastSearch2").text(sv.searchLocation); 
            $("#lastSearch2").on("click", recentSearch);

          });

      });


    } else {
        console.log("user not signed in");
        $("#login-button").show();
        $("#logout").hide();
        $("#lastSearch").hide();
    }

});


function lastCategory() {
    var caret = $("<span class='caret'></span>");
    var chosenCategory = $("<span>").text($(this).text());
    $(".category").empty();
    $(".category").append(chosenCategory, caret);
}




// function googleSignIn() {

//         var provider = new firebase.auth.GoogleAuthProvider();

//         provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

//         firebase.auth().signInWithRedirect(provider);

//         firebase.auth().getRedirectResult().then(function(result) {
//         if (result.credential) {
//           // This gives you a Google Access Token. You can use it to access the Google API.
//           var token = result.credential.accessToken;
//           // ...
//         }
//         // The signed-in user info.
//         var user = result.user;
//       }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//         // ...
//       });  

// }

//   $("#googleSignIn").on("click", googleSignIn); 

function forgotPassword() {


}



// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, pos, geoPoint, myLatLng, lat, lng;
var venues = [];




function geoLocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            geoPoint = JSON.stringify(pos.lat) + "," + JSON.stringify(pos.lng);
            localStorage.setItem("geoPoint", geoPoint);
            console.log("Geopoint: " + geoPoint)
            lat = JSON.stringify(pos.lat);
            lng = JSON.stringify(pos.lng);
        });
    }
}

function initMap() {
    geoLocate();
    var split = localStorage.getItem("geoPoint").split(',');
    var lattitude = split[0];
    var longitude = split[1];
    var myLatLng = {
        lat: parseFloat(lattitude),
        lng: parseFloat(longitude)
    }
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 13
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
// var oArgs = {
//     app_key: "RDpX8hD4VzsNsP63",
//     q: "music",
//     where: "San Diego",
//     page_size: 5,
//     sort_order: "popularity",
// };
// EVDB.API.call("/events/search", oArgs, function(oData) {
//     // Note: this relies on the custom toString() methods below
// });

function createMarker(event) {

    var eventLocation = event._embedded.venues[0].location;
    var infowindow = new google.maps.InfoWindow();
    var contentString = event.name;
    var marker = new google.maps.Marker({
        position: {
            lat: parseFloat(eventLocation.latitude),
            lng: parseFloat(eventLocation.longitude)
        },
        title: event.name
    });

    marker.setMap(map);
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });

}

function geolocateQuery() {
    var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?geoPoint=" + localStorage.getItem("geoPoint") + "&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3";
    $.ajax({
        type: "GET",
        url: queryUrl,
        async: true,
        dataType: "json",
        success: function(json) {
            console.log(json)
            for (i = 0; i < json._embedded.events.length; i++) {

                var eventObj = json._embedded.events;
                var currentEvent = eventObj[i]
                var eventBox = $("<div>").addClass("col-md-4 event");
                var name = $("<h4>").text(currentEvent.name);
                var image = $("<img>").addClass("eventImg").attr("src", currentEvent.images[5].url);
                var venue = $("<p>").text(currentEvent._embedded.venues[0].name);
                var address = $("<p>").text("Address: " + currentEvent._embedded.venues[0].address.line1);
                var date = $("<p>").text("Date: " + moment(currentEvent.dates.start.localDate, "YYYY-MM-DD").format("ddd, MMM Do YYYY"));
                var time = $("<p>").text("Time: " + moment(currentEvent.dates.start.localTime, "HH:mm:ss").format("h:mm a"));
                var eventUrl = $("<p>").html("<a target='_blank' href=" + currentEvent.url + ">Buy Tickets</a>");
                $("#eventDisplay").append(eventBox);
               
                createMarker(json._embedded.events[i]);

                if (i % 3 === 0 || i === 0) {
                    var displayRow = $("<div>").addClass("row displayRow");
                    $("#eventDisplay").append(displayRow);
                    $(displayRow).append(eventBox);
                    $(eventBox).append(image, name, venue, address, date, time, eventUrl, "<br>");
                } else {
                    $(".displayRow").last().append(eventBox);
                    $(eventBox).append(image, name, venue, address, date, time, eventUrl, "<br>");
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
var queryUrl = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=324&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3";
var rootUrl = "https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=7sqW8HhAAt6C5NKHjGWtrnso0YJc7CQ3";
var searchInput, geoCodedLocation;

function clickHandler() {
    var contentString
    google.maps.event.addListener(marker, 'click', function() {

        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });
}

function geoPointGenerator(searchLocation) {
    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': searchLocation
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var Lat = results[0].geometry.location.lat();
            var Lng = results[0].geometry.location.lng();
            searchLocation = "" + Lat + "," + Lng + "";
            console.log("geoCodedLocation: " + searchLocation)
            // Need to create one for each venue
        } else {
            alert("Something got wrong " + status);
        }
    });

}

function ajaxRequest(geoPoint) {
    
    var searchLocation = $("#location").val().trim();

    searchInput = $("#search").val().trim();
    category = $(".category").text().trim();
    if (category === "Categories") {
        category = undefined;
    }
    // queryUrl = rootUrl + "&keyword=" + searchInput + "&geoPoint=" + geoPoint;
    queryUrl = rootUrl + "&keyword=" + searchInput + "&classificationName=" + category + "&geoPoint=" + geoPoint + "&includeLicensedContent=yes" + "&radius=25";
    console.log("SearchQuery: " + queryUrl)
    $.ajax({
        type: "GET",
        url: queryUrl,
        async: true,
        dataType: "json",
        success: function(json) {
            console.log("yo")
            console.log(json)
            $("#eventDisplay").empty();
            if(json._embedded === undefined){
                var noResults = $("<h2>").text("Your search - " + searchInput + " - did not match any events");
                $("#eventDisplay").append(noResults);
                return;
            }

            for (i = 0; i < json._embedded.events.length; i++) {
               
                var eventLocation = json._embedded.events[i]._embedded.venues[0].location;
                var eventObj = json._embedded.events;
                var currentEvent = eventObj[i]
                var eventBox = $("<div>").addClass("col-md-4 event");
                var name = $("<h4>").text(currentEvent.name);
                var image = $("<img>").addClass("eventImg").attr("src", currentEvent.images[5].url);
                var venue = $("<p>").text(currentEvent._embedded.venues[0].name);
                var address = $("<p>").text("Address: " + currentEvent._embedded.venues[0].address.line1);
                var date = $("<p>").text("Date: " + moment(currentEvent.dates.start.localDate, "YYYY-MM-DD").format("ddd, MMM Do YYYY"));
                var time = $("<p>").text("Time: " + moment(currentEvent.dates.start.localTime, "HH:mm:ss").format("h:mm a"));
                var eventUrl = $("<p>").html("<a target='_blank' href=" + currentEvent.url + ">Buy Tickets</a>");
                $("#eventRow").append(eventBox);

                 createMarker(json._embedded.events[i]);

                if (i % 3 === 0 || i === 0) {
                    var displayRow = $("<div>").addClass("row displayRow");
                    $("#eventDisplay").append(displayRow);
                    $(displayRow).append(eventBox);
                    $(eventBox).append(image, name, venue, address, date, time, eventUrl, "<br>");
                } else {
                    $(".displayRow").last().append(eventBox);
                    $(eventBox).append(image, name, venue, address, date, time, eventUrl, "<br>");
                }
            }

               // if(json._embedded.events.length === 0){
               //      var noResults = $("<h2>").text("No results matching " + searchInput);
               //      $("#eventDisplay").append(noResults);
               //  }
            // Parse the response.
            // Do other things.
        },
        error: function(xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

function generateQuery() {

    event.preventDefault();
    changeMap();
    
}

function changeCategory() {
    var caret = $("<span class='caret'></span>");
    var chosenCategory = $("<span>").text($(this).text());
    $(".category").empty();
    $(".category").append(chosenCategory, caret);
}

function changeMap() {
    
    event.preventDefault();
    var address = $("#location").val().trim();
    if (address === "") {
        address = "United States"
    }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var Lat = results[0].geometry.location.lat();
            var Lng = results[0].geometry.location.lng();
            var geoPoint = "" + Lat + "," + Lng + "";
            var myOptions = {
                zoom: 10,
                center: new google.maps.LatLng(Lat, Lng)
            };
            map = new google.maps.Map(
                document.getElementById("map"), myOptions);
            ajaxRequest(geoPoint);
            // Need to create one for each venue
        } else {
            alert("Something got wrong " + status);
        }

    });

}
$(document).ready(function() {
    //$(window).on("load"), geolocateQuery();
    $("#submit").on("click", generateQuery);
    $(".categoryOption").on("click", changeCategory);
});