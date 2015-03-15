$(() ->
  $(document).on("click", ".file", () ->
    window.open($(this).attr("id"), "_blank")
  )
)

@files_present = (files) ->
  $("#starred_view").fadeOut()
  if files.length > 0
    $("#view").fadeOut( () ->
      for file in files
        div =
          if isGoogleDriveFile(file.link)
            prepareGooglePreview(files)
          else if isFile(file.link)
            prepareFile(file)
          else
            prepareOtherFilePreview(file)
        $("#view_files").append(div)
      $("#view_files").fadeIn()
    )
  else
    info = $("<div/>").addClass("alert").addClass("alert-info").text("No files in this folder")
    $("#view").fadeOut( () ->
      $("#view_files").append(info)
      $("#view_files").fadeIn()
    )

prepareGooglePreview = (file) ->
  link = file.link
  suffix = "/edit"
  if endsWith(link, suffix)
    link = link.substring(0, link.length - suffix.length) + "/preview"
  div = $("<div/>").addClass("file").attr("id", link).addClass("item")
  iframe = $("<iframe/>").attr("src", link).addClass("iframe")
  div.append(iframe)
  appendDate(div, file.date)
  post = $("<div/>").text(file.post).addClass("post")
  div.append(post)
  appendShow(div)
  div

prepareFile = (file) ->
  div = $("<div/>").addClass("file").attr("id", file.link).addClass("item");
  extensions = ['pdf', 'doc', 'docx', 'txt','zip', 'rar', 'gz', 'jpg']
  str = file.link
  idx = extensions.indexOf(str.substring(str.lastIndexOf('.')+1, str.length))
  icon = if idx
      $("<img/>").addClass("icon_img").attr("src","/images/"+extensions[idx]+".png")
    else
      $("<img/>").addClass("icon_img").attr("src","/images/file.png")
  div.append(icon);
  split = file.link.split("/");
  filename = split[split.length-1];
  name = $("<div/>").addClass("name").text(decodeURIComponent(filename));
  div.append(name);
  appendDate(div, file.date)
  appendShow(div)
  div

prepareOtherFilePreview = (file) ->
  div = $("<div/>").addClass("file").attr("id", file.link).addClass("item")
  a = $("<a/>").attr("href", file.link)
  a.embedly({
    key: EMBEDLY_KEY
  })
  div.append(a)
  appendDate(div, file.date)
  post = $("<div/>").text(file.post).addClass("post")
  div.append(post)
  appendShow(div)
  div

# CONSTANTS and UTILS ============================================================
EMBEDLY_KEY = "0b64e3ab10db4b17ae716b327dafeb55"
extensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'odt', 'mp3', 'wav', 'jpg', 'png',
              'zip', 'rar', 'gz', 'py', 'cpp', 'hpp', 'h', 'c', 'tgz']

isGoogleDriveFile = (url) -> url.search("google.com") isnt -1

@isFile = (url) ->
  split = url.split(".")
  len = split.length
  for extension in extensions
    if len > 1 and split[len-1] is extension
      return true
  return false

convertDateFormat = (rawDate) ->
  date = new Date(rawDate)
  "#{date.getDate()}/#{date.getMonth()+1}/#{date.getFullYear()}  #{date.getHours()}:#{date.getMinutes()}"

endsWith = (str, suffix) -> str.indexOf(suffix, str.length - suffix.length) isnt -1

appendShow = (div) -> div.append($("<div/>").text("Show"))
appendDate = (div, date) -> div.append($("<div/>").text(convertDateFormat(date)).addClass("date"))