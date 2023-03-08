import React, { useEffect } from 'react';

export const Command = (props) => {
  let data = props.data;
  let sessionId = props.sessionId;
  let cmd0 = props.cmd0;
  let cmd1 = props.cmd1;

  let dataId = cmd0 + cmd1;
  let commandData = data.sessions[sessionId].data[dataId];

  let args = commandData['args'];
  let execTime = args['execution time'];
  let request = args['request'];
  let response = args['response'];
  let error = args['error']

  return (
    <div>
      <div className="test-summary-page">
        <h5 className="test-summary-header summary-text-heading">{cmd0}</h5>
        <div className="container-row">
          {commandData.img && commandData.img !== 'undefined' && commandData.img.length > 0 && <img className="screenshot" src={commandData.img} alt="No image" />}
          <div className="test-info">
            <div className="test-info-table">
              <table className="table" id="table" rules="groups">
                <thead className="table-header">
                  <tr>
                    <th scope="col">Key</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody id="metadata">
                  {execTime && (
                    <tr className="table-row">
                      <th>Time Taken</th>
                      <td>{execTime}</td>
                    </tr>
                  )}
                  {sessionId && (
                    <tr className="table-row">
                      <th>Session Id</th>
                      <td>{sessionId}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="other-info">
              {request && (
                <div>
                  <h4 className="summary-text-heading">Request</h4>
                  <h6 className="json-text">{JSON.stringify(request, undefined, 2)} </h6>
                </div>
              )}
              {response && (
                <div>
                  <h4 className="summary-text-heading">Response</h4>
                  <h6 className="json-text">{JSON.stringify(response, undefined, 2)} </h6>
                </div>
              )}
              {error && (
                <div>
                  <h4 className="summary-text-heading">Error</h4>
                  <h6 className="json-text">{error} </h6>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
