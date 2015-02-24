'use strict';

/**
 * Module dependencies.
 */

var moviesData = require('../data/movies-data');

/**
 * Returns matching films with locations grouped by title.
 * @param {String} query
 * @returns {Array} array of matches
 * @static
 */
module.exports = function(query, callback) {

  var matches = [];
  var q = query.toUpperCase();
  var title;
  
  var appendMatch = function(movie) {
    matches.push({
      title: movie.title,
      locations: movie.locations,
      director: movie.director,
      /*jshint camelcase: false */
      releaseYear: movie.release_year
    });
  };

  // brute force approach for first iteration
  for(title in moviesData) {
    if (title.indexOf(q) !== -1) {
      moviesData[title].forEach(appendMatch);
    }
  }

  callback(null, matches);
};
