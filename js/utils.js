//tu beda funkcje jakies dodatkowe...


function cleanScreen() {
    log("cleanScreen");
    $("#search_box").val(""); // czyscimy pole wyszukiwania
    $("#page").empty();
}

function log(txt) {
    if (DEBUG)
        console.log(txt);
}
