function files_main(groupId) {
    var before = $("<a/>").attr("href", "#").attr("title", "Back to folders view").addClass("back_to_root").addClass("glyphicon glyphicon-arrow-left");
    var clip_button = $("<a/>").attr("title", "Get a share link").addClass("glyphicon glyphicon-paperclip").attr("id", "share");
    $("h1").before(before).before(clip_button);

    console.log("files_main for " + groupId);
    FB.api('/'+groupId+'/feed', function (response) {
        console.log(response);

        var files = processPosts(response['data']);

        FB.api('/'+groupId+'/files', function(resp) {
            console.log(resp);
            var d = resp['data'];
            for (var k = 0; k < d.length; k++) {
                files.push({
                    'link': d[k].download_link, 
                    'post': '',
                    'date': d[k].updated_time,
                    'from': d[k].from
                });
            }
            console.log(files);
            //in files_present.js
            files_present(files);
        });
    });

    FB.api('/'+groupId, function(nameRes) {
        console.log("nameRes:" + nameRes);
        $("h1").text(nameRes.name);
    });
    $('#search_box').keyup(filter);

    clip_button.click(function () {
        var dialog = $("<div/>").attr("title", "Get a link to this folder");
        dialog.load("/content/share_link_dialog.html", function () {
            dialog.find("#share_link_input").val(window.location.href);
            dialog.dialog({
                width: 500,
                modal: true,
                close: function () {
                    dialog.remove();
                }
            });
        });
    });
}

function captureLink(text) {
    console.log("captureLink " + text);
    var client = new ZeroClipboard( document.getElementById(text) );

    client.on( "ready", function( readyEvent ) {
         alert( "ZeroClipboard SWF is ready!" );

        client.on( "aftercopy", function( event ) {
            // `this` === `client`
            // `event.target` === the element that was clicked
            event.target.style.display = "none";
            alert("Copied : " + event.data["text/plain"] );
        } );
    } );
}

function processPosts(data) {
    var posts = [];
    var files = [];
    for(var i=0; i<data.length; i++){
        if(data[i].comments){
            var comments = data[i].comments.data;
            for(var j=0; j<comments.length; j++){
                console.log(comments[j]);
                posts.push(comments[j]);
            }
        }
        posts.push(data[i]);
    }
    console.log(posts);
    for(var i=0; i<posts.length; i++){
        addToFiles(files, posts[i]);
    }
    return files;
}

function addToFiles(files, item){
    var msg = item.message;
    var link_reg = /http\S*/;
    var myArray = link_reg.exec(msg);
    if(myArray){
        for(var j=0; j<myArray.length; j++){
            if(checkIfFile(myArray[j])){
                files.push({
                    'link': myArray[j], 
                    'post': msg,
                    'date': item.created_time,
                    'from': item.from
                });
            }
        }
    }
}

function checkIfFile(fileName){
    var file_hosting_prefixes = ['https://docs.google', 'https://drive.google','https://www.dropbox.com/s'];
    for(var i=0; i<file_hosting_prefixes.length; i++){
        if(fileName.indexOf(file_hosting_prefixes[i]) === 0){
            return true;
        }
    }
    return isFile(fileName);
}
