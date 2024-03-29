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

  static async updateServer(expressApp) {
    expressApp.get('/getReport', await ReportPlugin.getReport);
    expressApp.delete('/deleteReportData', await ReportPlugin.deleteReportData);
    expressApp.post('/setTestInfo', await ReportPlugin.setTestInfo);
  }

  static async getReport(req, res) {
    log.info('In getReport');
    const report = await Reporter.buildReport();
    res.status(report.status).send(report.content);
  }

  static async deleteReportData(req, res) {
    try {

      if (await fs.existsSync(reportPath)) {
        await fse.emptyDirSync(reportPath);
        log.info(`${reportPath} is deleted.`);
      } 
      res.status(200).send();
    }catch(error){
      log.error(` Error in deleteing deleteReportData: ${error}`);
      res.status(500).send(error);
    }
    
  }

  static async setTestInfo(req, res) {
        let body = req.body;
        let sessionId = body.sessionId;
        let error = body.error;  
        let testName = body.testName;
        let testStatus = body.testStatus;    
        log.info(`In setTestInfo with ${JSON.stringify(req.body)}`);
        const response = await Reporter.setTestInfo(sessionId, testName, testStatus, error);
        res.status(response.status).send(response.content);
  }

  async createSession(next) {
    const result = await next();    
    return result;
  }

  async handle(next, driver, commandName, ...args) {
    let result;
    if(driver === null || driver.sessionId === null){
      log.info(`driver or session is null. Bypassing the screenshotting process for the command ${commandName}`);
      result = await next();
    } else {
      log.info(`session: ${driver.sessionId}; cmd ${commandName}; processing command: ${commandName}`);
      const start = process.hrtime();
      
      let data = {};
      data['sessionId'] = driver.sessionId;
      if (args) data['request'] = args;
      try {
      result = await next();
      } catch(e){
        log.error(`error in executing command ${commandName} \n ${e.message}`);
        data['error'] = e.message;
      }
      if (result) data['response'] = result;
      const end = process.hrtime(start);
      const commandExecTime = prettyHrtime(end);
      log.info(`session: ${driver.sessionId}; cmd ${commandName}; time taken by  appium for cmd execution: ${commandExecTime}`);
      data['execution time'] = commandExecTime ;

      let img;
      if (!cmdExclusionList.includes(commandName.toLowerCase())) {
        log.info(`session: ${driver.sessionId}; cmd ${commandName}; Command not in exlusion list for screenshot`);
        const beforeScreenshot = process.hrtime();
        let base64screenshot;
        try {
          base64screenshot= await driver.getScreenshot(); 
        } catch(err){
          log.error(`session: ${driver.sessionId}; cmd ${commandName}; Failed to take screenshot`);
          log.error(err);
        }
        const afterScreenshot = process.hrtime(beforeScreenshot);
        log.info(`session: ${driver.sessionId}; cmd ${commandName}; time appium took for screenshot: ${prettyHrtime(afterScreenshot)}`);

        const beforeimgProcess = process.hrtime();

        if(base64screenshot) {
          const buffer = base64screenshot.split(';base64,').pop();
          let imgBuffer = Buffer.from(buffer, 'base64');
    
          let meta = await sharp(imgBuffer).metadata();
    
          img = await sharp(imgBuffer);
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
        }
        const afterimgProcess = process.hrtime(beforeimgProcess);
        log.info(`session: ${driver.sessionId}; cmd ${commandName}; time took to process image: ${prettyHrtime(afterimgProcess)}`);
    
        const beforeWriteToFile = process.hrtime();
        await Reporter.setCmdData(driver, commandName, img, data);
        const afterWriteToFile = process.hrtime(beforeWriteToFile);
        log.info(`session: ${driver.sessionId}; cmd ${commandName}; Time taken by plugin to store data: ${prettyHrtime(afterWriteToFile)}`);
      }
    }
    return result;
  }

}
