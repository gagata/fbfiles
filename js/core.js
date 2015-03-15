var APP_ID = '1406377203009042';
var APP_NAMESPACE = 'browse-group-files';

var PERMISSIONS = {};

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

function exit() {
    top.location.href = 'https://www.facebook.com/appcenter/' + APP_NAMESPACE;
}

// callback do logowania
function loginCallback(response) {
    console.log('loginCallback',response);
    if(response.status != 'connected') {
        exit();
    }
}

function reRequest(scope, callback) {
  FB.login(callback, { scope: scope, auth_type:'rerequest'});
}

var CONFIRM_YES = 1, CONFIRM_NO = 0;

function showConfirmationPopup(message,callback) {
  var c = confirm(message);
  if(c){ 
    callback(CONFIRM_YES);
  } else {
    callback(CONFIRM_NO);
  }
}

// zmienia sie status (aplikacja zostala zaakceptowana przez Usera)
function onStatusChange(response) {
    if( response.status != 'connected' ) {
        login(loginCallback);
    } else {
        // tu pytamy o dodatkowe uprawnienia, ktorych moze nam brakowac...
        if (!hasPermission('user_groups')) {
            if (!PERMISSIONS['user_groups']) {
                PERMISSIONS['user_groups'] = true;
                reRequest('user_groups', function() {
                    route();
                });
            } else {
                // pytany, ale nie dal dostepu do grup, wiec nie ma tu nic do roboty...
                exit();
            }

        } else {
            route();
        }
    }
}

function hasPermission(permission) {
    for (var i in PERMISSIONS) {
        if (PERMISSIONS[i].permission == permission && PERMISSIONS[i].status == 'granted') 
            return true;
    }
    return false;
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
            main("/content/groups.html", groups_main);
        break;
        case "#about":
            console.log("#about");
            main("/content/about.html", about_main);
        break;
        case "#notify":
            console.log("#notify");
            main("/content/notify.html", notify_main);
        break;
        case "#contact":
            console.log("#contact");
            main("/content/contact.html", contact_main);
        break;
        default:
            var files_prefix = "#files_";
            console.log(hash.indexOf(files_prefix));
            if (hash.indexOf(files_prefix) == 0) {
                console.log("#files");
                console.log(hash.substring(files_prefix.length));
                main("/content/groups.html", function () {files_main(hash.substring(files_prefix.length))});
            } else {
                console.log("404?");
                main("/content/404.html", null);
            }

    }
}

// ladujemy odpowiedni plik do containera "#page"
// po zaladowaniu wywolywany jest callback
// funkcja wspolna dla wszystkich XXX_main
// (zawsze chcemy wczytac nowy plik przed jakakolwiek akcja)
function main(file, callback) {
    console.log("main " + file);
    console.log(callback);
    $('#page').load(file, callback);
}
