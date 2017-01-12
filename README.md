Promise Matchers
===

[![CircleCI branch](https://img.shields.io/circleci/project/github/pietvanzoen/jasmine-promise-matchers/master.svg?style=flat-square)](https://circleci.com/gh/pietvanzoen/jasmine-promise-matchers/tree/master)

Adds `toResolve` and `toReject` matchers to jasmine.

## toResolve

```js
it('passes when promise resolves', function(done) {
  expect(Promise.resolve()).toResolve(done); // PASS
});
```

```js
it('fails when promise rejects', function(done) {
  expect(Promise.reject()).toResolve(done); // FAIL
});
```

## toReject

```js
it('passes when promise rejects', function(done) {
  expect(Promise.reject()).toReject(done); // PASS
});
```

```js
it('fails when promise resolves', function(done) {
  expect(Promise.resolve()).toReject(done); // FAIL
});
```

## callbacks

```js
it('passes promise response to callback', function(done) {
  expect(Promise.resolve('foo bar')).toResolve(done, function(resp) {
    expect(resp).toBe('foo bar'); // PASS
  });
});
```

### callback returning a promise

```js
it('callback can return a promise', function(done) {
  expect(Promise.resolve('foo bar')).toResolve(done, function(resp) {
    return Promise.resolve()
      .then(function() {
        // `done` is not called until this promise chain completes
      });
  })
});
```

```js
it('fails when callback promise rejects', function(done) {
  expect(Promise.resolve('foo bar')).toResolve(done, function(resp) {
    return Promise.resolve()
      .then(function() {
        throw new Error('foo');
      }); // FAILS and reports Error
  })
});
```

## TODO
- [ ] Test and implement for browser environments.
- [ ] Allow injection of custom `Promise` library.
