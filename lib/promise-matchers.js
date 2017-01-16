
module.exports = {
  install: function(jasmine) {
    jasmine.Expectation.prototype.toResolve = toResolve;
    jasmine.Expectation.prototype.toReject = toReject;
  }
};

function toResolve(done, cb) {
  assertNotNot(this.isNot);
  var promise = this.actual;
  assertPromise(promise);
  promise
    .then(passTest(Promise, done, cb))
    .catch(failTest(done, 'Expected promise to resolve but it rejected with: '));
}

function toReject(done, cb) {
  assertNotNot(this.isNot);
  var promise = this.actual;
  assertPromise(promise);
  promise
    .then(failTest(done, 'Expected promise to reject but it resolved with: '))
    .catch(passTest(Promise, done, cb));
}

function passTest(P, done, cb) {
  var callback = cb || function() {};
  return function(response) {
    return P.resolve(callback(response))
      .then(done)
      .catch(function (err) {
        done.fail('Callback promise rejected with: ' + err);
      });
  }
}

function failTest(done, message) {
  return function(response) {
    done.fail(message + JSON.stringify(response));
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
  throw new Error('Expected a promise but got: ' + JSON.stringify(promise));
}
