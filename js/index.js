/// <reference types="../@types/jquery/" />;
$(function () {
  $(".drawer .menu-bars").on("click", function () {
    $(".side-menu").toggleClass("show-menu");
    $(this).children(".fa-bars").toggleClass("d-none");
    $(this).children(".fa-xmark").toggleClass("d-none");
  });
});
