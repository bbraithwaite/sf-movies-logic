/*
 * Iterates each film from the SF Movies source, calls the Google API and
 * saves the location/long/lat detail to a file (targetFile).
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

var https = require('https');
var films = require('./films-source.json');
var fs = require('fs');

var delay = 0;
var LOCATION_INDEX = 10;

var targetFile = './data/google-locations.json';

// Get geo data (long/lat) for a given location from the Google API.
var geoData = function(address, delayInMilliseconds, cb) {
	setTimeout(function() {
		https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + ' San Francisco,CA&sensor=false', function(res) {
		 	var body = '';
		 	res.setEncoding('utf8');
			res.on('data', function(chunk) {
		   	body += chunk;
		  	});

			res.on('end', function(d) {
				var response = JSON.parse(body);
				if (response.status == "OK") {
					var location = response.results[0].geometry.location;
					cb(null, { location: address, data: response.results[0] });
				} else if (response.status == "ZERO_RESULTS") {
					console.log('zero results for location: ' + address);
					cb(null, null);
				} else {
					console.log(response.status +  ' location: ' + address);
					cb("Status = " + response.status, null);
				}
		  	});

		}).on('error', function(e) {
			cb(null, e);
		});
	}, delayInMilliseconds);
}

var getGroupedFilmLocations = function() {
	var locations = {};

	// build locations look-up/group by location name to avoid duplicates
	for (var i = 0; i < films.data.length; i++) {
		if (!locations[films.data[i][LOCATION_INDEX]]) {
			locations[films.data[i][LOCATION_INDEX]] = 0;
		}

		locations[films.data[i][LOCATION_INDEX]] += 1;
	}

	return locations;
}

var getDataAndSaveToFile = function(locations) {

	for(var location in locations) {
		// max of 5 requests per sec limit to the Google API, so add delay to stay within limit.
		delay += 200;

		geoData(location, delay, function(err, data) {
			if (data) {
				fs.appendFile(targetFile, JSON.stringify(data, null, 2) + ',', function (err) {
	 	 			if (err) throw err;
				});
			}
		});
	}
}

// clear the file contents
fs.writeFile(targetFile, '', function (err) {
  if (err) throw err;
	getDataAndSaveToFile(getGroupedFilmLocations());
});