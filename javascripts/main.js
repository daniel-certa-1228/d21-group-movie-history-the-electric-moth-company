'use strict';

///-------REQUIRES----------///
var fire = require('./firebaseCalls');
var movie = require('./getMovies');
var card = require('./cardCreation');
var users = require('./users');
var login = require('./login');
var handlers = require('./handlers');
var userView = require('./userView.js');

///-------Global movie object----------///
var movieObject = {};

///-------User interaction with search on enter----------///
users.logOut();

$(".search").on('keyup', function (pushEnter) {
  if (pushEnter.which === 13) {
    $('.dropdown-button').dropdown('close');
    $('#searchView').html('');
    $('#userview-content').html('');
    $('.row').empty();
    $("#userView-content").hide();
    $("#searchView").show();
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
});
$("#untracked").click(function() {
  console.log("untracked");
  $(".sliderWrapper").addClass("is-hidden");
});
$("#watchList").click(function() {
  console.log("watchList");
  $(".sliderWrapper").addClass("is-hidden");
});

// $("[type=range]").change(function(){
//   let ratingSlide = $(this).val();
//   console.log("ratingSlide", ratingSlide);
//   if 

//   }
// });