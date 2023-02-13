import { remote as wdio } from 'webdriverio';
import { setTestInfo, getReport, createReportFile, deleteReportData } from './base';
const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 4723;
export const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/',
  logLevel: 'silent',
};

export const androidCapabilities = {
  platformName: 'Android',
  'appium:automationName': 'UIAutomator2',
  'appium:browserName': 'chrome',
};

export const iOSCapabilities = {
  platformName: 'iOS',
  'appium:platformVersion': '14.0',
  'appium:automationName': 'XCUITest',
  'appium:browserName': 'Safari',
  'appium:deviceName': 'iPhone 11 Pro Max',
  'appium:iPhoneOnly': true,
};

describe('Plugin Test', function () {
  describe('Android Generate Report', function () {
    let driver;

    beforeEach(async function () {
      driver = await wdio({
        ...WDIO_PARAMS,
        capabilities: androidCapabilities,
      });

      // custom command setTestInfo is added to driver object
      await driver.addCommand('setTestInfo', async function (testName, testStatus, error) {
        return await setTestInfo(this.sessionId, testName, testStatus, error);
      });

      // custom command getReport is added to driver object
      await driver.addCommand('getReport', async function () {
        return await getReport();
      });

      // custom command deleteReportData is added to driver object
      await driver.addCommand('deleteReportData', async function () {
        return await deleteReportData();
      });
    });

    it('Should click alert button in Android', async function () {
      await driver.url('https://practicetestautomation.com/practice-test-login/');
      await driver.getTitle(); // this shouldnt break the appium server
      const uelement = await driver.$('#username');
      await uelement.setValue('test123');
      const pelement = await driver.$('#password');
      await pelement.setValue('test123');
      
    });

    afterEach(async function () {
      const title = this.currentTest.title;
      const state = this.currentTest.state;
      let error = '';
      if(Object.prototype.hasOwnProperty.call(this.currentTest, 'err')) {
        error = this.currentTest.err.stack;
      }
      await driver.setTestInfo(title, state, error);
      await driver.deleteSession();
    });
    after(async function() {
      const report = await driver.getReport();
      await driver.deleteReportData();
      await createReportFile(report, 'android-browser');
    });
  });

  describe('iOS Generate Report', function () {
    let driver;

    beforeEach(async function () {
      driver = await wdio({
        ...WDIO_PARAMS,
        capabilities: iOSCapabilities,
      });

      // custom command setTestInfo is added to driver object
      await driver.addCommand('setTestInfo', async function (testName, testStatus, error) {
        return await setTestInfo(this.sessionId, testName, testStatus, error);
      });

      // custom command getReport is added to driver object
      await driver.addCommand('getReport', async function () {
        return await getReport();
      });

      // custom command deleteReportData is added to driver object
      await driver.addCommand('deleteReportData', async function () {
        return await deleteReportData();
      });
    });

    it('Should click alert button in iOS', async function () {
      await driver.url('https://practicetestautomation.com/practice-test-login/');
      const uelement = await driver.$('#username');
      await uelement.setValue('test123');
      const pelement = await driver.$('#password');
      await pelement.setValue('test123');
    });

    afterEach(async function () {
      const title = this.currentTest.title;
      const state = this.currentTest.state;
      let error = '';
      if(Object.prototype.hasOwnProperty.call(this.currentTest, 'err')) {
        error = this.currentTest.err.stack;
      }
      await driver.setTestInfo(title, state, error);
      await driver.deleteSession();
    });

    after(async function() {
      const report = await driver.getReport();
      await driver.deleteReportData();
      await createReportFile(report, 'ios-browser');
    });
  });
});
