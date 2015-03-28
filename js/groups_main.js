function groups_main() {
    log('groups_main');

    $('#view_files').fadeOut(function () {
        $(this).empty();
        $('h1').text('Your group folders');
        $('#view').fadeIn();
        $('#starred_view').fadeIn();

        fetchGroups();
    });
    $('.back_to_root').remove();

    $('#search_box').keyup(filter);
}


function fetchGroups() {
    FB.api('/me?fields=id,name,updated_time,groups.icon_size(34){id,name,icon,updated_time}',
        function(response) {
            log(response);

            var groups = response.groups.data;
            log(groups);

            if (response.groups.paging['next']) {
                log('there might be something more!');
            }

            syncGroups_cache(groups);
            presentFolders();
        });
}

// TODO: remove from localStorage groups that have been deleted on FB? (rare use-case :)
function syncGroups_cache(groups) {
    var gdict = localStorage.getItem('groups');
    gdict = !gdict ? {} : JSON.parse(gdict);

    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        if (!gdict[group.id]) {
            gdict[group.id] = {
                'seq': i,
                'name': group.name,
                'lastUpdate': group.updated_time,
                'icon': group.icon,
                'starred': false
            }
        }
    }

    log('local storage groups', gdict);
    localStorage.setItem('groups', JSON.stringify(gdict));
}

/* Modifies the group data identified by gid
   with the specified function in-place */
function updateGroup_cache(gid, modFun) {
    var gdict = JSON.parse(localStorage.getItem('groups'));
    log(gdict[gid]);

    modFun(gdict[gid]);
    localStorage.setItem('groups', JSON.stringify(gdict));
}

/* Returns group ids sorted by seq number. */
function sortedGroupIds(gdict) {
    var groupIds = [];
    for (var gid in gdict) groupIds.push(gid);
    return groupIds.sort(function(a, b){ return gdict[a].seq - gdict[b].seq });
}

/* For each group in the localStorage, creates an appropriate DOM element
   and appends it to the #view or #starred_view DIV. */
function presentFolders() {
    log('present folders');

    $('#view').empty();
    $('#starred_view').empty();

    var gdict = JSON.parse(localStorage.getItem('groups'));

    // There are no guarantees in JS as to the order in which
    // object attributes will be iterated inside a for..in loop,
    // hence we need to introduce some ordering.
    $.each(sortedGroupIds(gdict), function(idx, gid){

        var div  = $('<div/>', { 'class': 'folder item', 'id': gid });
        var icon = $('<div/>', { 'class': 'icon' });
        var img  = $('<img/>', { 'src': gdict[gid].icon });
        var name = $('<div/>', { 'class': 'name', 'text': gdict[gid].name });
        var a    = $('<a/>', { 'href': '#files_'+gid });
        var star = createStarElement(gid);

        div
            .append(star)
            .append(a
                .append(icon.append(img))
                .append(name));

        if (gdict[gid].starred) {
            $('span', star).addClass('glyphicon-star');
            $('#starred_view').append(div);
        } else {
            $('span', star).addClass('glyphicon-star-empty');
            $('#view').append(div);
        }
    });

    $(document).trigger('load-stop');
}

function createStarElement(gid) {
    var star = $('<button/>')
        .addClass('btn btn-link')
        .attr('data-gid', gid)
        .html('<span class="glyphicon"></span>');

    star.click(function() {
        var gidStr = $(this).attr('data-gid');
        var gid = Number(gidStr);
        log(gid);

        updateGroup_cache(gid, function(group){ group.starred = !group.starred });

        presentFolders();
        $('#search_box').val('');
    });

    return star;
}

/* Escapes special characters from the provided string. */
function escapeSpecials(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
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
