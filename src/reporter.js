const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');
import log from './logger.js';
import { htmlTemplatePath, jsonReportPath, bundlePath, reportPath } from './constants';

async function getSessionFilePath(sessionId){
  return `${reportPath}/${sessionId}.json`;
}

async function initReport(sessionId, deviceDetails) {
  try {
    if (sessionId && sessionId.length > 0) {
      let filePath = await getSessionFilePath(sessionId);
      log.info(`Data file for session ${sessionId} created at ${filePath}`);
      let file = await editJsonFile(filePath);
      await file.set('sessionId', sessionId);
      await file.set('deviceInfo', deviceDetails);
      await file.save();
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
  if (sessionId === undefined || testName === undefined || testStatus === undefined)
    throw new Error('sessionId, testName, testStatus are mandatory arguments');

  let file = await editJsonFile(jsonReportPath);
  const info = {};
  info['testName'] = testName;
  info['testStatus'] = await getTestStatus(testStatus);
  if (error) 
    info['error'] = error;
  info['sessionId'] = sessionId;
  await file.append('tests', info);
  await file.save();
}

async function setCmdData(sessionId, key, value, args) {
  let filePath = await getSessionFilePath(sessionId);
  let file = editJsonFile(filePath);
  const cmdId = await uuidv4();
  file.set(`data.${key + cmdId}.img`, `${value}`);
  file.set(`data.${key + cmdId}.args`, args);
  file.append('cmd', [key, cmdId]);
  file.save();
}

async function buildReport() {
  let file = await editJsonFile(jsonReportPath);
  let allData = await file.toObject();
  allData.sessions = {};
  const sessions = allData.tests.map(y => y.sessionId);
  for(const session of sessions) {
    const sessionFilePath = `${reportPath}/${session}.json`;
    const sessionData = await editJsonFile(sessionFilePath);
    allData.sessions[session] = sessionData.toObject();
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
  initReport,
  setCmdData,
  buildReport,
  setTestInfo,
};
