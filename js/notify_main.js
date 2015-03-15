function notify_main() {
    console.log("notify_main");

    $('#notify').click(sendNotification);
    populateGroups();	
}

function populateGroups() {
    var groupdown = $('#groupdown');
    var groups = JSON.parse(localStorage.getItem('groups'));
    $.each(groups, function(id, group) {
        groupdown.append($('<option />').val(id).text(group.name));
    });
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
                $(".form").empty();
                if (response.error) {
                    var error = $("<div/>").addClass("alert").addClass("alert-warning").html("<b>Error:</b>" + response.error);
                    $(".form").append(error);
                } else {
                    var success = $("<div/>").addClass("alert").addClass("alert-success").text("Notification pushed successfully");
                    $(".form").append(success);
                }
            }
          );
}
