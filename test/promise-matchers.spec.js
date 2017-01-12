var _ = require('lodash');
require('../lib/promise-matchers');

function testPromiseMatcher(promiseType) {
  var matcherName = 'to' + _.startCase(promiseType);
  var oppositePromiseType = promiseType === 'resolve' ? 'reject' : 'resolve';
  describe(matcherName, function() {

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

testPromiseMatcher('resolve');
testPromiseMatcher('reject');
