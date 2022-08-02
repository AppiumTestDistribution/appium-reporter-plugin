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

async function buildReport(sessionID) {
  const data = await fs.readFileSync(`${__dirname}/template.html`, 'utf8');
  let dom = await parse(data);
  dom.getElementById('testname').innerHTML = 'Should be able to login';

  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  let cmdLinks = '';
  const cmds = file.get('cmd');
  cmds.forEach((cmd) => {
    cmdLinks = `${cmdLinks} <li  class="nav-item" ><a href='#' class='nav-link' onclick=setData('${cmd[0]}','${cmd[1]}')>${cmd[0]}</a></li>`;
  });
  dom.getElementById('commandLinks').innerHTML = cmdLinks;

  const sessionData = file.get('data');
  const dataScript = `<script>
  const data = ${JSON.stringify(sessionData)};
  </script>
  `;
  dom.getElementById('data').innerHTML = dataScript;
  return dom.toString();
}

module.exports = {
  updateJsonValue,
  buildReport,
};
