import path from 'path';
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
const apkPath = path.join(__dirname, '../apps', 'Android.apk');
const appPath = path.join(__dirname, '../apps', 'iOS-Simulator-NativeDemoApp-0.4.0.app.zip');

export const androidCapabilities = {
    browserName: 'Android',
    platformName: 'Android',
    'appium:app': apkPath,
    'appium:automationName': 'UiAutomator2',
    'appium:appWaitActivity': 'com.wdiodemoapp.*'
};

export const iOSCapabilities = {
    platformName: 'iOS',
    'appium:platformVersion': '14.0',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': 'iPhone 11 Pro Max',
    'appium:iPhoneOnly': true,
    'appium:app': appPath,
  };

describe('Plugin Test', function () {
    describe('Generate Report for android', function () {
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
  
      it('Android wdio sample app login', async function () {
        await driver.$('~Login').click();
        const userName = '~input-email';
        const password = '~input-password';
        const loginBtn = '~button-LOGIN';
        await driver.$(userName).setValue('admin');
        await driver.$(password).setValue('admin');
        await driver.$(loginBtn).click();
        await driver.closeApp();
        await driver.launchApp();
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
        await createReportFile(report, 'android-app');
      });
    });

    describe('Generate Report for ios', function () {
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
  
      it('Android wdio sample app login', async function () {
        await driver.$('~Login').click();
        const userName = '~input-email';
        const password = '~input-password';
        const loginBtn = '~button-LOGIN';
        await driver.$(userName).setValue('admin');
        await driver.$(password).setValue('admin');
        await driver.$(loginBtn).click();
        await driver.closeApp();
        await driver.launchApp();
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
        await createReportFile(report, 'ios-app');
      });
    });
});

  