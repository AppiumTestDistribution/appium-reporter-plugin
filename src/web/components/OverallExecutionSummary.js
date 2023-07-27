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
    const testDetails = props.data.sessions[test.testId];
    const deviceDetails = 'deviceInfo' in testDetails ? testDetails.deviceInfo : undefined;
    resultElements = resultElements.concat({ name, status, ...deviceDetails });
  }

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
            let testname, teststatus, platformName, platformVersion, deviceManufacturer, deviceModel;
              testname = result.name;
              teststatus = result.status;
              platformName = 'platformName' in result ? result.platformName : 'Unknown';
              platformVersion = 'platformVersion' in result ? result.platformVersion : 'Unknown';
              deviceManufacturer = 'deviceManufacturer' in result ? result.deviceManufacturer : 'Unknown';
              deviceModel = 'deviceModel' in result ? result.deviceModel : 'Unknown';
            return (
              <tr className="table-row" key={key}>
                <td className="table-cell"> {testname} </td>
                <td className="table-cell"> {teststatus} </td>
                <td className="table-cell"> {platformName} </td>
                <td className="table-cell"> {platformVersion} </td>
                <td className="table-cell"> {deviceManufacturer} </td>
                <td className="table-cell"> {deviceModel} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
