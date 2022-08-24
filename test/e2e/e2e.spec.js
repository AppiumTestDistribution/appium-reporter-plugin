import path from 'path';
import { remote as wdio } from 'webdriverio';
import { pluginE2EHarness } from 'appium/test';
import { setTestInfo, getReport } from './base';
const THIS_PLUGIN_DIR = path.join(__dirname, '..', '..');
const APPIUM_HOME = path.join(THIS_PLUGIN_DIR, 'local_appium_home');
const JSON_REPORT_FILE = path.join(THIS_PLUGIN_DIR, 'lib', 'report.json');
const HTML_REPORT_FILE = path.join(THIS_PLUGIN_DIR, 'appium-reports', 'newReport.html');
const FAKE_DRIVER_DIR = '@appium/fake-driver';
const TEST_HOST = 'localhost';
const TEST_PORT = 4723;
import { fs as afs } from 'appium/support';
import { expect } from 'chai';
const html5Lint = require('html5-lint');

const TEST_FAKE_APP = path.join(
  APPIUM_HOME,
  'node_modules',
  '@appium',
  'fake-driver',
  'test',
  'fixtures',
  'app.xml'
);
const TEST_CAPS = {
  platformName: 'Fake',
  'appium:automationName': 'Fake',
  'appium:deviceName': 'Fake',
  'appium:app': TEST_FAKE_APP,
};
const WDIO_OPTS = {
  hostname: TEST_HOST,
  port: TEST_PORT,
  connectionRetryCount: 0,
  capabilities: TEST_CAPS,
};

describe('Plugin Test', function () {
  let server,
    driver = null;

  // this hook is intended to be run before the hooks create
  before(async function () {
    await afs.rimraf(APPIUM_HOME);
    await afs.rimraf(JSON_REPORT_FILE);
    await afs.rimraf(HTML_REPORT_FILE);
  });

  pluginE2EHarness({
    before,
    after,
    server,
    port: TEST_PORT,
    host: TEST_HOST,
    appiumHome: APPIUM_HOME,
    driverName: 'fake',
    driverSource: 'npm',
    driverSpec: FAKE_DRIVER_DIR,
    pluginName: 'appium-reporter-plugin',
    pluginSource: 'local',
    pluginSpec: THIS_PLUGIN_DIR,
  });

  describe('Generate Report', function () {
    let report;
    before(async function () {
      driver = await wdio(WDIO_OPTS);

      // custom command setTestInfo is added to driver object
      await driver.addCommand('setTestInfo', async function (testName, testStatus, error) {
        return await setTestInfo(this.sessionId, testName, testStatus, error);
      });

      // custom command getReport is added to driver object
      await driver.addCommand('getReport', async function () {
        return await getReport();
      });
      const alert1 = await driver.$('#AlertButton');
      await alert1.click();
      const title = 'Sample Test';
      const state = 'PASSED';
      let error = '';
      await driver.setTestInfo(title, state, error);
      await driver.deleteSession();
      report = await driver.getReport();
    });

    it('html generated should be valid', (done) => {
      html5Lint(report, (err, results) => {
        let msgs = results.messages;
        let msgTypes = [];
        msgs.forEach(async function (msg) {
          var type = msg.type, // error or warning
            message = msg.message,
            lastLine = msg.lastLine,
            lastColumn = msg.lastColumn,
            extract = msg.extract;
          msgTypes.push(type);
          console.log(`HTML5 Lint ${type}: ${lastLine}:${lastColumn} :${message} \n \t ${extract}`);
        });
        expect(msgTypes).to.not.include('error');
        done();
      });
    });
  });
});
