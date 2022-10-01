import React from 'react';
import { Canvas } from './Canvas';

export const OverAllExecutionSummary = (props) => {
  const results = props.data.testInfo;
  let passCount = 0;
  let failCount = 0;
  let unknownCount = 0;
  let resultElements = [];
  for (const key in results) {
    let result = results[key];
    const name = window.atob(result.testName);
    const status = window.atob(result.testStatus);
    if (status === 'PASSED') {
      passCount = passCount + 1;
    } else {
      failCount = failCount + 1;
    }
    resultElements = resultElements.concat({ name, status, ...result });
    console.log(resultElements);
  }

  return (
    <div className="overall-execution-summary-data">
      <h5 className="test-summary-header summary-text-heading">Overall Execution Summary</h5>
      <div className="chart-box">
        <span>Execution Status Breakup</span>
        <Canvas passCount={passCount} failCount={failCount} />
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
