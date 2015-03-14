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

function prepareGooglePreview(file) {
    var div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    var iframe = $("<iframe/>").attr("src", file.link).addClass("iframe");
    div.append(iframe);
    var date = $("<div/>").text(convertDateFormat(file.date)).addClass("date");
    div.append(date);
    var post = $("<div/>").text(file.post).addClass("post");
    div.append(post);
    var link = $("<div/>").text("Show");
    div.append(link);
    return div;
}

function prepareFile(file) {
    var div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    var extensions = ['pdf', 'doc', 'docx', 'txt','zip', 'rar', 'gz', 'jpg'];
    var str = file.link
    var idx = extensions.indexOf(str.substring(str.lastIndexOf('.')+1,str.length))
    var icon;
    if(idx != -1){
    	icon = 	$("<img/>").addClass("icon_img").attr("src","/static/icons/"+extensions[idx]+".png");
    } else {
    	icon = 	$("<img/>").addClass("icon_img").attr("src","/static/file.png");
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

function present_files(files) {
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


function present_folders(folders) {
    console.log("present folders");
    console.log(folders);
    $("#view").empty();
    $("#starred_view").empty();
    for (var i = 0; i < folders.length; i++) {
        var div = $("<div/>").addClass("folder").attr("id", folders[i].id).addClass("item");
        var a = $("<a/>").attr("href", "#"+folders[i].id);
        var icon = $("<div/>").addClass("icon");
        var img = $("<img/>").attr("src", folders[i].icon);
        
        var star = $("<button/>").addClass("btn").addClass("btn-link");
        star.attr('data', folders[i].id);
        star.html('<span class="glyphicon"></span>');
        div.append(star);
        star.click(function() {
        	var idd = $(this).attr("data");
        	var div = $('#'+idd);
  			div.remove();
  			console.log(idd);
  			
  			id_num = Number(idd);
  			console.log(id_num);
  			var gdict = JSON.parse(localStorage.getItem("groups"));
  			console.log(gdict[id_num]);
  			starred = gdict[id_num].starred;
//   			if(starred){
//   				$("#view").append(div);
//   			} else {
//   				$("#starred_view").append(div);
//   			}
  			gdict[id_num].starred = !starred;
  			localStorage.setItem('groups', JSON.stringify(gdict));
  			getGroups();
		});
        icon.append(img);
        a.append(icon);
        var name = $("<div/>").addClass("name").text(folders[i].name);
        a.append(name);
        div.append(a);
        if(gdict[folders[i].id].starred){
        	$("#starred_view").append(div);
        	//star.addClass("starred");
            $('span',star).addClass('glyphicon-star');

        } else {
            $('span',star).addClass('glyphicon-star-empty');
        	$("#view").append(div);
        }
        
    }
}
function show_content() {
    console.log("show content enter");
    var hash = window.location.hash;
    if (hash.length > 1) {
        var group_id = hash.substring(1);
        var before = $("<a/>").attr("href", "#").text("Show all folders").addClass("back_to_root");

        $("h1").before(before);
        displayFolder(group_id);
    } else {
        $("#view_files").fadeOut(function () {
            $(this).empty();
            $("h1").text("Your group folders");
            $("#view").fadeIn();
            $("#starred_view").fadeIn();
            getGroups();
        });
        $(".back_to_root").remove();
    }
}

function convertDateFormat(rawDate) {
    var date = new Date(rawDate);
    return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear()
        + ' ' + date.getHours() + ':' + date.getMinutes();
}

$(function() {
    //show_content();

    $(document).on("click", ".file", function () {
        window.open($(this).attr("id"), "_blank"); 
    });
});
