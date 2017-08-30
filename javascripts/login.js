"use strict";

let user = require('./users');
let fire = require('./firebaseCalls');
let card = require('./cardCreation');

//***************************************************************
// User login section. Should ideally be in its own module

$(".auth-btn").click(function() {
  // console.log("clicked auth");
  user.logInGoogle()
  .then((result) => {
    $('#searchView').html('');
    // console.log("result from login", result.user.uid);
    // user = result.user.uid;
    user.setUser(result.user.uid);
    $(".auth-btn").addClass("is-hidden");
    $(".logout").removeClass("is-hidden");
    $(".myMoviesMobile").removeClass("is-hidden");
    $("#untracked").addClass("is-hidden");
    $("#bcrumb-wrapper").children().addClass("is-hidden");
    let userMyMoviesShow = $(".myMoviesBcm");
    userMyMoviesShow.removeClass("is-hidden");
    // $("#all").addClass("is-hidden");
    let userName = result.user.displayName;
    userName = userName.slice(0, userName.indexOf(" "));
    $('.my-movies').show().html(`${userName}'s Movies`);
    $('.userview-btns').show();
    fire.returnWatchList()
    .then((data) => {
      $('#userView').show();
      card.createCard(data, false, true);
    });
  });
});

$(".logout").click(() => {
  // console.log("logout clicked");
  user.logOut();
  $(".auth-btn").removeClass("is-hidden");
  $(".logout").addClass("is-hidden");
  $(".myMoviesMobile").addClass("is-hidden");
  $('.userview-btns').hide();
  $('#searchView').html('');
  $('#userview-content').html('');
});
