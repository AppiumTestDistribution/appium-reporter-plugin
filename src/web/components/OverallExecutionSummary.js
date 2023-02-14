import React from 'react';
import { Canvas } from './Canvas';

export const OverAllExecutionSummary = (props) => {
  const results = props.data.testInfo;
  let passCount = 0;
  let failCount = 0;
  let pendingCount = 0;
  let unknownCount = 0;
  let resultElements = [];

  const tests = props.data.tests;
  for(const test of tests) {
    console.log(`test = ${test.testName}; status = ${status}`);
    const name = test.testName;
    const status = test.testStatus;
    if (status === 'PASSED') {
      passCount = passCount + 1;
    } else if (status === 'FAILED') {
      failCount = failCount + 1;
    } else if (status === 'PENDING') {
      pendingCount = pendingCount + 1;
    } else {
      unknownCount = unknownCount + 1;
    }
    const deviceDetails = props.data.sessions[test.sessionId];
    resultElements = resultElements.concat({ name, status, ...deviceDetails });
  }
  console.log(`passcount = ${passCount}; failCount = ${failCount}; pendingCount = ${pendingCount}; unknownCount = ${unknownCount}`);

  return (
    <div className="overall-execution-summary-data">
      <h5 className="test-summary-header summary-text-heading">Overall Execution Summary</h5>
      <div className="chart-box">
        <span>Execution Status Breakup</span>
        <Canvas passCount={passCount} failCount={failCount} pendingCount={pendingCount} unknownCount={unknownCount}/>
      </div>
      <table className="table" rules="groups">
        <thead className="table-header">
          <tr>
            <th scope="col" className="table-cell">
              Test
            </th>
            <th scope="col" className="table-cell">
              State
            </th>
            <th scope="col" className="table-cell">
              Platform
            </th>
            <th scope="col" className="table-cell">
              Platform Version
            </th>
            <th scope="col" className="table-cell">
              Device Manufacturer
            </th>
            <th scope="col" className="table-cell">
              Device Model
            </th>
          </tr>
        </thead>
        <tbody>
          {resultElements.map((result, key) => {
            return (
              <tr className="table-row" key={key}>
                <td className="table-cell"> {result.name} </td>
                <td className="table-cell"> {result.status} </td>
                <td className="table-cell"> {result.deviceInfo.platformName} </td>
                <td className="table-cell"> {result.deviceInfo.platformVersion} </td>
                <td className="table-cell"> {result.deviceInfo.deviceManufacturer} </td>
                <td className="table-cell"> {result.deviceInfo.deviceModel} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
