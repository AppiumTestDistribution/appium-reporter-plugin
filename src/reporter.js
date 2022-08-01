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

  let cmdLinks = '';
  let cmds = file.get('cmd');
  cmds.forEach((cmd) => {
    cmdLinks =
      cmdLinks + `<li onclick=setData('${cmd[0]}','${cmd[1]}')><a href='#'>${cmd[0]}</a></li>`;
  });

  // let html = headerSection + titleContext;
  // let UIElements = cmdDataStart + cmdLinks + cmdDataEnd + screenshotSection + end;
  // const report = html + scriptData + onclickfunction + UIElements;

  const report =
    headerSection +
    titleContext +
    scriptData +
    onclickfunction +
    cmdDataStart +
    cmdLinks +
    cmdDataEnd +
    screenshotSection +
    end;

  return report.replace(/(\r\n|\n|\r)/gm, '');
}

module.exports = {
  updateJsonValue,
  createSesssionDataStore,
  buildReport,
};
