var _ = require('lodash');
var promiseMatchers = require('../lib/promise-matchers');
var RSVP = require('rsvp');

describe('jasmine-promise-matchers', function() {

  describe('install', function() {
    beforeEach(function() {
      delete jasmine.Expectation.prototype.toResolve;
      delete jasmine.Expectation.prototype.toReject;
    });

    it('installs matchers on given jasmine instance', function(done) {
      promiseMatchers.install({jasmine: jasmine});
      expect(Promise.resolve()).toResolve(done);
    });

    it('uses given Promise implementation when given', function(done) {
      function cb() {
        return 'foo'
      }
      spyOn(RSVP.Promise, 'resolve').and.callFake(function(cbValue) {
        expect(cbValue).toBe('foo');
        done();
      });
      promiseMatchers.install({jasmine: jasmine, Promise: RSVP.Promise});
      expect(Promise.resolve()).toResolve(done.fail, cb);
    });

    it('jasmine can be passed as the only argument', function(done) {
      promiseMatchers.install(jasmine);
      expect(Promise.resolve()).toResolve(done);
    });
  });

  describe('matchers', function() {
    testPromiseMatcher('resolve');
    testPromiseMatcher('reject');
  });

});

function testPromiseMatcher(promiseType) {
  var matcherName = 'to' + _.startCase(promiseType);
  var oppositePromiseType = promiseType === 'resolve' ? 'reject' : 'resolve';
  describe(matcherName, function() {

    beforeEach(function() {
      promiseMatchers.install(jasmine);
    });

    it('passes with ' + _.trim(promiseType, 'e') + 'ed promises', function(done) {
      expect(Promise[promiseType]())[matcherName](done);
    });

    it('reports ' + oppositePromiseType + ' reason to done.fail', function(done) {
      var dn = done.fail;
      dn.fail = jasmine.createSpy('done.fail').and.callFake(function(message) {
        expect(message).toContain('Expected promise to ' + promiseType);
        expect(message).toContain('foo bar');
        done();
      });
      expect(Promise[oppositePromiseType]('foo bar'))[matcherName](dn);
    });

    it('accepts a callback which is invoked with promise response', function(done) {
      var promiseResponse = {foo: 'bar'};
      expect(Promise[promiseType](promiseResponse))[matcherName](done, function(response) {
        expect(promiseResponse).toBe(response);
      });
    });

    it('callback can return a resolving promise and done is not called until after resolution', function(done) {
      var dn = jasmine.createSpy('done');
      expect(Promise[promiseType]())[matcherName](dn, function() {
        return Promise.resolve()
          .then(function() {
            expect(dn).not.toHaveBeenCalled();
            done();
          });
      });
    });

    it('fails if callback promise rejects', function(done) {
      var dn = done.fail;
      dn.fail = jasmine.createSpy('done.fail').and.callFake(function(message) {
        expect(message).toBe('Callback promise rejected with: foo bar');
        done();
      });
      expect(Promise[promiseType]())[matcherName](dn, function() {
        return Promise.reject('foo bar');
      });
    });

    it('throws if `not` is used', function() {
      expect(function() {
        expect(Promise[promiseType]()).not[matcherName]()
      }).toThrowError(/`not` is not supported/);
    });

    it('throws if given value is not a promise', function() {
      expect(function() {
        expect({foo: 'bar'})[matcherName]()
      }).toThrowError(/Expected a promise but got/);
    });

  });
}
