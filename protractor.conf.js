// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const {SpecReporter} = require('jasmine-spec-reporter');
const docker_compose = 'docker-compose --project-name xgb_e2e';

// noinspection JSUnusedGlobalSymbols
exports.config = {
  allScriptsTimeout: 30000,
  //allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--headless']
    }
  },
  chromeOnly: true,
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  beforeLaunch() {
    require('child_process').execSync(`${docker_compose} up -d`);
    return new Promise(resolve => {
      setTimeout(resolve, 10000); // wait 10 seconds to give the stack time to finish loading
    });
  },
  afterLaunch() {
    require('child_process').execSync(`${docker_compose} stop`);
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({spec: {displayStacktrace: true}}));
  }
};
