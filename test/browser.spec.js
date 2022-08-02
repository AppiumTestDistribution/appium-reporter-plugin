import { remote } from 'webdriverio';
import { WDIO_PARAMS, androidCapabilities } from './wdio.config';
import fetch from 'node-fetch';
import fs from 'fs';

let driver;

describe('Plugin Test', () => {
  beforeEach(async () => {
    driver = await remote({
      ...WDIO_PARAMS,
      capabilities: androidCapabilities,
    });

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

  it('Fill credentials test', async () => {
    await driver.url('https://practicetestautomation.com/practice-test-login/');
    const uelement = await driver.$('#username');
    await uelement.setValue('test123');
    const pelement = await driver.$('#password');
    await pelement.setValue('test123');
  });

  afterEach(async () => {
    const data = await driver.getReport(driver.sessionId, 'Fill credentials test', 'Pass');
    await createReportFile(driver.sessionId, data);
    await driver.deleteSession();
  });
});
