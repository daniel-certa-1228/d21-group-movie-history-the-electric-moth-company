'use strict';

///-------REQUIRES----------///
var fire = require('./firebaseCalls');
var movie = require('./getMovies');
var card = require('./cardCreation');
var users = require('./users');
var login = require('./login');
var handlers = require('./handlers');
var userView = require('./userView.js');

$(document).ready(function() {
  $('#splash').hide();
  $('#splash').fadeIn(400);
});

///-------Global movie object----------///
var movieObject = {};

///-------User interaction with search on enter----------///
users.logOut();

$(".search").on('keyup', function (pushEnter) {
  if (pushEnter.which === 13) {
    // $('#splash').hide();
    $('.dropdown-button').dropdown('close');
    $('#searchView').html('');
    $('#userview-content').html('');
    $('.row').empty();
    $("#userView-content").hide();
    $("#searchView").show();
    $("#untracked").removeClass("is-hidden");
    $("#all").removeClass("is-hidden");
    let userVal;
    if ($(window).width() < 993){
      userVal = $("#mobileSearch").val();
    } else if ($(window).width() >= 993) {
      userVal = $("#search").val();
    }
    let logState;
    if (users.getUser() === null) {
      movie.getSearch(userVal)
      .then((results) => {
        for (var i = 0; i < results.length; i++) {
          let item = results[i];
          item.release_date = item.release_date.slice(0, item.release_date.indexOf('-'));
          if (item.poster_path === null) {
            movieObject[i] = {
              title: item.title,
              year: item.release_date,
              poster: 'images/PLACEHOLDER.jpg',
              overview: item.overview,
              movieID: item.id,
              rating: 0,
              watched: false,
              inFB: false
            };
          } else {
            movieObject[i] = {
              title: item.title,
              year: item.release_date,
              poster: `http://image.tmdb.org/t/p/w500${item.poster_path}`,
              overview: item.overview,
              movieID: item.id,
              rating: 0,
              watched: false,
              inFB: false
            };
          }
        }
        card.createCard(movieObject, true, logState);
      });
    } else {
      logState = true;
      fire.returnWatchList()
      .then((watchList) => {
        console.log("watchList", watchList);
        let myMovieIDsArr = [];
        let myMovieRatingsArr = [];
        let watchKeys = Object.keys(watchList);
        $(watchKeys).each((windex, witem) => {
          let eachMovie = watchList[witem];
          myMovieIDsArr.push(eachMovie.movieID);
          myMovieRatingsArr.push(eachMovie.rating);
        });
        movie.getSearch(userVal)
        .then((results) => {
          var movieObject = {};
          for (var i = 0; i < results.length; i++) {
            let item = results[i];
            item.release_date = item.release_date.slice(0, item.release_date.indexOf('-'));
            if (item.poster_path === null) {
              movieObject[i] = {
                title: item.title,
                year: item.release_date,
                poster: 'images/PLACEHOLDER.jpg',
                overview: item.overview,
                movieID: item.id,
                rating: 0,
                watched: false,
                inFB: false
              };
            } else {
              movieObject[i] = {
                title: item.title,
                year: item.release_date,
                poster: `http://image.tmdb.org/t/p/w500${item.poster_path}`,
                overview: item.overview,
                movieID: item.id,
                rating: 0,
                watched: false,
                inFB: false
              };
            }
            if (myMovieIDsArr.indexOf(item.id) !== -1) {
              movieObject[i].inFB = true;
              let thisMovieIndex = myMovieIDsArr.indexOf(item.id);
              movieObject[i].rating = myMovieRatingsArr[thisMovieIndex];
            }
          }
          card.createCard(movieObject, true, logState);
        });
      });
    }
    $(".search").val("");
  }
});
// This is the show/hide slideder 
$("#watched").click(function() {
  console.log("watched");
  $(".sliderWrapper").removeClass("is-hidden");
  let allCards = $("#searchView").children();
  $(allCards).each(function(card){
    let red = $(this).find('a.btn-floating.btn-large.waves-effect.waves-light.red');
    let green = $(this).find('a.btn-floating.btn-large.waves-effect.waves-light.green');
    $(red).closest('div').parent().removeClass("is-hidden");
    $(green).closest('div').parent().addClass("is-hidden");
    let rating = $(this).attr('data-rating');
    if(parseInt(rating) === 0) {
      $(this).addClass('is-hidden');
    }
  });

  let allCardsUSER = $("#userview-content").children();
   console.log( "allCards", allCardsUSER );
  $(allCardsUSER).each(function(card){
    let rating = $(this).attr('data-rating');
    console.log( "rating", rating );
    if(parseInt(rating) === 0) {
      $(this).addClass('is-hidden');
    }  else  {
      $(this).removeClass('is-hidden');
    }
  });
});
$("#untracked").click(function() {
  console.log("untracked");
  $(".sliderWrapper").addClass("is-hidden");
  let allCards = $("#searchView").children();
  // console.log( "allCards", allCards );
  $(allCards).each(function(card){
    let red = $(this).find('a.btn-floating.btn-large.waves-effect.waves-light.red');
    let green = $(this).find('a.btn-floating.btn-large.waves-effect.waves-light.green');
    // console.log( "card", red );
    $(red).closest('div').parent().addClass("is-hidden");
    $(green).closest('div').parent().removeClass("is-hidden");
  });
});
$("#watchList").click(function() {
  console.log("watchList");
  $(".sliderWrapper").addClass("is-hidden");
  let allCards = $("#searchView").children();
  console.log( "allCards", allCards );
  $(allCards).each(function(card){
    let red = $(this).find('a.btn-floating.btn-large.waves-effect.waves-light.red');
    let green = $(this).find('a.btn-floating.btn-large.waves-effect.waves-light.green');
    $(red).closest('div').parent().removeClass("is-hidden");
    $(green).closest('div').parent().addClass("is-hidden");
    let rating = $(this).attr('data-rating');
    if(parseInt(rating) !== 0) {
      $(this).addClass('is-hidden');
    }
  });

  let allCardsUSER = $("#userview-content").children();
   console.log( "allCards", allCardsUSER );
  $(allCardsUSER).each(function(card){
    let rating = $(this).attr('data-rating');
    console.log( "rating", rating );
    if(parseInt(rating) !== 0) {
      $(this).addClass('is-hidden');
    }  else  {
      $(this).removeClass('is-hidden');
    }
  });
});
$("#all").click(function() {
  console.log( "all" );
  $(".sliderWrapper").addClass("is-hidden");

  let allCards = $("#searchView").children();
    $(allCards).each(function(card){
      $(this).removeClass('is-hidden');
    });

  let allCardsUSER = $("#userview-content").children();
    $(allCardsUSER).each(function(card){
      $(this).removeClass('is-hidden');
    });


});

// User View Slider
$("[type=range]").change(function(){
  let ratingSlide = $(this).val();
  let slideNumber = parseInt(ratingSlide);
  let allCardsUSER = $("#userview-content").children();
  $(allCardsUSER).each(function(card){
    let rating = $(this).attr('data-rating');
    let ratingNum = parseInt(rating);
    let compare = slideNumber - ratingNum;
    console.log("compare", compare);
    if (compare !== 0){
      $(this).addClass('is-hidden');
    } else {
      $(this).removeClass('is-hidden');
    }
  }
);
});

// Search View Slider
$("[type=range]").change(function(){
  let ratingSlide = $(this).val();
  let slideNumber = parseInt(ratingSlide);
  let allCardsUSER = $("#searchView").children();
  $(allCardsUSER).each(function(card){
    let rating = $(this).attr('data-rating');
    let ratingNum = parseInt(rating);
    let compare = slideNumber - ratingNum;
    console.log("compare", compare);
    if (compare !== 0){
      $(this).addClass('is-hidden');
    } else {
      $(this).removeClass('is-hidden');
    }
  }
);
});

  
