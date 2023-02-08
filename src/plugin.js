import { BasePlugin } from 'appium/plugin';
import sharp from 'sharp';
import Reporter from './reporter';
const prettyHrtime = require('pretty-hrtime');
import log from './logger.js';
import { cmdExclusionList, reportPath } from './constants';
const fs = require('fs');
import fse from 'fs-extra';

export class ReportPlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }

  // this plugin supports a non-standard 'get report' command
  static newMethodMap = {
    '/session/:sessionId/setTestInfo': {
      POST: {
        command: 'setTestInfo',
        payloadParams: {
          required: ['testName', 'testStatus'],
          optional: ['error'],
        },
      },
    },
  };


  static async updateServer(expressApp) {
    expressApp.get('/getReport', ReportPlugin.getReport);
    expressApp.delete('/deleteReportData', await ReportPlugin.deleteReportData);
  }

  static async getReport(req, res) {
    res.send(await Reporter.buildReport());
  }

  static async deleteReportData(req, res) {
    if (await fs.existsSync(reportPath)) {
      await fse.emptyDirSync(reportPath);
      log.info(`${reportPath} is deleted.`);
    } 
    res.send();
  }

  async setTestInfo(next, driver, ...args) {
    return await Reporter.setTestInfo(driver.sessionId, ...args);
  }

  async createSession(next) {
    const result = await next();
    const deviceDetails = {};
    let sessionId;
    try {
      sessionId = result.value[0];
      const caps = result.value[1];
      deviceDetails['platformName'] = caps.platformName ?? undefined;
      deviceDetails['deviceModel'] = caps.deviceModel ?? undefined;
      deviceDetails['deviceManufacturer'] = caps.deviceManufacturer ?? undefined;
      deviceDetails['deviceApiLevel'] = caps.deviceApiLevel ?? undefined;
      deviceDetails['platformVersion'] = caps.platformVersion ?? undefined;
      deviceDetails['deviceName'] = caps.deviceName ?? undefined;
      deviceDetails['deviceUDID'] = caps.deviceUDID ?? undefined;
      if (deviceDetails['platformName'].toLowerCase() === 'ios') {
        deviceDetails['deviceManufacturer'] = 'APPLE';
        deviceDetails['deviceModel'] = deviceDetails['deviceName'];
      }
    } catch {
      log.error('Failed to extract sessionId from session Object.');
      throw result;
    }
    Reporter.initReport(sessionId, deviceDetails);
    return result;
  }

  async handle(next, driver, commandName, ...args) {
    if (!cmdExclusionList.includes(commandName.toLowerCase())) {
      const start = process.hrtime();
      const result = await next();
      const end = process.hrtime(start);

      const beforeScreenshot = process.hrtime();
      let base64screenshot = await driver.getScreenshot();
      const afterScreenshot = process.hrtime(beforeScreenshot);
      log.info(`session: ${driver.sessionId}; cmd ${commandName}; time appium took for screenshot: ${prettyHrtime(afterScreenshot)}`);


      const beforeimgProcess = process.hrtime();
      const buffer = base64screenshot.split(';base64,').pop();
      let imgBuffer = Buffer.from(buffer, 'base64');

      let meta = await sharp(imgBuffer).metadata();

      let img = await sharp(imgBuffer);
      if (meta.width > 500) {
        img = await img.resize(500);
      }

      img = await img
        .toFormat('jpeg', { mozjpeg: true })
        .toBuffer()
        .then((data) => {
          return data.toString('base64');
        })
        .catch((err) => {
          log.error(`downsize issue ${err}`);
          return null;
        });
      img = `data:image/jpeg;base64, ${img}`;
      const afterimgProcess = process.hrtime(beforeimgProcess);
      log.info(`session: ${driver.sessionId}; cmd ${commandName}; time appium took cmd execution: ${prettyHrtime(afterimgProcess)}`);


      const time = prettyHrtime(end);
      log.info(`session: ${driver.sessionId}; cmd ${commandName}; time appium took cmd execution: ${prettyHrtime(time)}`);
      const data = { 'execution time': time };
      data['sessionId'] = driver.sessionId;
      if (result) data['response'] = result;
      if (args) data['request'] = args;

      const beforeWriteToFile = process.hrtime();
      await Reporter.setCmdData(driver.sessionId, commandName, img, data);
      const afterWriteToFile = process.hrtime(beforeWriteToFile);
      log.info(`session: ${driver.sessionId}; cmd ${commandName}; Time taken for storing data: ${prettyHrtime(afterWriteToFile)}`);
      return result;
    }
    return await next();
  }
}
