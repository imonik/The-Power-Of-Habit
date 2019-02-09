var map;
var service;
var infowindow;
var marker;
var center;
var startPos;
var posLat;
var posLong;
var queryCoord = [];
var marker;
var searchState = "";
var queryText = "";
var placeArray = [];
var queryPosition = 0;
var queryPositionCounter = 7;
var markerIcon = {
    "1":["./assets/imgs/mapImg/gym.png",27],
    "2":["./assets/imgs/mapImg/parks.png",35],
    "3":["./assets/imgs/mapImg/yoga.png",38],
    "4":["./assets/imgs/mapImg/spinning.png",30],
    "5":["./assets/imgs/mapImg/dance.png",30],
    "6":["./assets/imgs/mapImg/rock.png",28],
    "7": ["./assets/imgs/mapImg/custom.png",35],
    "8": ["./assets/imgs/mapImg/custom.png",35],
    "9": ["./assets/imgs/mapImg/custom.png",35]
};
var habitCoord = {};

var iconLink;

window.onload = function () {
    var geoSuccess = function (position) {
        startPos = position;
        posLat = position.coords.latitude;
        posLong = position.coords.longitude;
        initMap();
    };
    navigator.geolocation.getCurrentPosition(geoSuccess);
};

function initialize() {
    initMap();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: posLat, lng: posLong },
        zoom: 16
    });
    marker = new google.maps.Marker({
        position: { lat: posLat, lng: posLong },
        map: map
    });
    google.maps.event.addListener(marker, 'click', function () {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<p>You Are Here<p>');
        infowindow.open(map, this);
    });
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
            var place = results[i];
            createMarker(results[i]);
        }
    } else if (searchState == "true") {
        setMapOnAll(null);
    }
}

function createMarker(place) {
    console.log(place);
var icon = {
    url: markerIcon[iconLink][0], // url
    scaledSize: new google.maps.Size(markerIcon[iconLink][1], markerIcon[iconLink][1]), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
};
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP,
        icon : icon
    });

    google.maps.event.addListener(marker, 'click', function () {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.formatted_address + '</div>');
        infowindow.open(map, this);

        console.log(place.geometry.location.lat())
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

$('.location').on('click', searchButton);

