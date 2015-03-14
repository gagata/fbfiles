/* Escapes special characters from the provided string. */
function escapeSpecials(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/* Hides / shows elements of class 'item',
   according to the query inside the search box. */ 
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

$(document).ready(function() {
    $('#search_box').keyup(filter);
});