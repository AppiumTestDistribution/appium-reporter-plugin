const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');
const testStatusValues = ['PASSED', 'FAILED'];

async function initReport(sessionID) {
  if (sessionID && sessionID.length > 0) {
    let file = editJsonFile(`${__dirname}/report.json`);
    file.append('sessions', sessionID);
    file.save();
  } else {
    throw 'Report creation failed because of invalid session ID';
  }
}

async function setTestInfo(sessionID, testName, testStatus, error) {
  if (sessionID === undefined || testName === undefined || testStatus === undefined)
    throw new Error('sessionID, testName, testStatus are mandatory arguments');

  let file = editJsonFile(`${__dirname}/report.json`);
  const info = {};
  if (!testStatusValues.includes(testStatus.toUpperCase()))
    throw new Error(`Test status ${testStatus} is not valid state.`);

  info['testName'] = Buffer.from(testName, 'utf8').toString('base64');
  info['testStatus'] = Buffer.from(testStatus.toUpperCase(), 'utf8').toString('base64');
  if (error) info['error'] = Buffer.from(error, 'utf8').toString('base64');
  file.set(`testInfo.${sessionID}`, info);
  file.save();
}

async function setCmdData(sessionID, key, value, args) {
  let file = editJsonFile(`${__dirname}/report.json`);
  const cmdId = await uuidv4();
  file.set(`sesssionData.${sessionID}.data.${key + cmdId}.img`, `${value}`);
  file.set(`sesssionData.${sessionID}.data.${key + cmdId}.args`, args);
  file.append(`sesssionData.${sessionID}.cmd`, [key, cmdId]);
  file.save();
}

async function buildReport() {
  let file = editJsonFile(`${__dirname}/report.json`);
  const data = await fs.readFileSync(`${__dirname}/template.html`, 'utf8');
  let dom = await parse(data);

  // set all data variable
  const allData = file.get();
  const dataScript = `
  <script>
    const data = ${JSON.stringify(allData)};
  </script>`;
  dom.getElementById('data').innerHTML = dataScript;

  // set test links
  const sessions = file.get('sessions');
  let sessionLinks = '';
  sessions.forEach((sessionId) => {
    const testName = Buffer.from(file.get(`testInfo.${sessionId}.testName`), 'base64').toString(
      'utf8'
    );
    const testStatus = Buffer.from(file.get(`testInfo.${sessionId}.testStatus`), 'base64').toString(
      'utf8'
    );
    sessionLinks = `${sessionLinks} 
    <li  class='nav-item' state='${testStatus}'>
      <a href='#' class='nav-link' onclick=setTestCmdLinks('${sessionId}')>
        ${testName}
      </a>
    </li>`;
  });
  dom.getElementById('testLinks').innerHTML = sessionLinks;
  return dom.toString();
}

module.exports = {
  initReport,
  setCmdData,
  buildReport,
  setTestInfo,
};
