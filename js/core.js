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

$(window).on('hashchange', function() {
    route();
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
        route();
    }
}

// przyszla odpowiedz od uzytkownika
function onAuthResponseChange(response) {
    console.log('onAuthResponseChange', response);
}

//routing - opisuje jak maja sie zmieniac strony i ich zawartosc zgodnie z kliknieciami usera (operujemy na hashu)
//wolane zawsze w momencie kiedy mamy zmiane statusu aplikacji (a user jest zalogowany)
function route() {
    var hash = window.location.hash;
    console.log("window location hash:")
    console.log(hash);

    cleanScreen();

    switch(hash) {
        
        case "":
        case "#groups":
            console.log("main page");
            groups_main();
        break;
        case "#about":
            console.log("#about");
            about_main();
        break;
        case "#notify":
            console.log("#notify");
            notify_main();
        break;
        case "#contact":
            console.log("#contact");
            contact_main();
        break;
        default:
            var files_prefix = "#files_";
            console.log(hash.indexOf(files_prefix));
            if (hash.indexOf(files_prefix) == 0) {
                console.log("#files");
                console.log(hash.substring(files_prefix.length));
                files_main(hash.substring(files_prefix.length));
            } else {
                console.log("404?");
            }

    }
}
