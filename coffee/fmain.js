// Generated by CoffeeScript 1.9.1
(function() {
  var addToFiles, checkIfFile, fileInfo, processFiles, processPosts;

  fileInfo = function(link, post, date, from) {
    return {
      'link': link,
      'post': post,
      'date': date,
      'from': from
    };
  };

  this.files_main = function(groupId) {
    var before;
    before = $("<a/>").attr("href", "#").text("Show all folders").addClass("back_to_root");
    $("h1").before(before);
    console.log("files_main for " + groupId);
    FB.api('/' + groupId + '/feed', function(response) {
      var files;
      console.log(response);
      files = processPosts(response['data']);
      return FB.api('/' + groupId + '/files', function(resp) {
        files = files + processFiles(resp);
        return files_present(files);
      });
    });
    return FB.api('/' + groupId, function(nameRes) {
      console.log("nameRes:" + nameRes);
      return $("h1").text(nameRes.name);
    });
  };

  processFiles = function(resp) {
    var d, file, files;
    console.log(resp);
    d = resp['data'];
    files = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = d.length; i < len; i++) {
        file = d[i];
        results.push(fileInfo(file.download_link, '', file.updated_time, file.from));
      }
      return results;
    })();
    console.log(files);
    return files;
  };

  processPosts = function(data) {
    var comment, files, i, item, j, k, len, len1, len2, post, posts, ref;
    files = [];
    posts = [];
    for (i = 0, len = data.length; i < len; i++) {
      item = data[i];
      if (item.comments != null) {
        ref = item.comments.data;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          comment = ref[j];
          console.log(comment);
          posts.push(comment);
        }
      }
      posts.push(data);
    }
    console.log(posts);
    for (k = 0, len2 = posts.length; k < len2; k++) {
      post = posts[k];
      addToFiles(files, post);
    }
    return files;
  };

  addToFiles = function(files, post) {
    var i, inPost, len, link, link_reg, msg, results;
    msg = post.message;
    link_reg = /http\S*/;
    inPost = link_reg.exec(msg);
    if (inPost) {
      results = [];
      for (i = 0, len = inPost.length; i < len; i++) {
        link = inPost[i];
        if (checkIfFile(link)) {
          results.push(files.push(fileInfo(link, msg, post.created_time, post.from)));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  checkIfFile = function(fileName) {
    var file_hosting_prefixes, hosting_prefix, i, len;
    file_hosting_prefixes = ['https://docs.google', 'https://drive.google', 'https://www.dropbox.com/s'];
    for (i = 0, len = file_hosting_prefixes.length; i < len; i++) {
      hosting_prefix = file_hosting_prefixes[i];
      if (fileName.indexOf(hosting_prefix) === 0) {
        return true;
      }
    }
    return isFile(fileName);
  };

}).call(this);

//# sourceMappingURL=fmain.js.map
