function files_main(groupId, postsEndDate, filesEndDate) {
    var now = Date.now();
    postsEndDate = postsEndDate ? postsEndDate : now;
    //filesEndDate = filesEndDate ? filesEndDate : now;
    console.log('postsEndDate', postsEndDate);

    loadUntil(postsEndDate, '/'+groupId+'/feed', now, 'cacheFeed_'+groupId, processPosts, [], function (filesFromPosts, analysedUntil, wasMorePosts) {
        console.log('filesFrom', filesFromPosts, 'analysedUntil', analysedUntil, 'wasMorePosts', wasMorePosts);

        var limitReqFiles = 20;
        getSome('/' + groupId + '/files', limitReqFiles, 'cacheFiles_'+groupId, processFiles, function (fbFiles, filesUntil, wasMoreFiles) {
            if (wasMorePosts || wasMoreFiles) {
                console.log('wasMorePosts', wasMorePosts, 'wasMoreFiles', wasMoreFiles);
                var dateOfNextThingsToLoad = Date.parse(analysedUntil)-2000; /* that's -2 seconds */
                var showMore = $("<a/>").attr("href", '#files_'+groupId+'_'+dateOfNextThingsToLoad+'_'+10)
                    .attr("title", "Show more").html("Show more");
                $("#groups").append(showMore);
            }

            var files = filesFromPosts.concat(fbFiles);
            console.log(files);
            sortByDate(files);
            files_present(files)
        });

    });

    addNavigation(groupId);
}

