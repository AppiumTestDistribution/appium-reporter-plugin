import fetch from 'node-fetch';

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
