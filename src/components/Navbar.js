import React, { useState } from "react";
import { OverAllExecutionSummary } from "./OverallExecutionSummary";
import { Test } from "./Test";

export const Navbar = (props) => {
  let data = props.data.data;
  let sessions = data.sessions;
  const [filteredSessions, setFilteredSessions] = useState(sessions);
  const [showSummary, setShowSummary] = useState(true);
  const [selectTest, setSelectTest] = useState(null);
  const [showTestSummary, setShowTestSummary] = useState(true);

  const filter = (e) => {
    const value = e.target.value;
    if (value == 0) {
      setFilteredSessions(sessions);
      return;
    }

    let newFilteredSessions = [];
    let filterCondition = "PASSED";
    if (value == 2) {
      filterCondition = "FAILED";
    }
    data.sessions.map((sessionId, key) => {
      if (
        window.atob(data["testInfo"][sessionId]["testStatus"]) ===
        filterCondition
      ) {
        newFilteredSessions.push(sessionId);
      }
    });
    setFilteredSessions(newFilteredSessions);
  };

  const SessionTab = ({ sessionId, testName, testStatus }) => {
    return (
      <li
        className={
          !showSummary
            ? selectTest == sessionId
              ? "sidebar-link active"
              : "sidebar-link"
            : "sidebar-link"
        }
        data-state={testStatus}
      >
        <button
          className="link-text"
          onClick={() => {
            setShowSummary(false);
            setShowTestSummary(true);
            setSelectTest(sessionId);
          }}
        >
          {testName}
        </button>
      </li>
    );
  };

  return (
    <div className="container-row">
      <nav className="sidebar" id="test-navigation">
        <h6 className="sidebar-heading centered">
          <span>Execution Summary</span>
        </h6>
        <ul className="sidebar-links" id="overAllExecutionSummay">
          <li className={showSummary ? "sidebar-link active" : "sidebar-link"}>
            <button
              className="link-text"
              onClick={() => {
                setShowSummary(true);
                setSelectTest(null);
              }}
            >
              Summary
            </button>
          </li>
        </ul>
        <h6 className="sidebar-heading space-around">
          <span>Tests</span>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            onChange={(e) => filter(e)}
            id="filter"
          >
            <option value="0" defaultValue>
              All
            </option>
            <option value="1">Passed</option>
            <option value="2">Failed</option>
          </select>
        </h6>
        <ul className="sidebar-links" id="testLinks">
          {filteredSessions.map((sessionId, key) => {
            const testName = window.atob(
              data["testInfo"][sessionId]["testName"]
            );
            const testStatus = window.atob(
              data["testInfo"][sessionId]["testStatus"]
            );
            return (
              <div key={key}>
                <SessionTab
                  testName={testName}
                  testStatus={testStatus}
                  sessionId={sessionId}
                />
              </div>
            );
          })}
        </ul>
      </nav>
      {!showSummary && (
        <Test
          data={data}
          sessionId={selectTest}
          showTestSummary={showTestSummary}
          setShowTestSummary={setShowTestSummary}
        />
      )}
      {showSummary && <OverAllExecutionSummary data={data} />}
    </div>
  );
};
