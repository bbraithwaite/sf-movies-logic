'use strict';

require('should');
var sfmLogic = require('../index');

describe('Movie Locations', function() {

  describe('request with a single matching movie', function() {

    it('returns geo data', function(done) {
      sfmLogic.locations('Milk', 'Gus Van Sant', function(err, data) {
        data.locations.length.should.equal(12);
        data.locations[0].should.eql({
          location: 'Lower Haight Street',
          geo: { lat: 37.7712749, lng: -122.4371285 },
          address: 'Haight Street, San Francisco, CA, USA'
        });
        data.locations[1].should.eql({ 
          location: 'Grace Cathedral Episcopal Church (1100 California Street)',
          geo: { lat: 37.7920733, lng: -122.4134177 },
          address: 'Grace Cathedral, 1100 California, ' + 
            'San Francisco, CA 94108, USA'
        });
        done();
      });
    });

  });
  
  describe('request with mutliple matching movies', function() {

    it('returns geo data for first matching director', function(done) {
      sfmLogic.locations('High Crimes', 'Mel Brooks', function(err, data) {
        data.locations.length.should.equal(6);
        done();
      });

    });

    it('returns geo data for the second matching director', function(done) {
      sfmLogic.locations('High Crimes', 'Carl Franklin', function(err, data) {
        data.locations.length.should.equal(1);
        done();
      });
    });

  });

  describe('request with invalid movie', function() {

    it('returns error for invalid title', function(done) {
      sfmLogic.locations('Invalid movie', 'Mel Brooks', function(err) {
        err.should.equal('invalid title');
        done();
      });
    });

    it('returns error for invalid director', function(done) {
      sfmLogic.locations('High Crimes', 'Mel Crooks', function(err) {
        err.should.equal('invalid director');
        done();
      });
    });

  });


});
