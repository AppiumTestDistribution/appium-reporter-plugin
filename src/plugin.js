import BasePlugin from '@appium/base-plugin';
import sharp from 'sharp';
import Reporter from './reporter';
const { v4: uuidv4 } = require('uuid');
const prettyHrtime = require('pretty-hrtime');

export class ReportPlugin extends BasePlugin {
  // value should be in lowercase
  cmdExclusionList = ['createsession', 'deletesession', 'title', 'screenshot'];

  constructor(pluginName) {
    console.log(`In plugin cons = ${pluginName}`);
    super(pluginName);
  }

  // this plugin supports a non-standard 'get report' command
  static newMethodMap = {
    '/session/:sessionId/getReport': {
      GET: {
        command: 'getReport',
        neverProxy: true,
      },
    },
  };

  async getReport(_next, driver) {
    return await Reporter.buildReport(driver.sessionId);
  }

  async handle(next, driver, commandName, ...args) {
    if (!this.cmdExclusionList.includes(commandName.toLowerCase())) {
      const start = process.hrtime();
      const result = await next();
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
      const cmdId = await uuidv4();
      const end = process.hrtime(start);
      const time = prettyHrtime(end);
      const data = { 'execution time': time };
      data['sessionId'] = driver.sessionId;
      if (result) data['response'] = result;
      if (args) data['request'] = args;
      await Reporter.updateJsonValue(driver.sessionId, cmdId, commandName, img, data);
      return result;
    }
    return await next();
  }
}