function addNavigation(groupId) {
    var before = $("<a/>").attr("href", "#").attr("title", "Back to folders view").html('<div class="button_label">To folders</div>')
        .addClass("back_to_root glyphicon glyphicon-arrow-left");
    var clip_button = $("<a/>").attr("title", "Get a share link").html('<div class="button_label">Share link</div>')
        .addClass("glyphicon glyphicon-paperclip").attr("id", "share");

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

    $("h1").before(before).before(clip_button);

    FB.api('/'+groupId, function(nameRes) {
        console.log("nameRes:" + nameRes);
        $("h1").text(nameRes.name);
    });

    $('#search_box').keyup(filter);
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
/** loadUntil(dateEnd=1428073419233, fbApiUrl='/297552950255132/feed', untilDate=1428073419233, ...)
 *  withResult([files], '2015-02-05T12:13:08+0000', true) */
function loadUntil(dateEnd, fbApiUrl, untilDate, cacheName, processResponse, result, withResult) {
    var untilDateInSec = Math.round(untilDate/1000);
    getSome(fbApiUrl+'?until='+untilDateInSec, 5, cacheName, processResponse, function(filesFromPosts, analysedUntil, wasMore) {
        result = result.concat(filesFromPosts);
        var analysedUntilSecs = Date.parse(analysedUntil);
        console.log('dateEnd', dateEnd, 'analysedUntil', analysedUntilSecs);
        if (dateEnd < analysedUntilSecs && wasMore) {
            console.log('I wanted to go here');
            loadUntil(dateEnd, fbApiUrl, analysedUntilSecs, cacheName, processResponse, result, withResult);
        } else {
            withResult(result, analysedUntil, wasMore);
        }
    });
}
/** withResult([files], '2015-02-05T12:13:08+0000', true) */
function getSome(fbApiUrl, limit, cacheName, processResponse, withResult) {
    FB.api(fbApiUrl, function (response) {
        console.log("fb api", fbApiUrl, response);
        var data = response['data'];
        var startDate = data[0]['updated_time'];
        var endDate = data[data.length-1]['updated_time'];
        _getSomeMore(startDate, response, [], cacheName, endDate, limit, processResponse, withResult);
    });
}
/** withResult([files], '2015-02-05T12:13:08+0000', true) */
function _getSomeMore(startDate, response, result, cacheName, endDate, limit, processResponse, withResult) {
    console.log("get some more: response", response);
    var response_data = response['data'];
    var processed = processResponse(response_data);
    console.log("response processed:", processed);
    result = result.concat(processed);

    var paging = response['paging'];

    var oldestEntry = response_data[response_data.length-1];
    if (oldestEntry) {
        endDate = oldestEntry['updated_time'];
    }
    var cachedToDate = cacheEntryFrom(cacheName, endDate);
    if (cachedToDate) {
        /* if we have something cached load it and stop downloading more */
        console.log('we had it cached, date:', cachedToDate[0], 'files', cachedToDate[1]);
        result = result.concat(cachedToDate[1]);
        var dateUntil = cachedToDate[0];
        cacheUpdate(cacheName, startDate, dateUntil, result);
        withResult(result, dateUntil, (paging && paging['next']) ? true : false);
    } else if (paging && paging['next'] && limit > 0) {
        /* if nothing cached and there is more to load, do */
        $.get(paging['next'], function (data) {
            _getSomeMore(startDate, data, result, cacheName, endDate, limit-1, processResponse, withResult);
        });
    } else {
        /* if there is nothing cached and nothing more to load, do */
        cacheUpdate(cacheName, startDate, endDate, result);
        withResult(result, endDate, (paging && paging['next']) ? true : false);
    }
}

function cacheEntryFrom(cacheName, date) {
    var groupCacheStr = localStorage.getItem(cacheName);
    if (groupCacheStr) {
        var groupCache = JSON.parse(groupCacheStr);
        for (var i=0; i<groupCache.length; i++) {
            var entry = groupCache[i];
            console.log("compare dateStart", entry.dateStart, "with ", date, "and ", entry.dateEnd);
            if (entry.dateStart >= date && date > entry.dateEnd) {
                var filtered = entry.files.filter(function (elem, index, arr) {
                    return (elem.date <= date);
                });
                return [entry.dateEnd, filtered];
            }
        }
    }
    return null;
}

function cacheUpdate(cacheName, dateStart, dateEnd, result) {
    var groupCacheStr = localStorage.getItem(cacheName);
    if (!groupCacheStr) {
        groupCacheStr = '[]';
    }
    var groupCache = JSON.parse(groupCacheStr);
    groupCache.push({dateStart: dateStart, dateEnd: dateEnd, files: result});
    groupCache = combineRanges(groupCache);
    console.log("groupCache", groupCache);

    localStorage.setItem(cacheName, JSON.stringify(groupCache));
}

function combineRanges(xs) {
    console.assert(xs);
    xs.sort(dynamicSort('-dateStart'));
    var current = xs[0];
    var combined = [];
    for (var i=1; i<xs.length; i++) {
        var x = xs[i];
        if (current.dateStart >= x.dateStart && x.dateStart >= current.dateEnd) {
            current.dateStart = max(current.dateStart, x.dateStart);
            current.dateEnd = min(current.dateEnd, x.dateEnd);
            current.files = combineOn('date', current.files, x.files);
        } else {
            combined.push(current);
            current = x;
        }
    }
    combined.push(current);
    return combined;
}

function combineOn(field, xs, ys) {
    var combinedMap = listToMap(xs, field);
    for (var j=0; j<ys.length; j++) {
        var y = ys[j];
        combinedMap[y[field]] = y;
    }
    return mapValues(combinedMap);
}

//I mean really, the only thing that js has is `Math.min`!!?
function min(x,y) {
    return x < y ? x : y;
}

function max(x,y) {
    return x > y ? x : y;
}
// I seriously hate javascript!
function mapValues(map) {
    var res = [];
    for (var key in map) {
        res.push(map[key]);
    }
    return res;
}

function listToMap(list, field) {
    var map = {};
    for (var i=0; i<list.length; i++) {
        map[list[i][field]] = list[i];
    }
    return map;
}

//function captureLink(text) {
//    log("captureLink " + text);
//    var client = new ZeroClipboard( document.getElementById(text) );
//
//    client.on( "ready", function( readyEvent ) {
//         alert( "ZeroClipboard SWF is ready!" );
//
//        client.on( "aftercopy", function( event ) {
//            // `this` === `client`
//            // `event.target` === the element that was clicked
//            event.target.style.display = "none";
//            alert("Copied : " + event.data["text/plain"] );
//        } );
//    } );
//}

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