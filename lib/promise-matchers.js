
module.exports = {
  install: function(options) {
    var o = parseOptions(options);
    var _jasmine = o.jasmine;

    _jasmine.Expectation.prototype.toResolve = function toResolve(done, cb) {
      assertNotNot(this.isNot);
      var promise = this.actual;
      assertPromise(promise);
      promise
        .then(passTest(o.Promise, done, cb))
        .catch(failTest(done, 'Expected promise to resolve but it rejected with: '));
    };

    _jasmine.Expectation.prototype.toReject = function toReject(done, cb) {
      assertNotNot(this.isNot);
      var promise = this.actual;
      assertPromise(promise);
      promise
        .then(failTest(done, 'Expected promise to reject but it resolved with: '))
        .catch(passTest(o.Promise, done, cb));
    };


    function parseOptions(options) {
      var isJasmine = Boolean(options.Expectation);
      return {
        jasmine: isJasmine ? options : options.jasmine,
        Promise: isJasmine ? Promise : options.Promise || Promise
      };
    }

    function passTest(P, done, cb) {
      var callback = cb || function() {
        };
      return function(response) {
        return P.resolve(callback(response))
          .then(done)
          .catch(function(err) {
            done.fail('Callback promise rejected with: ' + err);
          });
      }
    }

    function failTest(done, message) {
      return function(response) {
        done.fail(message + _jasmine.pp(response));
      }
    }

    function assertNotNot(isNot) {
      if (isNot) {
        throw new Error('`not` is not supported');
      }
    }

    function assertPromise(promise) {
      if (typeof promise === 'object' && promise.then && promise.catch) {
        return;
      }
      throw new Error('Expected a promise but got: ' + _jasmine.pp(promise));
    }

  }
};
