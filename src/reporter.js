const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';

async function updateJsonValue(sessionID, cmdId, key, value, args) {
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  file.set(`data.${key + cmdId}.img`, `${value}`);
  file.set(`data.${key + cmdId}.args`, args);
  file.append('cmd', [key, cmdId]);
  file.save();
}

async function buildReport(sessionID, testName, testStatus) {
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  const data = await fs.readFileSync(`${__dirname}/template.html`, 'utf8');
  let dom = await parse(data);

  if (testName) {
    dom.getElementById('testname').innerHTML = testName;
    file.set('data.spec.name', testName);
  } else {
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
  if (testStatus === undefined || !['pass', 'fail'].includes(testStatus.toLowerCase())) {
    file.set('data.spec.status', 'Unknown');
    header.appendChild(
      await parse('<span class="me-5 badge rounded-pill bg-warning text-dark">Unknown</span>')
    );
  } else if (testStatus.toLowerCase() === 'pass') {
    file.set('data.spec.status', 'Success');
    header.appendChild(
      await parse('<span class="me-5 badge rounded-pill bg-success">Success</span>')
    );
  } else if (testStatus.toLowerCase() === 'fail') {
    file.set('data.spec.status', 'Fail');
    header.appendChild(await parse('<span class="me-5 badge rounded-pill bg-danger">Fail</span>'));
  }

  file.save();
  return dom.toString();
}

module.exports = {
  updateJsonValue,
  buildReport,
};
