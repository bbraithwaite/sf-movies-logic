'use strict';

require('should');
var sfmLogic = require('../index');

describe('Movie Search', function() {

  describe('Search query with exact match', function() {

    it('returns 2 results', function(done) {
      sfmLogic.search('Milk', function(err, data) {
        data.length.should.equal(2);
        data[0].title.should.equal('Milk');
        data[0].director.should.equal('Gus Van Sant');
        data[0].locations.should.eql([ 'Lower Haight Street',
          'Grace Cathedral Episcopal Church (1100 California Street)',
          'Golden Gate Bridge',
          'Marine Fireman\'s Union Headquarters',
          'Market & Castro Street',
          'Treasure Island',
          'El Camino Del Mar',
          '29th and Delores Street',
          '424 Sansome Street',
          'Chinatown',
          'City Hall',
          'Duboce Park' ]);
        data[0].releaseYear.should.equal('2008');

        data[1].title.should.equal('The Times of Harvey Milk');
        data[1].director.should.equal('Rob Epstein');
        data[1].locations.should.eql([ 'The Castro' ]);
        data[1].releaseYear.should.equal('1984');
        done();
      });
    });

  });

  describe('Search query with partial match', function() {

    it('returns closest matches', function(done) {
      sfmLogic.search('Mil', function(err, data) {
        data.length.should.equal(5);
        data[0].title.should.equal('A Smile Like Yours');
        data[1].title.should.equal('Family Plot');
        data[2].title.should.equal('Milk');
        data[3].title.should.equal('Mona Lisa Smile');
        data[4].title.should.equal('The Times of Harvey Milk');
        done();
      });
    });

  });

  describe('Search query with no match', function() {

    it('returns an empty result', function(done) {
      sfmLogic.search('ZER', function(err, data) {
        data.length.should.equal(0);
        done();
      });
    });

  });

});
