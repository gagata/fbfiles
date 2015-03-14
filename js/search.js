/* Escapes special characters from the provided string. */
function escapeSpecials(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/* Shows the elements of class 'item' that contain the
   search query either in their 'name' or 'post' field,
   and hides the remaining ones. */ 
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