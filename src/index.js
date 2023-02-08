const fs = require('fs');
const fse = require('fs-extra');
import { reportPath } from './constants';
import log from './logger.js';

try {
  if (fs.existsSync(reportPath)){
    fse.emptyDirSync(reportPath, {});
  } 
  log.info(`${reportPath} is deleted.`);
} catch (err) {
  log.error(`Unable to delete ${reportPath}`);
}
try {
  if (!fs.existsSync(reportPath)){
    fs.mkdirSync(reportPath);
  }
} catch(err) {
  log.error(`Unable to create ${reportPath}`);
};

export { ReportPlugin } from './plugin';
