var publish_perm = 'publish_actions';

function notify_main() {
    log("notify_main");

    reRequestPermissions(publish_perm, function () {
        log("mam permsy");
        $('#notify').click(sendNotification);
        populateGroups();	
    }, function () {
        //przenosimy usera na strone glowna, jesli nie chce nam pozwolic pisac
        window.location.href = window.location.origin + "/#groups";
    });
}

function populateGroups() {
    var groupdown = $('#groupdown');
    var gdict = JSON.parse(localStorage.getItem('groups'));

    $.each(gdict, function(gid, group) {
        groupdown.append($('<option />').val(gid).text(group.name));
    });

    $(document).trigger("load-stop");
}

function sendNotification() {
    var groupId = $('#groupdown').val();
    var fullMsg = $('#post').val() + '\n' + $('#link').val();
    log('sending.. ' + groupId);
    log(fullMsg);

    FB.api(
            '/' + groupId + '/feed',
            'POST',
            {
                'message': fullMsg
            },
            function(response) {
                log(response.error);
                $(".form").find("select, input[type=text], textarea").val("");
                if (response.error) {
                    var error = $("<div/>")
                        .addClass("alert alert-warning")
                        .html("<b>Error:</b>" + response.error);
                    $(".form").before(error);
                } else {
                    var success = $("<div/>")
                        .addClass("alert alert-success")
                        .text("Notification pushed successfully");
                    $(".form").before(success);
                }
            }
          );
}
