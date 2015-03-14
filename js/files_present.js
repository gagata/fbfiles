$(function() {
    $(document).on("click", ".file", function () {
        window.open($(this).attr("id"), "_blank"); 
    });
});

function files_present(files) {
    $("#starred_view").fadeOut();
    if (files.length > 0) {
        $("#view").fadeOut(function() {
            for (var i = 0; i < files.length; i++) {
                var div;
                if (isGoogleDriveFile(files[i].link)) {
                    div = prepareGooglePreview(files[i]);
                } else if (isFile(files[i].link)) {
                    div = prepareFile(files[i]);
                } else {
                    div = prepareOtherFilePreview(files[i]);
                }
                $("#view_files").append(div);
            }
            $("#view_files").fadeIn();

        });
    } else {
        var info = $("<div/>").addClass("alert").addClass("alert-info").text("No files in this folder");
        $("#view").fadeOut(function() {
            $("#view_files").append(info);
            $("#view_files").fadeIn();
        });
    }
}

function prepareGooglePreview(file) {
    var link = file.link;
    var suffix = "/edit";
    if (endsWith(link, suffix)) {
        link = link.substring(0, link.length - suffix.length) + "/preview";
    }
    var div = $("<div/>").addClass("file").attr("id", link).addClass("item");
    var iframe = $("<iframe/>").attr("src", link).addClass("iframe");
    div.append(iframe);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    var post = $("<div/>").text(file.post).addClass("post");
    div.append(post);
    var show = $("<div/>").text("Show");
    div.append(show);
    return div;
}

function prepareFile(file) {
    var div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    var extensions = ['pdf', 'doc', 'docx', 'txt','zip', 'rar', 'gz', 'jpg'];
    var str = file.link
    var idx = extensions.indexOf(str.substring(str.lastIndexOf('.')+1,str.length))
    var icon;
    if(idx != -1){
        icon =  $("<img/>").addClass("icon_img").attr("src","/images/"+extensions[idx]+".png");
    } else {
        icon =  $("<img/>").addClass("icon_img").attr("src","/images/file.png");
    }
     
    div.append(icon);
    var split = file.link.split("/");
    var filename = split[split.length-1];
    var name = $("<div/>").addClass("name").text(decodeURIComponent(filename));
    div.append(name);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    var link = $("<div/>").text("Show");
    div.append(link);
    return div;
}

function prepareOtherFilePreview(file) {
    var div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    var a = $("<a/>").attr("href", file.link);
    a.embedly({
        key: EMBEDLY_KEY
    });
    div.append(a);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    var post = $("<div/>").text(file.post).addClass("post");
    div.append(post);
    var link = $("<div/>").text("Show");
    div.append(link);
    return div;
}

// CONSTANTS and UTILS ============================================================

var EMBEDLY_KEY = "0b64e3ab10db4b17ae716b327dafeb55";   
var extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'odt', 'mp3', 'wav', 'jpg', 'png',
    'zip', 'rar', 'gz', 'py', 'cpp', 'hpp', 'h', 'c', 'tgz'];

function isGoogleDriveFile(url) {
    if (url.search("google.com") !== -1)
        return true;
    return false;
}

function isFile(url) {
    var split = url.split(".");
    var len = split.length;
    for (var i = 0; i < extensions.length; i++) {
        if (len > 1 && split[len-1] === extensions[i]) return true;
    }
    return false;
}

function convertDateFormat(rawDate) {
    var date = new Date(rawDate);
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
        + ' ' + date.getHours() + ':' + date.getMinutes();
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
