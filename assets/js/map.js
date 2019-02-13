var map, service, infowindow, marker, center, startPos, posLat, posLong, searchState, queryText, myPosition, iconLink;
var queryPosition = 0;
var queryPositionCounter = 7;
var markerSetAsHabit = false;
var onloadMarker = true;
var range = 3050; //ft

//-------------Timer Vars----------------//
var timerCanStart = false;
var timeAtHabit = 5 * 60;
var timerVar;
var timePercentage;
var minutes = 0;
var seconds = 0;
var tens = 0;
var time = 0;

//---------Data for Firebase---------//
var currentHabitCoord = [];
var queryCoord = [];
var placeArray = [];
var markerIcon = {
    "1": ["./assets/imgs/mapImg/gym.png", 27],
    "2": ["./assets/imgs/mapImg/parks.png", 35],
    "3": ["./assets/imgs/mapImg/yoga.png", 38],
    "4": ["./assets/imgs/mapImg/spinning.png", 30],
    "5": ["./assets/imgs/mapImg/dance.png", 30],
    "6": ["./assets/imgs/mapImg/rock.png", 28],
    "7": ["./assets/imgs/mapImg/custom.png", 35],
    "8": ["./assets/imgs/mapImg/custom.png", 35],
    "9": ["./assets/imgs/mapImg/custom.png", 35]
};
var habitCoord = {};

window.onload = function () {
    $('.progress').hide();
    $('#timerDisplay').hide();
    $('#completeHabit1').hide();
    $('#habit1Metrics').hide();
    var geoSuccess = function (position) {
        startPos = position;
        posLat = position.coords.latitude;
        posLong = position.coords.longitude;
        initMap();
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: posLat, lng: posLong },
        zoom: 16
    });
    marker = new google.maps.Marker({
        position: { lat: posLat, lng: posLong },
        map: map
    });
    if (onloadMarker == true) {
        google.maps.event.addListener(marker, 'click', function () {
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent('<p>You Are Here<p>');
            infowindow.open(map, this);
        });
        onloadMarker = false;
    }
    myPosition = [posLat, posLong];
    $('.preloader-background').delay(600).fadeOut('slow');
    $('.preloader-wrapper').fadeOut();
}

function searchPlaces() {
    var userPosition = new google.maps.LatLng(posLat, posLong);
    var request = {
        location: userPosition,
        radius: '500',
        query: queryText
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
};

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK && searchState == "false") {
        placeArray[queryPosition] = [];
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else if (searchState == "true") {
        setMapOnAll(null);
    }
}

function createMarker(place) {
    var icon = {
        url: markerIcon[iconLink][0],
        scaledSize: new google.maps.Size(markerIcon[iconLink][1], markerIcon[iconLink][1]), // scaled size
    };
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        icon: icon
    });

    google.maps.event.addListener(marker, 'click', function () {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '</div>');
        infowindow.open(map, this);

        if (markerSetAsHabit == true) {
            markerSetAsHabit = false;
            timerCanStart = true;
            currentHabitCoord = [place.geometry.location.lat(), place.geometry.location.lng()];
            $('#habitName').text(place.name);
            $('#habitAddress').text(place.formatted_address);
            $('#completeHabit1').show('slow');
            $('#completeHabit1').show('slow');
            $('#habit1Metrics').show('slow');
            $('.progress').show('slow');
            $('#timerDisplay').show('slow');
        }
    });
    placeArray[queryPosition].push(marker);
}

function setMapOnAll(map) {
    for (var i = 0; i < placeArray[queryPosition].length; i++) {
        placeArray[queryPosition][i].setMap(map);
    }
}

function searchButton() {
    iconLink = $(this).attr('data-position');
    queryPosition = $(this).attr('data-position');
    searchState = $(this).attr('data-state');
    if ($(this).attr('data-state') == "false") {
        queryText = $(this).attr('data-name');
        searchPlaces();
        $(this).attr('data-state', 'true');
    } else if ($(this).attr('data-state') == "true") {
        queryText = $(this).attr('data-name');
        searchPlaces();
        $(this).attr('data-state', 'false');
    }
};

function addButt() {
    var $butt = $('<button></button>');
    $butt.append($('input').val());
    $butt.addClass('btn btn-success location');
    $butt.attr('data-state', 'false');
    $butt.attr('data-name', $('input').val());
    $butt.attr('data-position', queryPositionCounter);
    $butt.on('click', searchButton);
    $('.allLocations').append($butt);
    queryPositionCounter++;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDistanceFromLatLonInFt(lat1, lon1, lat2, lon2) {
    var R = 20924640; // Radius of the earth in ft
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in ft
    console.log(d);
    if (d > range) {
        alert("You are not close enough!");
        return false;
    } else {
        $(this).css('background-color', 'red');
        return true;
    }
}

function timerQuarter() {
    time++
    if (time == timeAtHabit) {
        alert('You Have Completed This Habit!');
        stopTimer();
    } else if (time == 270) {
        navigator.geolocation.getCurrentPosition(geoSuccess);
        if (!getDistanceFromLatLonInFt(myPosition[0], myPosition[1], currentHabitCoord[0], currentHabitCoord[1])) {
            stopTimer();
            alert("You are too far away from your habit location!");
            time = 0;
            seconds = 0;
            tens = 0;
            minutes = 0;
        }
    }

    if (seconds < 9) {
        seconds++;
    } else if (tens < 5) {
        seconds = 0;
        tens++
    } else if(tens = 6){
        seconds = 0;
        tens = 0;
        minutes++
    }

    $('#timerDisplay').text(minutes + ':' + tens + '' + seconds);
    timePercentage = (time / timeAtHabit) * 100;
    $('#habit1Timer').css('width', timePercentage + '%');
}

function stopTimer() {
    clearInterval(timerVar);
}

