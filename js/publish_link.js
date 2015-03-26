$(document).ready(function() {
        $('#notify').click(send_notification);

        populate_groups();
});

function populate_groups() {
    var groupdown = $('#groupdown');
    var groups = JSON.parse(localStorage.getItem('groups'));
    $.each(groups, function(id, group) {
        groupdown.append($('<option />').val(id).text(group.name));
    });
}

function send_notification() {
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
