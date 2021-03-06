// Generated by CoffeeScript 1.9.1
(function() {
  var EMBEDLY_KEY, appendDate, appendShow, convertDateFormat, endsWith, extensions, isGoogleDriveFile, prepareFile, prepareGooglePreview, prepareOtherFilePreview;

  $(function() {
    return $(document).on("click", ".file", function() {
      return window.open($(this).attr("id"), "_blank");
    });
  });

  this.files_present = function(files) {
    var info;
    $("#starred_view").fadeOut();
    if (files.length > 0) {
      return $("#view").fadeOut(function() {
        var div, file, i, len1;
        for (i = 0, len1 = files.length; i < len1; i++) {
          file = files[i];
          div = isGoogleDriveFile(file.link) ? prepareGooglePreview(files) : isFile(file.link) ? prepareFile(file) : prepareOtherFilePreview(file);
          $("#view_files").append(div);
        }
        return $("#view_files").fadeIn();
      });
    } else {
      info = $("<div/>").addClass("alert").addClass("alert-info").text("No files in this folder");
      return $("#view").fadeOut(function() {
        $("#view_files").append(info);
        return $("#view_files").fadeIn();
      });
    }
  };

  prepareGooglePreview = function(file) {
    var div, iframe, link, post, suffix;
    link = file.link;
    suffix = "/edit";
    if (endsWith(link, suffix)) {
      link = link.substring(0, link.length - suffix.length) + "/preview";
    }
    div = $("<div/>").addClass("file").attr("id", link).addClass("item");
    iframe = $("<iframe/>").attr("src", link).addClass("iframe");
    div.append(iframe);
    appendDate(div, file.date);
    post = $("<div/>").text(file.post).addClass("post");
    div.append(post);
    appendShow(div);
    return div;
  };

  prepareFile = function(file) {
    var div, extensions, filename, icon, idx, name, split, str;
    div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    extensions = ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'gz', 'jpg'];
    str = file.link;
    idx = extensions.indexOf(str.substring(str.lastIndexOf('.') + 1, str.length));
    icon = idx ? $("<img/>").addClass("icon_img").attr("src", "/images/" + extensions[idx] + ".png") : $("<img/>").addClass("icon_img").attr("src", "/images/file.png");
    div.append(icon);
    split = file.link.split("/");
    filename = split[split.length - 1];
    name = $("<div/>").addClass("name").text(decodeURIComponent(filename));
    div.append(name);
    appendDate(div, file.date);
    appendShow(div);
    return div;
  };

  prepareOtherFilePreview = function(file) {
    var a, div, post;
    div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
    a = $("<a/>").attr("href", file.link);
    a.embedly({
      key: EMBEDLY_KEY
    });
    div.append(a);
    appendDate(div, file.date);
    post = $("<div/>").text(file.post).addClass("post");
    div.append(post);
    appendShow(div);
    return div;
  };

  EMBEDLY_KEY = "0b64e3ab10db4b17ae716b327dafeb55";

  extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'odt', 'mp3', 'wav', 'jpg', 'png', 'zip', 'rar', 'gz', 'py', 'cpp', 'hpp', 'h', 'c', 'tgz'];

  isGoogleDriveFile = function(url) {
    return url.search("google.com") !== -1;
  };

  this.isFile = function(url) {
    var extension, i, len, len1, split;
    split = url.split(".");
    len = split.length;
    for (i = 0, len1 = extensions.length; i < len1; i++) {
      extension = extensions[i];
      if (len > 1 && split[len - 1] === extension) {
        return true;
      }
    }
    return false;
  };

  convertDateFormat = function(rawDate) {
    var date;
    date = new Date(rawDate);
    return (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear()) + "  " + (date.getHours()) + ":" + (date.getMinutes());
  };

  endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  appendShow = function(div) {
    return div.append($("<div/>").text("Show"));
  };

  appendDate = function(div, date) {
    return div.append($("<div/>").text(convertDateFormat(date)).addClass("date"));
  };

}).call(this);

//# sourceMappingURL=fpresent.js.map
