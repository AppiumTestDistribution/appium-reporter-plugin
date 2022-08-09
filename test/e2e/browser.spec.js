import { remote } from 'webdriverio';
import { WDIO_PARAMS, androidBrowserCapabilities } from './wdio.config';
import { setTestInfo, getReport, createReportFile } from './base';

let driver;

describe('Server Report Plugin Test', () => {
  beforeEach(async function () {
    driver = await remote({
      ...WDIO_PARAMS,
      capabilities: androidBrowserCapabilities,
    });

    // custom command setTestInfo is added to driver object
    driver.addCommand('setTestInfo', async function (testName, testStatus, error) {
      await setTestInfo(this.sessionId, testName, testStatus, error);
    });

    // custom command getReport is added to driver object
    driver.addCommand('getReport', async function () {
      return await getReport();
    });
  });

  it('Should be able to enter username and password', async function () {
    await driver.url('https://practicetestautomation.com/practice-test-login/');
    const uelement = await driver.$('#username');
    await uelement.setValue('test123');
    const pelement = await driver.$('#password');
    await pelement.setValue('test123');
  });

  it('Should be able to enter credentials', async function () {
    await driver.url('https://practicetestautomation.com/practice-test-login/');
    const uelement = await driver.$('#username');
    await uelement.setValue('abc1234');
    const pelement = await driver.$('#password');
    await pelement.setValue('abc1234');
  });

  // test info is mapped to driver's sessionId.
  afterEach(async function () {
    const title = this.currentTest.title;
    const state = this.currentTest.state;
    let error = '';
    if (this.currentTest.hasOwnProperty('err')) {
      error = this.currentTest.err.stack;
    }
    await driver.setTestInfo(title, state, error);
    await driver.deleteSession();
  });

  // report is fetched and written to html file at the end of all tests.
  after(async function () {
    const report = await driver.getReport();
    await createReportFile(report);
  });
});
