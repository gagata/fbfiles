function groups_main() {
    console.log("groups_main");

    $("#view_files").fadeOut(function () {
        $(this).empty();
        $("h1").text("Your group folders");
        $("#view").fadeIn();
        $("#starred_view").fadeIn();
        getAllGroups();
    });
    $(".back_to_root").remove();

    $('#search_box').keyup(filter);
}


function getAllGroups() {
    FB.api('/me?fields=id,name,updated_time,groups.icon_size(34){id,name,icon,updated_time}',
        function(response) {
            console.log(response);

            var groups = response.groups.data;
            console.log(groups);

            if (response.groups.paging['next']) {
                console.log("there might be something more!");
            }

            updateGroups_cache(groups);
            present_folders(groups);
        });
}

function updateGroups_cache(groups) {
    gdict = localStorage.getItem("groups");
    if (!gdict) {
        gdict = {}
    } else {
        gdict = JSON.parse(gdict);
    }

    for(var i=0; i<groups.length; i++){
        var group = groups[i];
        if(!gdict[group['id']]){
            gdict[group['id']] = { 'name':group['name'], 'lastUpdate':group['updated_time'],
                'icon':group['icon'], 'starred':false }
        }
    }

    console.log("local storage groups", gdict);
    localStorage.setItem("groups", JSON.stringify(gdict));
}

function invertStar_cache(id_num) {
    var gdict = JSON.parse(localStorage.getItem("groups"));
    console.log(gdict[id_num]);
    var starred = gdict[id_num].starred;
    gdict[id_num].starred = !starred;
    localStorage.setItem('groups', JSON.stringify(gdict));
}

//called from login.js
function present_folders(folders) {
    console.log("present folders", folders);
    $("#view").empty();
    $("#starred_view").empty();

    var gdict = JSON.parse(localStorage.getItem("groups"));

    for (var i = 0; i < folders.length; i++) {
        var div = $("<div/>").addClass("folder").attr("id", folders[i].id).addClass("item");
        var a = $("<a/>").attr("href", "#files_"+folders[i].id);
        var icon = $("<div/>").addClass("icon");
        var img = $("<img/>").attr("src", folders[i].icon);
        
        var star = htmlStar(folders[i].id);
        div.append(star);
        icon.append(img);
        a.append(icon);
        var name = $("<div/>").addClass("name").text(folders[i].name);
        a.append(name);
        div.append(a);

        if(gdict[folders[i].id].starred){
            $('span', star).addClass('glyphicon-star');
            $("#starred_view").append(div);
        } else {
            $('span', star).addClass('glyphicon-star-empty');
            $("#view").append(div);
        }
    }

    $(document).trigger("load-stop");
}

function htmlStar(folderId) {
    var star = $("<button/>").addClass("btn").addClass("btn-link");
    star.attr('data', folderId);
    star.html('<span class="glyphicon"></span>');

    star.click(function() {
        var idd = $(this).attr("data");
        $('#'+idd).remove();
        var id_num = Number(idd);
        console.log(id_num);
        invertStar_cache(id_num);
        getGroups();
        $("#search_box").val("");
    });
    return star;
}

/* Escapes special characters from the provided string. */
function escapeSpecials(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/* Shows the elements of class 'item' that contain the
   search query either in their 'name' or 'post' field,
   and hides the remaining ones. */ 
function filter() {
    var query = $('#search_box').val();
    var escapedQuery = escapeSpecials(query);
    var regex = new RegExp(escapedQuery, 'i');

    $('.item').each(function() {
        if (query == null ||
            ($(this).find('.name').length > 0 && $(this).find('.name').html().match(regex)) ||
            ($(this).find('.post').length > 0 && $(this).find('.post').html().match(regex))) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
