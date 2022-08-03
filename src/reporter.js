const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');
import { escape } from 'html-escaper';

async function updateJsonValue(sessionID, key, value, args) {
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  const cmdId = await uuidv4();
  file.set(`data.${key + cmdId}.img`, `${value}`);
  file.set(`data.${key + cmdId}.args`, args);
  file.append('cmd', [key, cmdId]);
  file.save();
}

async function buildReport(sessionID, testName, testStatus, error) {
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  const data = await fs.readFileSync(`${__dirname}/template.html`, 'utf8');
  let dom = await parse(data);

  if (testName) {
    dom.getElementById('testname').innerHTML = testName;
    file.set('data.spec.name', testName);
  } else {
    testName = 'Not Defined';
    dom.getElementById('testname').innerHTML = 'Appium Server Report';
  }

  let cmdLinks = '';
  const cmds = file.get('cmd');
  cmds.forEach((cmd) => {
    cmdLinks = `${cmdLinks} <li  class="nav-item" ><a href='#' class='nav-link' onclick=setData('${cmd[0]}','${cmd[1]}')>${cmd[0]}</a></li>`;
  });
  dom.getElementById('commandLinks').innerHTML = cmdLinks;

  const sessionData = file.get('data');
  const dataScript = `<script>
  const data = ${JSON.stringify(sessionData)};
  </script>`;
  dom.getElementById('data').innerHTML = dataScript;

  const header = dom.getElementById('header');
  if (testStatus === undefined || !['passed', 'failed'].includes(testStatus.toLowerCase())) {
    testStatus = 'Unknown';
    file.set('data.spec.status', 'Unknown');
    header.appendChild(
      await parse('<span class="me-5 badge rounded-pill bg-warning text-dark">Unknown</span>')
    );
  } else if (testStatus.toLowerCase() === 'passed') {
    file.set('data.spec.status', 'Passed');
    header.appendChild(
      await parse('<span class="me-5 badge rounded-pill bg-success">Passed</span>')
    );
  } else if (testStatus.toLowerCase() === 'failed') {
    file.set('data.spec.status', 'Failed');
    header.appendChild(
      await parse('<span class="me-5 badge rounded-pill bg-danger">Failed</span>')
    );
  }

  const testStatusLink = `<li  class="nav-item" >
    <a href="#" class="nav-link" onclick="setTestStatus('${await escapeString(testName)}', '${await escapeString(testStatus)}', '${await escapeString(error)}')">Status</a>
  </li>`;
  dom.getElementById('testStatus').innerHTML = testStatusLink;
  file.save();
  return dom.toString();
}

async function escapeString(data) {
  return btoa(data);
}

module.exports = {
  updateJsonValue,
  buildReport,
};
