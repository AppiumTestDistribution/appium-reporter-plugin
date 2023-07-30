import Reporter from '../../src/reporter';
import { reportPath } from '../../src/constants';
const fse = require('fs-extra');
const editJsonFile = require('edit-json-file');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

describe('Record data in JSON file', function () {

  const driver = {
    sessionId: uuidv4(),
    getSession: async function(){
      const caps = {
        platformName: 'android',
        deviceModel: 'pixel',
        deviceManufacturer: 'dilpul', 
        deviceApiLevel:  '30',
        platformVersion: '14',
        deviceName: 'pixel big',
        deviceUDID: 'e491f861-12c3-41a4-b8eb-58d67b9c9b6e',
      };
      return caps;
    }
  };
  beforeEach(async function() {
    try {
      if (await fs.existsSync(reportPath)){
        await fse.emptyDirSync(reportPath, (err) => { 
          if (err) { 
            console.error(`Unable to delete ${reportPath}`);
            console.log(err);
          } 
        });
      } else {
        fs.mkdirSync(reportPath);
      }
    } catch (err) {
      console.log(err);
    }
  });

  it('Should init report json', async function () {
    await Reporter.initReport(driver);
    const filePath = await Reporter.getSessionFilePath(driver.sessionId);
    const file = await editJsonFile(filePath);
    const fileContents = await file.toObject();

    expect(fileContents).to.deep.equal({
      sessionId: driver.sessionId,
      deviceInfo: await driver.getSession(),
    });
  });

  it('Should record command details to json file', async function () {
    const data = { 'execution time': '12 ms' };
    data['sessionId'] = driver.sessionId;
    data['response'] = { result: 'response' };
    data['request'] = { result: 'request' };

    await Reporter.setCmdData(driver, 'click', 'img', data);
    const filePath = await Reporter.getSessionFilePath(driver.sessionId);
    const file = await editJsonFile(filePath);
    const fileContents = await file.get();
    expect(fileContents.sessionId).to.deep.equal(driver.sessionId);
    expect(fileContents.cmd[0][0]).to.eq('click');
    const udid = fileContents.cmd[0][1];
    const cmdData = fileContents.data[`click${udid}`];
    expect(cmdData).to.deep.equal({
      img: 'img',
      args: {
        'execution time': '12 ms',
        sessionId: driver.sessionId,
        response: {
          result: 'response',
        },
        request: {
          result: 'request',
        },
      },
    });
  });

});
