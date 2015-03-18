var publish_perm = 'publish_actions';

function notify_main() {
    console.log("notify_main");

    reRequestPermissions(publish_perm, function () {
        console.log("mam permsy");
        $('#notify').click(sendNotification);
        populateGroups();	
    }, function () {
        //przenosimy usera na strone glowna, jesli nie chce nam pozwolic pisac
        window.location.href = window.location.origin + "/#groups";
    });

}

function populateGroups() {
    var groupdown = $('#groupdown');
    var groups = JSON.parse(localStorage.getItem('groups'));
    $.each(groups, function(id, group) {
        groupdown.append($('<option />').val(id).text(group.name));
    });
    $(document).trigger("load-stop");
}

function sendNotification() {
    var groupId = $('#groupdown').val();
    var fullMsg = $('#post').val() + '\n' + $('#link').val();
    console.log('sending.. ' + groupId);
    console.log(fullMsg);

    FB.api(
            '/' + groupId + '/feed',
            'POST',
            {
                'message': fullMsg
            },
            function(response) {
                console.log(response.error);
                $(".form").find("select, input[type=text], textarea").val("");
                if (response.error) {
                    var error = $("<div/>").addClass("alert").addClass("alert-warning").html("<b>Error:</b>" + response.error);
                    $(".form").before(error);
                } else {
                    var success = $("<div/>").addClass("alert").addClass("alert-success").text("Notification pushed successfully");
                    $(".form").before(success);
                }
            }
          );
}
