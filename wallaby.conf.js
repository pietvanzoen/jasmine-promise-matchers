module.exports = function() {
  return {
    files: ['lib/**/*.js', 'test/setup.js', 'index.js'],
    tests: ['test/**/*.spec.js'],
    testFramework: 'jasmine',
    setup: function() {
      require('./test/setup')
    },
    env: {
      type: 'node',
      // runner: 'path/to/your/node/executable'
    }
  };
};
