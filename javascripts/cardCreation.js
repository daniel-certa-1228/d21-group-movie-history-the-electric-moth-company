'use strict';

var movie = require('./getMovies');
var handler = require('./handlers');
var fire = require('./firebaseCalls');
var movieRating = {};

/*-------Card building function
Used to build cards for search and user view---*/
var card = {
   createCard: function(movies, searching, logState) {
     let cardMovieKeys = Object.keys(movies);
     $(cardMovieKeys).each((index, item) => {
       let thisMovie = movies[item];
       thisMovie.fbID = cardMovieKeys[index];
       let movieContent =
       `<div class="col xl4 l6 m6 s12" id=card--${thisMovie.movieID}>
   				<div class="card sticky-action" id=cardSticky${thisMovie.movieID}>
   					<div class="card-image waves-effect waves-block waves-light" id=cardImage${thisMovie.movieID}>
   					  <img class="activator icon${thisMovie.movieID}" src="${thisMovie.poster}">
   					</div>

                       <div class="card-content">
              <span class="card-title activator grey-text text-darken-4 icon${thisMovie.movieID} col s10 truncate">${thisMovie.title}</span>
              <i class="material-icons right icon${thisMovie.movieID} col s2 activator">more_vert</i>
   					</div>
   					<div class="card-reveal" id=reveal${thisMovie.movieID}>
   					  <span class="card-title grey-text text-darken-4">Overview<i class="material-icons right">close</i></span>
              <span>(${thisMovie.year})</span>
   					  <p>${thisMovie.overview}</p>
              <span class="card-title grey-text text-darken-4">Cast</span>
              <p id=castReveal${thisMovie.movieID}></p>
   					</div>
						<div id=rateYo${index} class=rateYo></div>
          </div>
               </div>`;

        if (searching === true) {
          $('#searchView').append(movieContent);
        } else if (searching === false) {
          $('#userview-content').append(movieContent);
        }

        if (logState === true) {
          $(function (content) {
  					$(`#rateYo${index}`).rateYo({
  						fullStar: true,
  						numStars: 10,
              rating: thisMovie.rating/2,
              starWidth: "20px",
              spacing: "7px"
  					})
  					 .on("rateyo.set", function (e, data) {
  									let rating = data.rating * 2;
  									handler.rateMovie(thisMovie, rating);
                });
  					});

          $(window).resize(() => {
            if ($('.col.xl4').width() < 275) {
              $(`.rateYo`).rateYo("option", "starWidth", "17px");
            } else if ($('.col.xl4').width() < 330) {
              $(`.rateYo`).rateYo("option", "starWidth", "20px");
            } else if ($('.col.xl4').width() >= 330) {
              $(`.rateYo`).rateYo("option", "starWidth", "25px");
            }

            // Below to media queries. Above needs to stay

            if ($(window).width() < 690) {
              $('.toggleButton').css({'margin-bottom':'10px'});
            } else if ($(window).width() < 993){
              $('.toggleButton').css({'margin-bottom':'0px'});
            } else if ($(window).width() < 1100) {
              $('#my-movies').css({'padding-left':'80px'});
            } else if ($(window).width() < 1470) {
              $('#my-movies').css({'padding-left':'180px'});
            } else if ($(window).width() >= 1470) {
              $('#my-movies').css({'padding-left':'280px'});
            }

          });
        }
        if (logState === true && thisMovie.inFB === true) {
          $(`#cardSticky${thisMovie.movieID}`).append(`<a class="btn-floating btn-large waves-effect waves-light red" id=remove${thisMovie.movieID}><i class="material-icons">remove</i></a>`);
          handler.removeMovie(thisMovie);
        } else if (logState === true && thisMovie.inFB === false){
          $(`#cardSticky${thisMovie.movieID}`).append(`<a class="btn-floating btn-large waves-effect waves-light green" id=plus${thisMovie.movieID}><i class="material-icons">add</i></a>`);
          $(`#rateYo${index}`).remove();
          handler.watchList(thisMovie);
        }
        handler.moreInfo(thisMovie);
	    });
	 }
};


module.exports = card;
