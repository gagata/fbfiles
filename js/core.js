var APP_ID = '1406377203009042';
var APP_NAMESPACE = 'browse-group-files';

$(document).ready(function () {

    //inicjacja SDK
    FB.init({
        appId: APP_ID,
        frictionlessRequests: true,
        status: true,
        version: 'v2.1'
    });

    //obsluga niezbednych eventow
    FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange);
    FB.Event.subscribe('auth.statusChange', onStatusChange);

});

// obsluga logowania
function login(callback) {
    FB.login(callback);
}

// callback do logowania
function loginCallback(response) {
    console.log('loginCallback',response);
    if(response.status != 'connected') {
        top.location.href = 'https://www.facebook.com/appcenter/' + APP_NAMESPACE;
    }
}

// zmienia sie status (aplikacja zostala zaakceptowana przez Usera)
function onStatusChange(response) {
    if( response.status != 'connected' ) {
        login(loginCallback);
    } else {
        showHome();
    }
}

// przyszla odpowiedz od uzytkownika
function onAuthResponseChange(response) {
    console.log('onAuthResponseChange', response);
}

function showHome() {
    console.log('show home...');
    console.log(window.location.hash);
    show_content();
}
