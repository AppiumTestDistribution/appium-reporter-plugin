import fetch from 'node-fetch';
import fs from 'fs';

export const getReport = async function (sessionId, testName, testStatus, error) {
  const url = `http://localhost:4723/session/${sessionId}/getReport`;
  const reqBody = {};
  reqBody.testName = testName;
  reqBody.testStatus = testStatus;
  reqBody.error = error;
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(reqBody),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  const value = await data.value;
  // eslint-disable-next-line no-prototype-builtins
  if (value.hasOwnProperty('error')) {
    throw value;
  }
  return value;
};

export const createReportFile = async function (sessionID, data) {
  fs.writeFile(`${__dirname}/../appium-reports/${sessionID}.html`, data, 'utf-8', (err) => {
    if (err) throw err;
  });
};
