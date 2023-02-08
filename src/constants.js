export const reportPath = `${__dirname}/data`;
export const jsonReportPath = `${reportPath}/report.json`;
export const htmlTemplatePath = `${__dirname}/reportTemplate/template.html`;
export const bundlePath = `${__dirname}/reportTemplate/bundle.js`;
// values should be all small
export const cmdExclusionList = [
  'createsession',
  'deletesession',
  'title',
  'screenshot',
  'status',
  'getreport',
];
export const testStatusValues = ['PASSED', 'FAILED'];
