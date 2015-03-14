$(function () {
    $("#list").click(function () {
        $("#view").removeClass("grid").addClass("list");
    });
    $("#grid").click(function () {
        $("#view").removeClass("list").addClass("grid");
    });
});
