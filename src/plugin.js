import BasePlugin from '@appium/base-plugin';
import sharp from 'sharp';
import Reporter from './reporter';
const prettyHrtime = require('pretty-hrtime');

export class ReportPlugin extends BasePlugin {
  // value should be in lowercase
  cmdExclusionList = [
    'createsession',
    'deletesession',
    'title',
    'screenshot',
    'status',
    'getreport',
  ];

  constructor(pluginName) {
    console.log(`In plugin cons = ${pluginName}`);
    super(pluginName);
  }

  // this plugin supports a non-standard 'get report' command
  static newMethodMap = {
    '/session/:sessionId/setTestInfo': {
      POST: {
        command: 'setTestInfo',
        payloadParams: {
          optional: ['testName', 'testStatus', 'error'],
        },
      },
    },
  };

  static async updateServer(expressApp) {
    expressApp.all('/getReport', ReportPlugin.getReport);
  }

  static async getReport(req, res) {
    console.log('In get report');
    res.send(await Reporter.buildReport());
  }

  async setTestInfo(next, driver, ...args) {
    return await Reporter.setTestInfo(...args);
  }

  async createSession(next) {
    const result = await next();
    if (!result.hasOwnProperty('err')) {
      Reporter.initReport(result.value[0]);
    } else {
      console.log('Failed to get sessionId in report plugin');
      console.log(JSON.stringify(result));
    }
    return result;
  }

  async handle(next, driver, commandName, ...args) {
    if (!this.cmdExclusionList.includes(commandName.toLowerCase())) {
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
