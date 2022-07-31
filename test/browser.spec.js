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

    driver.addCommand('getReport', async function (sessionId) {
      const url = `http://localhost:4723/session/${sessionId}/getReport`;
      const response = await fetch(url);
      const data = await response.json();
      const value = await data.value;
      return value.replaceAll('"', '\'').replaceAll('\\n', '');
    });
  });

  async function createReportFile(sessionID, data) {
    fs.writeFile(
      `${__dirname}/../appium-reports/${sessionID}.html`,
      JSON.stringify(data),
      'utf-8',
      function (err) {
        if (err) throw err;
      }
    );
  }

  it('Sample test', async () => {
    await driver.url('https://practicetestautomation.com/practice-test-login/');
    const uelement = await driver.$('#username');
    await uelement.setValue('test123');
    const pelement = await driver.$('#password');
    await pelement.setValue('test123');
  });

  afterEach(async () => {
    const data = await driver.getReport(driver.sessionId);
    await createReportFile(driver.sessionId, data);
    await driver.deleteSession();
  });
});
