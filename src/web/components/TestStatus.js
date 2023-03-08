import React from 'react';

export const TestStatus = (props) => {
  const sessionId = props.sessionId;
  const data = props.data;
  const test = data.tests.filter(test => test.sessionId === sessionId)[0];
  const testName = test.testName;
  const testStatus = test.testStatus;
  const error = test.error;
  const testInfo = data.sessions[sessionId]

  let platformName, platformVersion, deviceManufacturer, deviceModel, deviceApiLevel, deviceName;
  try {
    let deviceInfo = 'deviceInfo' in testInfo ? testInfo.deviceInfo : undefined;
    if(deviceInfo !== undefined) { 
      platformName = 'platformName' in deviceInfo ? deviceInfo.platformName : undefined;
      platformVersion = 'platformVersion' in deviceInfo ? deviceInfo.platformVersion : undefined;
      deviceManufacturer = 'deviceManufacturer' in deviceInfo ? deviceInfo.deviceManufacturer : undefined;
      deviceModel = 'deviceModel' in deviceInfo ? deviceInfo.deviceModel : undefined;
      deviceApiLevel = 'deviceApiLevel' in deviceInfo ? deviceInfo.deviceApiLevel : undefined;
      deviceName = 'deviceName' in deviceInfo ? deviceInfo.deviceName : undefined;
    }
  } catch(e){
    console.error(e)
  }


  return (
    <div className="test-summary-page">
      <h5 className="test-summary-header summary-text-heading">Test Results</h5>
      <h4 className="summary-text-heading">Test Title</h4>
      <h5 className="summary-text">{testName}</h5>
      <h4 className="summary-text-heading">Test Status</h4>
      <h5 className="summary-text">{testStatus}</h5>

      {error !== undefined &&
        error !== 'null' &&
        error !== null && (
          <div>
            <h4 className="summary-text-heading"> Error </h4>
            <h5 className="summary-text"> {error} </h5>
          </div>
      )}

      { platformName !== undefined && (
        <div>
          <h4 className="summary-text-heading">Platform</h4>
          <h5 className="summary-text">{platformName}</h5>
        </div>
      )}

      { platformVersion !== undefined && (
        <div>
          <h4 className="summary-text-heading">OS Version</h4>
          <h5 className="summary-text">{platformVersion}</h5>
        </div>
      )}

      {deviceApiLevel !== undefined && (
        <div>
          <h4 className="summary-text-heading">Api Version</h4>
          <h5 className="summary-text">{deviceApiLevel}</h5>
        </div>
      )}

      {deviceManufacturer !== undefined && (
        <div>
          <h4 className="summary-text-heading">Device Manufacturer</h4>
          <h5 className="summary-text">{deviceManufacturer}</h5>
        </div>
      )}

      {deviceModel !== undefined && (
        <div>
          <h4 className="summary-text-heading">Device Model</h4>
          <h5 className="summary-text">{deviceModel}</h5>
        </div>
      )}

      {deviceName !== undefined && (
        <div>
          <h4 className="summary-text-heading">Device Name</h4>
          <h5 className="summary-text">{deviceName}</h5>
        </div>
      )}
    </div>
  );
};
