import Reporter from '../../src/reporter';
const editJsonFile = require('edit-json-file');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const fs = require('fs');
const path = '../../src/report.json';

describe('Record data in JSON file', function () {
  beforeEach(() => {
    try {
      fs.unlinkSync(`${__dirname}/${path}`);
      // eslint-disable-next-line no-empty
    } catch (err) {
      console.log('Failed to delete file');
      console.log(err);
    }
  });

  it('Should init report json', async function () {
    let deviceDetails = {};
    deviceDetails['platformName'] = 'android';
    await Reporter.initReport('test', deviceDetails);
    const file = editJsonFile(`${__dirname}/${path}`);
    const fileContents = file.get();
    expect(fileContents).to.deep.equal({
      sessions: ['test'],
      testInfo: {
        test: {
          deviceInfo: {
            platformName: 'android',
          },
        },
      },
    });
  });

  it('Should record command details to json file', async function () {
    await Reporter.initReport('test');
    const data = { 'execution time': '12 ms' };
    data['sessionId'] = 'test';
    data['response'] = { result: 'response' };
    data['request'] = { result: 'request' };

    await Reporter.setCmdData('test', 'click', 'img', data);
    const file = editJsonFile(`${__dirname}/${path}`);
    const fileContents = file.get();
    expect(fileContents.sessions).to.deep.equal(['test']);
    expect(fileContents.sesssionData.test.cmd[0][0]).to.eq('click');
    const udid = fileContents.sesssionData.test.cmd[0][1];
    expect(fileContents.sesssionData.test.data[`click${udid}`]).to.deep.equal({
      img: 'img',
      args: {
        'execution time': '12 ms',
        sessionId: 'test',
        response: {
          result: 'response',
        },
        request: {
          result: 'request',
        },
      },
    });
  });

  it('Should throw error when invalid testStatus is passed', async function () {
    await Reporter.initReport('test');
    const testStatus = 'passed';
    await Reporter.setTestInfo('test', 'Sample test name', testStatus);
    const file = editJsonFile(`${__dirname}/${path}`);
    const fileContents = file.get();
    expect(fileContents).to.deep.equal({
      sessions: ['test'],
      testInfo: { test: { testName: 'Sample test name', testStatus: 'PASSED' } },
    });
  });

  it('Should throw error when invalid testStatus is passed', async function () {
    await Reporter.initReport('test');
    const testStatus = 'invalid';
    await expect(Reporter.setTestInfo('test', 'Sample test name', testStatus)).to.be.rejectedWith(
      `Test status ${testStatus} is not valid state.`
    );
  });

  it('Should throw error when sessionId is not provided', async function () {
    await Reporter.initReport('test');
    await expect(Reporter.setTestInfo()).to.be.rejectedWith(
      'sessionID, testName, testStatus are mandatory arguments'
    );
  });

  it('Should throw error when testName is not provided', async function () {
    await Reporter.initReport('test');
    await expect(Reporter.setTestInfo('test')).to.be.rejectedWith(
      'sessionID, testName, testStatus are mandatory arguments'
    );
  });

  it('Should throw error when testStatus is not provided', async function () {
    await Reporter.initReport('test');
    await expect(Reporter.setTestInfo('test', 'Sample test name')).to.be.rejectedWith(
      'sessionID, testName, testStatus are mandatory arguments'
    );
  });
});

describe('Generate HTML', function () {
  beforeEach(() => {
    try {
      fs.unlinkSync(`${__dirname}/${path}`);
      // eslint-disable-next-line no-empty
    } catch (err) {
      console.log('Failed to delete file');
      console.log(err);
    }

    const sessionID = 'test';
    const key = 'click';
    const value = 'value';
    const args = { 'execution time': '12 ms' };
    args['sessionId'] = 'test';
    args['response'] = { result: 'response' };
    args['request'] = { result: 'request' };
    const testName = 'This is Sample test';
    const testStatus = 'passed';
    const error = 'this is sample test';
    Reporter.initReport(sessionID);
    Reporter.setCmdData(sessionID, key, value, args);
    Reporter.setTestInfo(sessionID, testName, testStatus, error);
  });

  it('Should generate html from JSON file', async function () {
    const htmlData = await Reporter.buildReport();
    expect(htmlData).to.not.null;
  });
});
