fileInfo = (link, post, date, from) -> {'link':link, 'post':post, 'date':date, 'from':from}

@files_main = (groupId) ->
    before = $("<a/>").attr("href", "#").text("Show all folders").addClass("back_to_root")
    $("h1").before(before)
    console.log("files_main for " + groupId)
    FB.api('/'+groupId+'/feed', (response) ->
        console.log(response)
        files = processPosts(response['data'])
        FB.api('/'+groupId+'/files', (resp) ->
            files = files  + processFiles(resp)
            files_present(files)
        )
    )
    FB.api('/'+groupId, (nameRes) ->
      console.log("nameRes:" + nameRes);
      $("h1").text(nameRes.name);
    )

processFiles = (resp) ->
  # @return {array}
  console.log(resp)
  d = resp['data']
  files = for file in d
    fileInfo(file.download_link, '', file.updated_time, file.from)
  console.log(files)
  files

processPosts = (data) ->
    files = [] #return
    posts = []
    for item in data
      if item.comments?
        for comment in item.comments.data
          console.log(comment)
          posts.push(comment)
      posts.push(data)
    console.log(posts)
    for post in posts
      addToFiles(files, post)
    files


addToFiles = (files, post) ->
    msg = post.message
    link_reg = /http\S*/
    inPost = link_reg.exec(msg)
    if inPost
      for link in inPost
        if checkIfFile(link)
          files.push(fileInfo(link, msg, post.created_time, post.from))



checkIfFile = (fileName) ->
    file_hosting_prefixes = ['https://docs.google', 'https://drive.google','https://www.dropbox.com/s']
    for hosting_prefix in file_hosting_prefixes
      if fileName.indexOf(hosting_prefix) is 0
        return true
    return isFile(fileName)
