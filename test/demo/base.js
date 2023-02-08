import fetch from 'node-fetch';
import fs from 'fs';
export const HTML_REPORT_DIR = `${__dirname}/../../appium-reports`;

// api call to setTestinfo binding is made with params
export const setTestInfo = async function (sessionId, testName, testStatus, error) {
  const url = `http://localhost:4723/session/${sessionId}/setTestInfo`;

  const reqBody = {};
  reqBody.testName = testName;
  reqBody.testStatus = testStatus;
  reqBody.error = error;

  await fetch(url, {
    method: 'post',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  });
};

// api call to getReport binding is made to fetch html report
export const getReport = async () => {
  const url = 'http://localhost:4723/getReport';
  const response = await fetch(url);
  const data = await response.text();
  return data;
};

export const deleteReportData = async () => {
  const url = 'http://localhost:4723/deleteReportData';
  await fetch(url, { method: 'DELETE'});
};

// simple funciton to write contents to file
export const createReportFile = async function (data, fileName) {
  fs.writeFile(`${HTML_REPORT_DIR}/${fileName}.html`, data, 'utf-8', (err) => {
    if (err) throw err;
  });
};
