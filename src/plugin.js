import { BasePlugin } from 'appium/plugin';
import sharp from 'sharp';
import Reporter from './reporter';
const prettyHrtime = require('pretty-hrtime');
import log from './logger.js';
import { cmdExclusionList } from './constants';

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
    expressApp.all('/getReport', ReportPlugin.getReport);
  }

  static async getReport(req, res) {
    res.send(await Reporter.buildReport());
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
      log.err('Failed to extract sessionId from session Object.');
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

      let base64screenshot = await driver.getScreenshot();

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
          console.log(`downsize issue ${err}`);
          return null;
        });
      img = `data:image/jpeg;base64, ${img}`;

      const time = prettyHrtime(end);
      const data = { 'execution time': time };
      data['sessionId'] = driver.sessionId;
      if (result) data['response'] = result;
      if (args) data['request'] = args;
      await Reporter.setCmdData(driver.sessionId, commandName, img, data);
      return result;
    }
    return await next();
  }
}
