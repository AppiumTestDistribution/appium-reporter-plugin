const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');
import log from './logger.js';
import { htmlTemplatePath, jsonReportPath, bundlePath, reportPath } from './constants';

async function getSessionFilePath(sessionId){
  return `${reportPath}/${sessionId}.json`;
}

async function initReport(driver){
  const deviceDetails = {};
  let sessionId;
  try {
    sessionId = driver.sessionId;
    const caps = await driver.getSession();
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
    await createReportFile(sessionId, deviceDetails);
  } catch(err) {
    log.error(err);
    log.error(`Failed to extract sessionId & capabilities from driver Object: \n ${JSON.stringify(driver)}`);
    throw err;
  }
}

async function createReportFile(sessionId, deviceDetails) {
  try {
    if (sessionId && sessionId.length > 0) {
      let filePath = await getSessionFilePath(sessionId);
      let file = await editJsonFile(filePath);
      await file.set('sessionId', sessionId);
      await file.set('deviceInfo', deviceDetails);
      await file.save();
      log.info(`Data file for session ${sessionId} created at ${filePath}`);
    } else {
      throw 'Report creation failed because of invalid session ID';
    }
  } catch(e){
    log.error(`Error in creating session data file for session ${sessionId} \\n ${e}`);
    throw e;
  }
}

async function getTestStatus(status){
  status = status.toUpperCase();
  if(['PASS', 'PASSED'].includes(status))
    return 'PASSED';
  else if(['FAIL', 'FAILED'].includes(status))  
    return 'FAILED';
  else if(['PENDING', 'WIP'].includes(status))  
    return 'PENDING';  
  else
    return 'UNKNOWN';
}

async function setTestInfo(sessionId, testName, testStatus, error = undefined) {
  const tid = await uuidv4();  

  if( sessionId !== undefined &&  sessionId !== null && sessionId !== 'null') {
    const oldFileName = await getSessionFilePath(sessionId);
    const newFileName = await getSessionFilePath(tid);
    await fs.renameSync(oldFileName, newFileName);
  } else if (sessionId === undefined || sessionId === null) {
    sessionId = await uuidv4();
  }

  let file = await editJsonFile(jsonReportPath);
  const info = {};
  info['testName'] = testName;
  info['testStatus'] = await getTestStatus(testStatus);

  if (error !== undefined && error !== null && error !== 'null') 
    info['error'] = error;
  info['sessionId'] = sessionId;
  info['testId'] = tid;
  await file.append('tests', info);
  await file.save();

}

async function setCmdData(driver, key, value, args) {
  let filePath = await getSessionFilePath(driver.sessionId);
  if(!fs.existsSync(filePath)){
    await initReport(driver);  
  }

  let file = await editJsonFile(filePath);
  const cmdId = await uuidv4();
  file.set(`data.${key + cmdId}.img`, `${value}`);
  file.set(`data.${key + cmdId}.args`, args);
  await file.append('cmd', [key, cmdId]);
  await file.save();
}

async function buildReport() {
  let file = await editJsonFile(jsonReportPath);
  let allData = await file.toObject();
  allData.sessions = {};
  const testIds = allData.tests.map(y => [y.testId, y.sessionId]);
  for(let i = 0; i < testIds.length; i++){
    const testId = testIds[i][0];
    const sessionFilePath = `${reportPath}/${testId}.json`;
    const sessionData = await editJsonFile(sessionFilePath);
    allData.sessions[testId] = sessionData.toObject();
  }

  const htmlTemplate = await fs.readFileSync(htmlTemplatePath, 'utf8');
  let dom = await parse(htmlTemplate);

  const bundlejs = await fs.readFileSync(bundlePath, 'utf8');

  const dataScript = `<script>
    const data = ${JSON.stringify(allData)};
    ${bundlejs} </script>`;
  dom.getElementById('root').innerHTML = dataScript;
  return dom.toString();
}

module.exports = {
  getSessionFilePath,
  setCmdData,
  buildReport,
  setTestInfo,
  initReport
};
