'use strict';

var should = require('should');
var sinon = require('sinon');
var imdbClient = require('omdb-client');
var sfmLogic = require('../index');

describe('Movie Content', function() {

  describe('request with a single matching film', function() {

    before(function() {
      sinon.stub(imdbClient, 'get')
        .withArgs({
          title: 'Milk', 
          year: 2008
        })
        .yields(null, { 
          Plot: 'Plot Detail',
          Genre: 'Biography, Drama, History',
          Actors: 'Sean Penn',
          imdbRating: '7.7',
          Poster: 'poster.jpg'
        });
    });

    after(function() {
      imdbClient.get.restore();
    });

    it('returns the expected content', function(done) {
      sfmLogic.content('Milk', 'Gus Van Sant', function(err, data) {
        data.title.should.equal('Milk');
        data.releaseYear.should.equal('2008');
        data.director.should.equal('Gus Van Sant');
        data.plot.should.equal('Plot Detail');
        data.genre.should.equal('Biography, Drama, History');
        data.actors.should.equal('Sean Penn');
        data.rating.should.equal('7.7');
        data.poster.should.equal('poster.jpg');
        done();
      });
    });

  });
  
  describe('request with mutliple matching films', function() {

    before(function() {
      var get = sinon.stub(imdbClient, 'get');

      get.withArgs({
          title: 'High Crimes', 
          year: 1977
        })
        .yields(null, { 
          Plot: 'Plot 1',
          Genre: 'Genre 1',
          Actors: 'Actors 1',
          imdbRating: '1.0',
          Poster: 'poster1.jpg'
        });

      get.withArgs({
          title: 'High Crimes', 
          year: 2002
        })
        .yields(null, { 
          Plot: 'Plot 2',
          Genre: 'Genre 2',
          Actors: 'Actors 2',
          imdbRating: '2.0',
          Poster: 'poster2.jpg'
        });

    });

    after(function() {
      imdbClient.get.restore();
    });

    it('returns content for the first matching director', function(done) {
      sfmLogic.content('High Crimes', 'Mel Brooks', function(err, data) {
        data.title.should.equal('High Crimes');
        data.releaseYear.should.equal('1977');
        data.director.should.equal('Mel Brooks');
        data.plot.should.equal('Plot 1');
        data.genre.should.equal('Genre 1');
        data.actors.should.equal('Actors 1');
        data.rating.should.equal('1.0');
        data.poster.should.equal('poster1.jpg');
        done();
      });
    });

    it('returns content for the second matching director', function(done) {
      sfmLogic.content('High Crimes', 'Carl Franklin', function(err, data) {
        data.title.should.equal('High Crimes');
        data.releaseYear.should.equal('2002');
        data.director.should.equal('Carl Franklin');
        data.plot.should.equal('Plot 2');
        data.genre.should.equal('Genre 2');
        data.actors.should.equal('Actors 2');
        data.rating.should.equal('2.0');
        data.poster.should.equal('poster2.jpg');
        done();
      });
    });

  });

  describe('request with imdb api error', function() {

    before(function() {
      sinon.stub(imdbClient, 'get')
        .yields('timeout exceeded', null);
    });

    after(function() {
      imdbClient.get.restore();
    });

    it('returns the expected content', function(done) {
      sfmLogic.content('Milk', 'Gus Van Sant', function(err, data) {
        data.title.should.equal('Milk');
        data.releaseYear.should.equal('2008');
        data.director.should.equal('Gus Van Sant');
        should.not.exist(data.plot);
        done();
      });
    });

  });

  describe('request with invalid movie', function() {

    it('returns error for invalid title', function(done) {
      sfmLogic.content('Invalid movie', 'Mel Brooks', function(err) {
        err.should.equal('invalid title');
        done();
      });
    });

    it('returns error for invalid director', function(done) {
      sfmLogic.content('High Crimes', 'Mel Crooks', function(err) {
        err.should.equal('invalid director');
        done();
      });
    });

  });

});