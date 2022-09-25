import React from "react";

export const TestStatus = (props) => {
  const sessionId = props.sessionId;
  const data = props.data;
  const testInfo = data.testInfo[sessionId];
  const testName = window.atob(testInfo.testName);
  const testStatus = window.atob(testInfo.testStatus);

  return (
    <div className="test-summary-page">
      <h5 className="test-summary-header summary-text-heading">Test Results</h5>
      <h4 className="summary-text-heading">Test Title</h4>
      <h5 className="summary-text">{testName}</h5>
      <h4 className="summary-text-heading">Test Status</h4>
      <h5 className="summary-text">{testStatus}</h5>
      {testInfo.error !== undefined &&
        window.atob(testInfo.error) !== "undefined" &&
        testInfo.error !== "" && (
          <div>
            <h4 className="summary-text-heading"> Error </h4>
            <h5 className="summary-text"> {window.atob(testInfo.error)} </h5>
          </div>
        )}
      <h4 className="summary-text-heading">Platform</h4>
      <h5 className="summary-text">{testInfo.deviceInfo.platformName}</h5>
      <h4 className="summary-text-heading">OS Version</h4>
      <h5 className="summary-text">{testInfo.deviceInfo.platformVersion}</h5>
      {testInfo.deviceInfo.deviceApiLevel !== undefined && (
        <div>
          <h4 className="summary-text-heading">Api Version</h4>
          <h5 className="summary-text">{testInfo.deviceInfo.deviceApiLevel}</h5>
        </div>
      )}
      <h4 className="summary-text-heading">Device Manufacturer</h4>
      <h5 className="summary-text">{testInfo.deviceInfo.deviceManufacturer}</h5>
      <h4 className="summary-text-heading">Device Model</h4>
      <h5 className="summary-text">{testInfo.deviceInfo.deviceModel}</h5>
      <h4 className="summary-text-heading">Device Name</h4>
      <h5 className="summary-text">{testInfo.deviceInfo.deviceName}</h5>
    </div>
  );
};
