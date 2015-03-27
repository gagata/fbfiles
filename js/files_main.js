function files_main(groupId, limitReqPosts, limitReqFiles) {

    limitReqPosts = limitReqPosts ? limitReqPosts : 4;
    limitReqFiles = limitReqFiles ? limitReqFiles : 4;
    console.log('limitReqPosts',limitReqPosts);
    var before = $("<a/>").attr("href", "#").attr("title", "Back to folders view")
        .addClass("back_to_root glyphicon glyphicon-arrow-left");
    var clip_button = $("<a/>").attr("title", "Get a share link")
        .addClass("glyphicon glyphicon-paperclip").attr("id", "share");
    $("h1").before(before).before(clip_button);

    getSome('/'+groupId+'/feed', limitReqPosts, processPosts, function(filesFromPosts, wasMorePosts) {
        getSome('/' + groupId + '/files', limitReqFiles, processFiles, function (fbFiles, wasMoreFiles) {
            if (wasMorePosts || wasMoreFiles) {
                console.log('wasMorePosts', wasMorePosts, 'wasMoreFiles', wasMoreFiles);
                var showMore = $("<a/>").attr("href", '#files_'+groupId+'_'+20+'_'+10)
                    .attr("title", "Show more").html("Show more");
                $("#groups").append(showMore);
            }

            var files = filesFromPosts.concat(fbFiles);
            console.log(files);
            sortByDate(files);
            files_present(files)
        });
    } );

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

function processFiles(d) {
    var files = [];
    for (var k = 0; k < d.length; k++) {
        files.push({
            'link': d[k].download_link,
            'post': '',
            'date': d[k].updated_time,
            'from': d[k].from
        });
    }
    return files;
}

function getSome(fbApiUrl, limit, processResponse, withResult) {
    FB.api(fbApiUrl, function (response) {
        console.log("fb api", fbApiUrl, response);

        _getSomeMore(response, [], limit, processResponse, withResult);
    });
}

function _getSomeMore(response, result, limit, processResponse, withResult) {
    console.log("get some more: response", response);
    var processed = processResponse(response['data']);
    console.log("response processed:", processed);
    result = result.concat(processed);

    var paging = response['paging'];

    if (paging && paging['next'] && limit > 0) {
        $.get(paging['next'], function (data) {
            _getSomeMore(data, result, limit-1, processResponse, withResult);
        });
    } else {
        withResult(result, (paging && paging['next']) ? true : false);
    }
}

function captureLink(text) {
    log("captureLink " + text);
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
                log(comments[j]);
                posts.push(comments[j]);
            }
        }
        posts.push(data[i]);
    }
    log(posts);
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

function sortByDate(files) {
    files.sort(dynamicSort('-date'));
}

// This is why we hate js!

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}