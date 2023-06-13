var store = {};
store.location = null;
store= null;
store.markerClusterer = null;
store.markers = [];
store.infoWindow = null;

store.init = function () {
    var latLng = new google.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    var options = {
        zoom: 5.53,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        mapTypeControl: false,
    };
    store= new google.maps.Map(document.getElementById('map_canvas'), options);
    store.location = storeData();
    store.infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(0, -35),
        maxWidth: 400,
    });
    store.showMarkers();
};

store.showMarkers = function () {
    store.markers = [];
    if (store.markerClusterer) {
        store.markerClusterer.clearMarkers();
    }
    var _query = $("#form_query input[name=search]").val().toLowerCase();
    var imageUrl = base_url + 'assets/plugins/marker-clusterer/images/pin.png';
    var markerImage = {
        url: imageUrl,
        scaledSize: new google.maps.Size(25, 35),
    };
    var bounds = new google.maps.LatLngBounds();
    var panel = document.getElementById("list_data");
    panel.innerHTML = '';
    for (var i = 0; i < store.location.length; i++) {
        var row = store.location[i];
        if (_query !== "") {
            var regex = new RegExp(_query, 'g');
            if (!row.name.toLowerCase().match(regex) && !row.city.toLowerCase().match(regex) && !row.address.toLowerCase().match(regex)) {
                continue;
            }
        }
        var item = document.createElement('div');
        var _html = storeTemplate(row);
        item.className = 'store store-info';
        item.innerHTML = _html;
        panel.appendChild(item);

        var latLng = new google.maps.LatLng(row.latitude, row.longitude);
        var marker = new google.maps.Marker({
            'position': latLng,
            'icon': markerImage,
        });
        var fn = store.markerClickFunction(row, latLng);
        google.maps.event.addListener(marker, 'click', fn);
        google.maps.event.addDomListener(item, 'click', fn);
        store.markers.push(marker);
        bounds.extend(latLng);
    }
    if (_query !== "" && store.markers.length && $("#list_data .store-info").length) {
        $("#list_data .store-info")[0].click();
    } else {
        store.map.fitBounds(bounds);
    }

    window.setTimeout(store.cluster, 0);
};

store.markerClickFunction = function (row, latlng) {
    return function (e) {
        // e.cancelBubble = true;
        // e.returnValue = false;
        // if (e.stopPropagation) {
        //     e.stopPropagation();
        //     e.preventDefault();
        // }

        var _html = '<div class="store store-info">' + storeTemplate(row) + '</div>';
        store.infoWindow.setContent(_html);
        store.infoWindow.setPosition(latlng);
        store.infoWindow.open(store.map);
        store.map.setCenter(latlng);
        store.map.setZoom(17);
    };
};

store.clear = function () {
    for (var i = 0, marker; marker = store.markers[i]; i++) {
        marker.setMap(null);
    }
};

store.change = function () {
    store.clear();
    store.showMarkers();
};

store.cluster = function () {
    var mcOptions = {
        gridSize: 0,
        minimumClusterSize: 999999999,
        imagePath: base_url + 'assets/plugins/marker-clusterer/images/m',
    };
    store.markerClusterer = new MarkerClusterer(store.map, store.markers, mcOptions);
};

$(document).ready(function () {
    $("#form_query input[name=search]").keydown(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            store.change();
        }
    });
    myLocation();
});

function storeData() {
    var _data = [];
    var string = $("#form_query").serialize();
    $.ajax({
        type: "POST",
        url: site_url + "web/store_data",
        data: string,
        cache: false,
        async: false,
        dataType: 'json',
        beforeSend: function () {
            loading_open();
        },
        success: function (json) {
            _data = json;
        },
        complete: function () {
            loading_close();
        },
        error: function (xhr, status, error) {
            swal(
                'Error',
                error,
                'error'
            );
        }
    });
    return _data;
}

function storeTemplate(row){
    var _html = '';
     _html += '<div class="d-flex justify-content-between province">';
         _html += '<div>' + row.city + '</div>';
         _html += '<div><i>' + row.name + '</i></div>';
     _html += '</div>';
    //  _html += '<div class="address">' + row.address + '</div>';
    //  _html += '<small>Distance: ' + row.distance + '</small>';
     _html += '<div class="icon">';
         _html += '<div>';
            if (row.shopee) {
                _html += '<a href="' + row.shopee + '" target="_blank"><img src="' + base_url + 'assets/images/platform/icon-shopee.png" alt="Shopee" /></a>';
            }
            if (row.tokopedia) {
                _html += '<a href="' + row.tokopedia + '" target="_blank"><img src="' + base_url + 'assets/images/platform/icon-tokopedia.png" alt="Tokopedia" /></a>';
            }
            if (row.lazada) {
                _html += '<a href="' + row.lazada + '" target="_blank"><img src="' + base_url + 'assets/images/platform/icon-lazada.jpg" alt="Lazada" /></a>';
            }
            if (row.jdid) {
                _html += '<a href="' + row.jdid + '" target="_blank"><img src="' + base_url + 'assets/images/platform/icon-jdid.png" alt="JD ID" /></a>';
            }
            if (row.bukalapak) {
                _html += '<a href="' + row.bukalapak + '" target="_blank"><img src="' + base_url + 'assets/images/platform/icon-bukalapak.png" alt="Bukalapak" /></a>';
            }
            if (row.blibli) {
                _html += '<a href="' + row.blibli + '" target="_blank"><img src="' + base_url + 'assets/images/platform/icon-blibli.jpg" alt="Blibli" /></a>';
            }
         _html += '</div>';
         _html += '<div>';
            if (row.instagram) {
                _html += '<a href="' + row.instagram + '" target="_blank"><img src="' + base_url + 'assets/images/platform/instagram.png" alt="Instagram" /></a>';
            }
            if (row.facebook) {
                _html += '<a href="' + row.facebook + '" target="_blank"><img src="' + base_url + 'assets/images/platform/facebook.png" alt="Facebook" /></a>';
            }
            if (row.phone) {
                _html += '<a href="https://wa.me/+' + row.phone + '" target="_blank"><img src="' + base_url + 'assets/images/platform/whatsapp.png" alt="Whatsapp" /></a>';
            }
            if (row.email) {
                _html += '<a href="mailto:' + row.email + '"><img src="' + base_url + 'assets/images/platform/email.png" alt="Email" /></a>';
            }
         _html += '</div>';
     _html += '</div>';
     return _html;
}

function myLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(myLocationSuccess, myLocationError);
    } else {
        swal(
            'Error',
            'Geolocation is not supported by this browser',
            'error'
        );
    }
}

function myLocationSuccess(position) {
    $('#form_query input[name=latitude]').val(position.coords.latitude);
    $('#form_query input[name=longitude]').val(position.coords.longitude);
    DEFAULT_LATITUDE = position.coords.latitude;
    DEFAULT_LONGITUDE = position.coords.longitude;
    DEFAULT_ZOOM = 17;
    store.init();
}

function myLocationError(error) {
    swal(
        'Warning',
        'Please allow your location to get nearest store!',
        'warning'
    );
    console.log('Error Location: ' + error.code + ' - ' + error.message);
}