import React, { useState, useLayoutEffect } from "react";
import { TestStatus } from "./TestStatus";
import { Command } from "./Command";

export const Test = (props) => {
  let sessionId = props.sessionId;
  let data = props.data;
  let session = data.sesssionData[sessionId];
  let showTestSummary = props.showTestSummary;
  let setShowTestSummary = props.setShowTestSummary;

  const [selectedCommand0, setSelectedCommand0] = useState(null);
  const [selectedCommand1, setSelectedCommand1] = useState(null);

  const CommandTab = ({ cmd0, cmd1 }) => {
    return (
      <li
        className={
          !showTestSummary
            ? selectedCommand0 == cmd0 && selectedCommand1 == cmd1
              ? "sidebar-link active"
              : "sidebar-link"
            : "sidebar-link"
        }
      >
        <button
          className="link-text"
          onClick={() => {
            setSelectedCommand0(cmd0);
            setSelectedCommand1(cmd1);
            setShowTestSummary(false);
          }}
        >
          {cmd0}
        </button>
      </li>
    );
  };

  return (
    <div className="container-row">
      <nav className="sidebar lowered" id="test-navigation">
        <h6 className="sidebar-heading centered">
          <span>Test Status</span>
        </h6>
        <ul className="sidebar-links" id="testSummary">
          <li
            className={showTestSummary ? "sidebar-link active" : "sidebar-link"}
          >
            <button
              className="link-text"
              onClick={() => {
                setShowTestSummary(true);
                setSelectedCommand0(null);
                setSelectedCommand1(null);
              }}
            >
              Status
            </button>
          </li>
        </ul>
        <h6 className="sidebar-heading space-around">
          <span>Commands</span>
        </h6>
        <ul className="sidebar-links" id="commandLinks">
          {session.cmd.map((cmd, key) => {
            return (
              <div key={key}>
                <CommandTab cmd0={cmd[0]} cmd1={cmd[1]} />
              </div>
            );
          })}
        </ul>
      </nav>
      {showTestSummary && <TestStatus data={data} sessionId={sessionId} />}
      {!showTestSummary && selectedCommand0 && selectedCommand1 && (
        <Command
          data={props.data}
          sessionId={props.sessionId}
          cmd0={selectedCommand0}
          cmd1={selectedCommand1}
        />
      )}
    </div>
  );
};
