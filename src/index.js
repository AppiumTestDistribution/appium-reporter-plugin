const fs = require('fs');
import { jsonReportPath } from './constants';
try {
  fs.unlinkSync(jsonReportPath);
  console.log(`${jsonReportPath} is deleted.`);
} catch (err) {
  console.log(`Unable to delete ${jsonReportPath}. \n ${err}`);
}
export { ReportPlugin } from './plugin';
