import { remote } from 'webdriverio';
import { WDIO_PARAMS, androidBrowserCapabilities } from './wdio.config';
import { getReport, createReportFile } from './base';

let driver;

describe('Server Report Plugin Test', () => {

  beforeEach(async function () {
    driver = await remote({
      ...WDIO_PARAMS,
      capabilities: androidBrowserCapabilities,
    });

    driver.addCommand('getReport', (sessionId, testName, testStatus, error) =>
      getReport(sessionId, testName, testStatus, error)
    );
  });

  describe('Tests which has test status', async function () {
    it('A PASSing test should generate a good report', async function () {
      await driver.url('https://practicetestautomation.com/practice-test-login/');
      const uelement = await driver.$('#username');
      await uelement.setValue('test123');
      const pelement = await driver.$('#password');
      await pelement.setValue('test123');
    });

    it('A FAILing test should generate a good report too', async function () {
      await driver.url('https://practicetestautomation.com/practice-test-login/');
      const uelement = await driver.$('#username');
      await uelement.setValue('test123');
      const pelement = await driver.$('#passwordw');
      await pelement.setValue('test123');
    });

    afterEach(async function () {
      const title = this.currentTest.title;
      const state = this.currentTest.state;
      let error = '';
      if (this.currentTest.hasOwnProperty('err')) {
        error = this.currentTest.err.stack;
      }

      const data = await driver.getReport(driver.sessionId, title, state, error);
      await createReportFile(driver.sessionId, data);
      await driver.deleteSession();
    });
  });

  describe('Test which doesnt has test status', async function() {
    it('A FAILing test should generate a good report too', async function () {
      await driver.url('https://practicetestautomation.com/practice-test-login/');
      const uelement = await driver.$('#username');
      await uelement.setValue('test123');
      const pelement = await driver.$('#password');
      await pelement.setValue('test123');
    });

    afterEach(async function () {
      const data = await driver.getReport(driver.sessionId);
      await createReportFile(driver.sessionId, data);
      await driver.deleteSession();
    });
  });
});
