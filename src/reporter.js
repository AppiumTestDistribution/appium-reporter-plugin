const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');

async function initReport(sessionID) {
  let file = editJsonFile(`${__dirname}/report.json`);
  file.append('sessions', sessionID);
  file.save();
}

async function setTestInfo(testName, testStatus, error, sessionID) {
  let file = editJsonFile(`${__dirname}/report.json`);
  const info = {};
  info['testName'] = Buffer.from(testName, 'utf8').toString('base64');
  info['testStatus'] = Buffer.from(testStatus, 'utf8').toString('base64');
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
    sessionLinks = `${sessionLinks} 
    <li  class='nav-item'>
      <a href='#' class='nav-link' onclick=setTestCmdLinks('${sessionId}')>${sessionId}</a>
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
