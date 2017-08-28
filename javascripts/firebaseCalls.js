'use strict';

var firebase = require('../lib/node_modules/firebase');
// var userInfo = require('./login');

var config = {
    apiKey: "AIzaSyCDbuxg0OfEiqFLQJv9Lw4Pd6LvEAFST8E",
    authDomain: "second-tester.firebaseapp.com",
    databaseURL: "https://second-tester.firebaseio.com",
    projectId: "second-tester",
    storageBucket: "second-tester.appspot.com",
    messagingSenderId: "527615551007"
};
firebase.initializeApp(config);

var fdr = firebase.database();
var fire = {

  getDBRef: function() {
    return fdr.ref();
  },

  getCurrentUser: function() {
    if (firebase.auth().currentUser === null) {
      //create function somewhere that forces user to login
    } else {
      return firebase.auth().currentUser.uid;
    }
  },

  addToWatchList: function(movieObj) {
    let currentUserID = fire.getCurrentUser();
    movieObj.uid = currentUserID;
    let dbRef = fdr.ref();
    dbRef.push({
      title: movieObj.title,
      watched: movieObj.watched,
      movieID: movieObj.movieID,
      overview: movieObj.overview,
      poster: movieObj.poster,
      rating: movieObj.rating,
      uid: movieObj.uid,
      year: movieObj.year,
      inFB: true
    });
  },

  returnWatchList: function() {
    return new Promise ((resolve, reject) => {
      let dbRef = fire.getDBRef();
      let userID = fire.getCurrentUser();
      if (userID === undefined) {
        return;
      } else {
        $.ajax({
          url: `https://second-tester.firebaseio.com/.json?orderBy="uid"&equalTo="${userID}"`
        }).done((data) => {
          resolve(data);
        });
      }
    });
  },

  markWatched: function(uglyID) {
    let dbRef = fdr.ref(`/${uglyID}`);
    dbRef.update({
      watched: true
    });
  },

  rateMovie: function(uglyID, rating) {
    let dbRef = fdr.ref(`/${uglyID}`);
    dbRef.update({
      rating: rating,
      watched: true
    });
  },

  removeFromFB: function(uglyID) {
    fdr.ref(`/${uglyID}`).remove();
  },
};

module.exports = fire;