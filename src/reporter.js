import {
  headerSection,
  titleContext,
  noImage,
  cmdDataStart,
  cmdDataEnd,
  screenshotSection,
  onclickfunction,
  end,
} from './htmlData';

const editJsonFile = require('edit-json-file');
const fs = require('fs');

async function createSesssionDataStore(sessionID) {
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  file.set('data', {});
  file.set('cmd', []);
  file.save();
}

async function updateJsonValue(sessionID, key, value, cmdId) {
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);
  file.set(`data.${key + cmdId}`, `${value}`);
  file.append('cmd', [key, cmdId]);
  file.save();
}

async function buildReport(sessionID) {
  await createReportFile(sessionID);
  let html = headerSection + titleContext;
  await appendDataToFile(sessionID, html);
  let file = editJsonFile(`${__dirname}/${sessionID}.json`);

  let scriptData = `<script lang='javascript'>
    const data = ${JSON.stringify(file['data'])};
    const noImg = '${noImage}';
    $(document).ready(
      function() {
        document.querySelector('#cmd li').click();
      }
    );
  </script>`;

  await appendDataToFile(sessionID, scriptData);
  await appendDataToFile(sessionID, onclickfunction);

  let cmdLinks = '';
  let cmds = file.get('cmd');
  cmds.forEach((cmd) => {
    cmdLinks =
      cmdLinks + `<li onclick=setData('${cmd[0] + cmd[1]}')><a href='#'>${cmd[0]}</a></li>`;
  });

  let UIElements = cmdDataStart + cmdLinks + cmdDataEnd + screenshotSection + end;
  await appendDataToFile(sessionID, UIElements);
  const report = html + scriptData + onclickfunction + UIElements;
  return report.replace(/(\r\n|\n|\r)/gm, '');
}

async function createReportFile(sessionID) {
  fs.writeFile(`${__dirname}/${sessionID}.html`, '', function (err) {
    if (err) throw err;
  });
}

async function appendDataToFile(sessionID, data) {
  fs.appendFile(`${__dirname}/${sessionID}.html`, data, function (err) {
    if (err) throw err;
  });
}

module.exports = {
  updateJsonValue,
  createSesssionDataStore,
  buildReport,
};
