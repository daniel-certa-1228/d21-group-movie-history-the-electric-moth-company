"use strict";

console.log("User View.js, YO!");
var fbCall = require('./firebaseCalls.js');
var cardCreation = require('./cardCreation.js');

///SEE README for issues. Showing movies is user is logged in and has movies///
$(".my-movies").on("click", function(){
  $('#searchView').html('');
  $('#userview-content').html('');
  $('.row').empty();
  $("#userView").show();
  $("#searchView").hide();
  $("#untracked").addClass("is-hidden");
  $(".sliderWrapper").addClass("is-hidden");
  $("#bcrumb-wrapper").children().addClass("is-hidden");
  let userMyMoviesShow = $(".myMoviesBcm");
  userMyMoviesShow.removeClass("is-hidden");
  fbCall.returnWatchList()
  .then(function(data){
      cardCreation.createCard(data, false, true);
      console.log(cardCreation);
      console.log(data);
  });
});
