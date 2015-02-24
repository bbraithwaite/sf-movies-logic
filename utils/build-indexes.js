/*
 * Iterates each film from the SF Movies source, collapses multiple locations
 * by film and groups duplicate films (by title). Builds a lookup by film title.
 *
 *
 * This is some rough around the edges code that builds up json files 
 * into a preferred format for the purposes of this example so that I 
 * could feed the data without a database. It is run out of process,
 * therefore perf is not considered.
 * 
 * 
 * If you choose to use this code in production, please be aware of the 
 * T&Cs of the original source with regard to the data usage.
 */

var films = require('./films-source.json');
var fs = require('fs');

var TITLE = 8;
var RELEASE_YEAR = 9;
var LOCATION = 10;
var FUN_FACT = 11;
var DISTRIBUTOR = 13;
var DIRECTOR = 14;
var WRITER = 15;
var ACTOR_1 = 16;
var ACTOR_2 = 17;
var ACTOR_3 = 18;

var filmsIndex = {};
var match = {};

for (var i = 0; i < films.data.length; i++) {
	var title = films.data[i][TITLE];
	var titleIndex = title.toUpperCase();

	if (!filmsIndex[titleIndex]) {
		filmsIndex[titleIndex] = [];
	}

	match = null;

	filmsIndex[titleIndex].forEach(function(f) {

		// prevent duplicates
		if (f.director === films.data[i][DIRECTOR] && 
			f.release_year === films.data[i][RELEASE_YEAR])	{
			match = f;
			return;
		}

	});

	var film = {
		title: title,
		director: films.data[i][DIRECTOR],
		fun_fact : films.data[i][FUN_FACT],
		release_year : films.data[i][RELEASE_YEAR],
		distributor : films.data[i][DISTRIBUTOR],
		writer : films.data[i][WRITER],
		actor_1 : films.data[i][ACTOR_1],
		actor_2 : films.data[i][ACTOR_2],
		actor_3 : films.data[i][ACTOR_3],
		locations: []
	}

	if (match) {
		// adding location to existing film
		if (films.data[i][LOCATION]) {
			match.locations.push(films.data[i][LOCATION]);
		}
	} else {
		if (films.data[i][LOCATION]) {
			film.locations.push(films.data[i][LOCATION]);
		}
		filmsIndex[titleIndex].push(film);
	}
}

fs.writeFile('./data/movies-index.json', JSON.stringify(filmsIndex, null, 2), function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
