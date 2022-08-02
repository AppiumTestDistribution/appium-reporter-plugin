import { remote } from 'webdriverio';
import fetch from 'node-fetch';
import fs from 'fs';

const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/',
  logLevel: 'silent',
};
const capabilities = {
  platformName: 'Android',
  'appium:uiautomator2ServerInstallTimeout': '50000',
  'appium:automationName': 'UIAutomator2',
  // replace the path absolute path of VodQA.apk under apps
  'appium:app': '../apps/VodQA.apk',
};
let driver;
describe('Plugin Test', () => {
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });

    driver.addCommand('getReport', async function (sessionId, testName, testStatus) {
      const url = `http://localhost:4723/session/${sessionId}/getReport`;
      const reqBody = {};
      reqBody.testName = testName;
      reqBody.testStatus = testStatus;
      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(reqBody),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      const value = await data.value;
      // eslint-disable-next-line no-prototype-builtins
      if (value.hasOwnProperty('error')) {
        throw value;
      }
      return value;
    });
  });

  async function createReportFile(sessionID, data) {
    fs.writeFile(`${__dirname}/../appium-reports/${sessionID}.html`, data, 'utf-8', (err) => {
      if (err) throw err;
    });
  }

  it('Vertical swipe test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~login').click();
    await driver.$('~verticalSwipe').click();
  });

  afterEach(async () => {
    const data = await driver.getReport(driver.sessionId);
    await createReportFile(driver.sessionId, data);
    await driver.deleteSession();
  });
});
