import fetch from 'node-fetch';
import fs from 'fs';

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

export const getReport = async () => {
  const url = 'http://localhost:4723/getReport';
  const response = await fetch(url);
  const data = await response.text();
  return data;
};

export const createReportFile = async function (data) {
  fs.writeFile(`${__dirname}/../appium-reports/newReport.html`, data, 'utf-8', (err) => {
    if (err) throw err;
  });
};
