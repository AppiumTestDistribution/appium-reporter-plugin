const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');
import { htmlTemplatePath, jsonReportPath, bundlePath, testStatusValues } from './constants';

async function initReport(sessionID, deviceDetails) {
  if (sessionID && sessionID.length > 0) {
    let file = editJsonFile(jsonReportPath);
    file.append('sessions', sessionID);
    file.set(`testInfo.${sessionID}.deviceInfo`, deviceDetails);
    file.save();
  } else {
    throw 'Report creation failed because of invalid session ID';
  }
}

async function setTestInfo(sessionID, testName, testStatus, error = undefined) {
  if (sessionID === undefined || testName === undefined || testStatus === undefined)
    throw new Error('sessionID, testName, testStatus are mandatory arguments');

  let file = editJsonFile(jsonReportPath);
  const info = {};
  if (!testStatusValues.includes(testStatus.toUpperCase()))
    throw new Error(`Test status ${testStatus} is not valid state.`);

  info['testName'] = testName;
  info['testStatus'] = testStatus.toUpperCase();
  if (error) info['error'] = Buffer.from(error, 'utf8').toString('base64');
  info['deviceInfo'] = file.get(`testInfo.${sessionID}.deviceInfo`);
  file.set(`testInfo.${sessionID}`, info);
  file.save();
}

async function setCmdData(sessionID, key, value, args) {
  let file = editJsonFile(jsonReportPath);
  const cmdId = await uuidv4();
  file.set(`sesssionData.${sessionID}.data.${key + cmdId}.img`, `${value}`);
  file.set(`sesssionData.${sessionID}.data.${key + cmdId}.args`, args);
  file.append(`sesssionData.${sessionID}.cmd`, [key, cmdId]);
  file.save();
}

async function buildReport() {
  let file = editJsonFile(jsonReportPath);
  const allData = file.get();

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
  initReport,
  setCmdData,
  buildReport,
  setTestInfo,
};
