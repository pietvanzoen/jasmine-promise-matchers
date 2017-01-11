var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

// Custom reporter
if (!global.wallaby) {
  jasmine.getEnv().clearReporters();
  jasmine.getEnv().addReporter(new SpecReporter({
    spec: {
      displayPending: true
    },
    summary: {
      displayPending: false
    }
  }));
}
