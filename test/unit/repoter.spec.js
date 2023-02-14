import Reporter from '../../src/reporter';
import { reportPath } from '../../src/constants';
const fse = require('fs-extra');
const editJsonFile = require('edit-json-file');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const fs = require('fs');

describe('Record data in JSON file', function () {
  let sessionId = 'sdfdsfsdfsdfsf';
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
    let deviceDetails = {};
    deviceDetails['platformName'] = 'android';
    await Reporter.initReport(sessionId, deviceDetails);
    const file = editJsonFile(await Reporter.getSessionFilePath(sessionId));
    const fileContents = await file.toObject();
    expect(fileContents).to.deep.equal({
      sessionId: sessionId,
      deviceInfo: {
        platformName: 'android'
      }
    });
  });

  it('Should record command details to json file', async function () {
    await Reporter.initReport(sessionId);
    const data = { 'execution time': '12 ms' };
    data['sessionId'] = sessionId;
    data['response'] = { result: 'response' };
    data['request'] = { result: 'request' };

    await Reporter.setCmdData(sessionId, 'click', 'img', data);
    const file = editJsonFile(await Reporter.getSessionFilePath(sessionId));
    const fileContents = file.get();
    expect(fileContents.sessionId).to.deep.equal(sessionId);
    expect(fileContents.cmd[0][0]).to.eq('click');
    const udid = fileContents.cmd[0][1];
    expect(fileContents.data[`click${udid}`]).to.deep.equal({
      img: 'img',
      args: {
        'execution time': '12 ms',
        sessionId: sessionId,
        response: {
          result: 'response',
        },
        request: {
          result: 'request',
        },
      },
    });
  });

  it('Should throw error when sessionId is not provided', async function () {
    await Reporter.initReport('test');
    await expect(Reporter.setTestInfo()).to.be.rejectedWith(
      'sessionId, testName, testStatus are mandatory arguments'
    );
  });

  it('Should throw error when testName is not provided', async function () {
    await Reporter.initReport('test');
    await expect(Reporter.setTestInfo('test')).to.be.rejectedWith(
      'sessionId, testName, testStatus are mandatory arguments'
    );
  });

  it('Should throw error when testStatus is not provided', async function () {
    await Reporter.initReport('test');
    await expect(Reporter.setTestInfo('test', 'Sample test name')).to.be.rejectedWith(
      'sessionId, testName, testStatus are mandatory arguments'
    );
  });
});
