var APP_ID = '1406377203009042';
var APP_NAMESPACE = 'browse-group-files';

var PERMISSIONS = {};

var DEBUG = false;


$(document).ready(function () {

    var body = $("body");
    $(document).on("load-start", function () {
        body.addClass("loading").delay(100); 
    });
    $(document).on("load-stop", function () {
        body.delay(100).removeClass("loading"); 
    });

    // inicjacja SDK
    FB.init({
        appId: APP_ID,
        frictionlessRequests: true,
        status: true,
        version: 'v2.1'
    });

    // obsluga niezbednych eventow
    FB.Event.subscribe('auth.authResponseChange', onAuthResponseChange);
    FB.Event.subscribe('auth.statusChange', onStatusChange);

});

$(window).on('hashchange', function() {
    route();
});

// obsluga logowania
function login(callback) {
    FB.login(callback, { scope: 'user_groups,publish_actions' });
}

function exit() {
    top.location.href = 'https://www.facebook.com/appcenter/' + APP_NAMESPACE;
}

// callback do logowania
function loginCallback(response) {
    log('loginCallback', response);
    if (response.status != 'connected') {
        exit();
    } else {
        FB.api("/me/permissions", "GET", function (response) {
            PERMISSIONS = response.data;
            log(PERMISSIONS);
        });
    }
}

function reRequest(scope, callback) {
    FB.login(function (response) {
        // generalnie na nowo ustawiamy permsy
        FB.api("/me/permissions", "GET", function(r) {
            PERMISSIONS = r.data;
            callback(response);
        });

        }, { scope: scope, auth_type: 'rerequest' });
}

var CONFIRM_YES = 1, CONFIRM_NO = 0;

function showConfirmationPopup(message, callback) {
  var c = confirm(message);
  if (c) {
    callback(CONFIRM_YES);
  } else {
    callback(CONFIRM_NO);
  }
}

// zmienia sie status (aplikacja zostala zaakceptowana przez Usera)
function onStatusChange(response) {
    if (response.status != 'connected') {
        login(loginCallback);
    } else {
        reRequestPermissions('user_groups', route, exit);
    }
}

function reRequestPermissions(permissions, onSuccess, onFailure) {
    // tu pytamy o dodatkowe uprawnienia, ktorych moze nam brakowac...
    if (!hasPermission(permissions)) {
        log("not ok?");
        if (!PERMISSIONS[permissions]) {
            PERMISSIONS[permissions] = true;
            reRequest(permissions, function (x) { 
                if (hasPermission(permissions)) {
                    log('xxx');
                    onSuccess();
                } else {
                    log('yyy');
                    onFailure();
                }
            });
        } else {
            // pytany, ale nie dal dostepu, wiec wolamy onFailure
            onFailure();
        }

    } else {
        onSuccess();
    }

}

function hasPermission(permissions) {
    log("szukam uprawnien: " + permissions);
    for (var p in PERMISSIONS) {
        if (PERMISSIONS[p].permission == permissions
                && PERMISSIONS[p].status == 'granted') {
                    log("OK");
                    return true;
                }
    }
    return false;
}

// przyszla odpowiedz od uzytkownika
function onAuthResponseChange(response) {
    log('onAuthResponseChange', response);
    loginCallback(response);
}

//routing - opisuje jak maja sie zmieniac strony i ich zawartosc zgodnie z kliknieciami usera (operujemy na hashu)
//wolane zawsze w momencie kiedy mamy zmiane statusu aplikacji (a user jest zalogowany)
function route() {
    var hash = window.location.hash;
    log("window location hash:")
    log(hash);

    cleanScreen();

    switch(hash) {
        
        case "":
        case "#groups":
            log("main page");
            main("/content/groups.html", groups_main);
        break;
        case "#about":
            log("#about");
            main("/content/about.html", about_main);
        break;
        case "#notify":
            log("#notify");
            main("/content/notify.html", notify_main);
        break;
        case "#contact":
            log("#contact");
            main("/content/contact.html", contact_main);
        break;
        default:
            var files_prefix = "#files_";
            log(hash.indexOf(files_prefix));
            if (hash.indexOf(files_prefix) == 0) {
                log("#files");
                var fields = hash.split(/_/);
                log(fields[1]);
                main("/content/groups.html", function () {files_main(fields[1], fields[2], fields[3])});
            } else {
                log("404?");
                main("/content/404.html", null);
            }

    }
}

// ladujemy odpowiedni plik do containera "#page"
// po zaladowaniu wywolywany jest callback
// funkcja wspolna dla wszystkich XXX_main
// (zawsze chcemy wczytac nowy plik przed jakakolwiek akcja)
function main(file, callback) {
    log("main " + file);
    log(callback);
    $(document).trigger("load-start");
    $('#page').load(file, callback);
}
