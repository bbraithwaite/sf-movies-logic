'use strict';

/**
 * Module dependencies.
 */

var moviesData = require('../data/movies-data');
var locationData = require('../data/locations-data');

/**
 * Append locations to movie.
 *
 * @param {Object} movie
 * @return {Object} movie data with locations
 *
 * @api private
 */
var appendLocations = function(movie) {

  var locations = [];

  movie.locations.forEach(function groupLocations(loc) {        
    if (locationData[loc]) {
      locations.push({ 
        location: loc, 
        geo: locationData[loc].geo,
        address: locationData[loc].address
      });
    }
  });

  return {
    title: movie.title,
    locations: locations
  };

};

/**
 * Movie location lookup method that gets geo location data.
 *
 * @param {String} movie title
 * @param {String} director
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
      match = movie;
    }  
  });

  if (match) {
    callback(null,  appendLocations(match));
  } else {
    callback('invalid director',  null);
  }
};
