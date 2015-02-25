'use strict';

/**
 * Module dependencies.
 */

var moviesData = require('../data/movies-data');
var imdbClient = require('omdb-client');

/**
 * Get movie content, including data from imdb source.
 *
 * @param {String} movie title
 * @param {String} director The director name
 * @param {Function} callback
 *
 * @api public
 */
module.exports = function(title, director, callback) {

  var match;

  if (!moviesData[title.toUpperCase()]) {
    callback('invalid title', null);
    return;
  }

  moviesData[title.toUpperCase()].forEach(function(movie) {

    // movie title + director are unique combinations based on data.
    if (movie.director.toUpperCase() === director.toUpperCase()) {
      match = {
        title: movie.title,
        director: movie.director,
        /*jshint camelcase: false */
        releaseYear: movie.release_year
      };
    }   
  });

  if (match) {
    var params = {
      title: title,
      year: parseInt(match.releaseYear, 10)
    };

    imdbClient.get(params, function handleResponse(err, content) {

      // if imdb lookup errors/timeout, just return the data available
      if (!err) {
        match.plot = content.Plot;
        match.poster = content.Poster;
        match.genre = content.Genre;
        match.actors = content.Actors;
        match.rating = content.imdbRating;
      }

      callback(null, match);
    });
  } else {
    callback('invalid director',  null);
  } 
  
};
