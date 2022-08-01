import BasePlugin from '@appium/base-plugin';
import sharp from 'sharp';
import Reporter from './reporter';
const { v4: uuidv4 } = require('uuid');

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

  async handle(next, driver, commandName) {
    const result = await next();
    if (!this.cmdExclusionList.includes(commandName.toLowerCase())) {
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
      await Reporter.updateJsonValue(driver.sessionId, commandName, img, cmdId);
    }
    return result;
  }
}
