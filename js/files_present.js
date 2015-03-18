var extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'odt', 'mp3', 'wav', 'jpg', 'png', 'ppt', 'pptx', 'gif',
    'zip', 'rar', 'gz', 'py', 'cpp', 'hpp', 'h', 'c', 'tgz', 'gdoc', 'gsheet', 'gpres', 'gmap', 'gdraw', 'gdrive',
    'dropbox'];

$(function() {
    $(document).on("click", ".file .show-file", function () {
        window.open($(this).parent().attr("id"), "_blank"); 
    });

    $(document).on("click", ".file .preview-file", function () {

        var link = $(this).parent().attr("id");
        var dialog = $("<div/>").attr("title", "File preview");

        var iframe = $("<iframe/>").attr("src", link).addClass("iframe");
        dialog.append(iframe);

        dialog.dialog({
            width: 750,
            height: 450,
            modal: true,
            close: function () {
                dialog.remove();
            }
        });

    });
});

function setPostWidth() {

    $(".post").each(function () {
        var file = $(this).parent();
        var w = file.innerWidth();
        console.log(w);
        var used = file.find(".date").outerWidth();
        used += file.find(".file-icon-container").outerWidth();
        used += file.find(".name").outerWidth();
        used += file.find(".show").outerWidth();
        console.log(used);
        $(this).innerWidth(w - used - 100);
    });
    console.log("post setting done");
}

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
                } else if (isDropboxFile(files[i].link)) {
                    div = prepareDropboxFile(files[i]);
                }
                // teoretycznie nie obslugujemy innych hostow
                $("#view_files").append(div);
            }
            $("#view_files").fadeIn();
            setPostWidth();

        });
    } else {
        var info = $("<div/>").addClass("alert").addClass("alert-info").text("No files in this folder");
        $("#view").fadeOut(function() {
            $("#view_files").append(info);
            $("#view_files").fadeIn();
        });
    }

    $(document).trigger("load-stop");
}

function getFileIcon(fileURL, errorExt) {
    var filename = fileURL.toLowerCase();
    var idx = extensions.indexOf(filename.substring(filename.lastIndexOf('.')+1,filename.length))
    var filetype;
    if (idx != -1) {
        filetype = extensions[idx];
    } else {
        filetype = errorExt;
    }
    var div = $("<div/>").addClass("file-icon-container");
    var icon = $("<div/>").addClass("file-icon").attr("data-type", filetype);
    div.append(icon);
    return div;
}

function getShowButton() {
    var div = $("<div/>").addClass("show-file");
    var show = $("<a/>").text("Show").attr("title", "Get the file");
    div.append(show);
    return div;
}
function getPreviewButton() {
    var div = $("<div/>").addClass("preview-file");
    var show = $("<a/>").text("Preview").attr("title", "See the preview of the file");
    div.append(show);
    return div;
}

function getGoogleFileExtension(fileURL) {
    if (fileURL.indexOf("document") != -1) {
        return "file.gdoc";
    } else if (fileURL.indexOf("presentation") != -1) {
        return "file.gpres";
    } else if (fileURL.indexOf("spreadsheet") != -1) {
        return "file.gsheet";
    } else if (fileURL.indexOf("maps") != -1) {
        return "file.gmap";
    } else if (fileURL.indexOf("drawings") != -1) {
        return "file.gdraw";
    } else {
        return "file.gdrive";
    }
}

function prepareGooglePreview(file) {
    var link = file.link;
    var suffix = "/edit";
    if (endsWith(link, suffix)) {
        link = link.substring(0, link.length - suffix.length) + "/preview";
    }
    var div = $("<div/>").addClass("file").attr("id", link).addClass("item");
    var icon = getFileIcon(getGoogleFileExtension(file.link), "gdrive");
    div.append(icon);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    if (file.post.length > 0) {
        var post = $("<div/>").text(file.post).addClass("post");
        div.append(post);
    }

    div.append(getShowButton());
    div.append(getPreviewButton());
    return div;
}

function prepareDropboxFile(file) {
    var div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    var split = file.link.split("/");
    var filename = split[split.length-1].split("?")[0];
    var icon = getFileIcon(filename, "dropbox");
    div.append(icon);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    var name = $("<div/>").addClass("name").text("Dropbox: " + decodeURIComponent(filename));
    div.append(name);
    if (file.post.length > 0) {
        var post = $("<div/>").text(file.post).addClass("post");
        div.append(post);
    }

    div.append(getShowButton());
    return div;
}

function prepareFile(file) {
    var div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    var icon = getFileIcon(file.link, "other");
    div.append(icon);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    var split = file.link.split("/");
    var filename = split[split.length-1];
    var name = $("<div/>").addClass("name").text(decodeURIComponent(filename));
    div.append(name);
    if (file.post.length > 0) {
        var post = $("<div/>").text(file.post).addClass("post");
        div.append(post);
    }

    div.append(getShowButton());
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

    div.append(getShowButton());
    div.append(getPreviewButton());
    return div;
}

// CONSTANTS and UTILS ============================================================

var EMBEDLY_KEY = "0b64e3ab10db4b17ae716b327dafeb55";   

function isGoogleDriveFile(url) {
    if (url.search("google.com") !== -1)
        return true;
    return false;
}
function isDropboxFile(url) {
    if (url.search("dropbox.com") !== -1)
        return true;
    return false;
}

function isFile(url) {
    var split = url.split(".");
    var len = split.length;
    for (var i = 0; i < extensions.length; i++) {
        if (len > 1 && split[len-1].toLowerCase() === extensions[i]) return true;
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
