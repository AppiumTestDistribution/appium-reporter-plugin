import React, { useState } from 'react';
import { OverAllExecutionSummary } from './OverallExecutionSummary';
import { Test } from './Test';

export const Navbar = (props) => {
  let data = props.data.data;
  let tests = data.tests.map(test => test.testId);
  const [filteredTests, setFilteredTests] = useState(tests);
  const [showSummary, setShowSummary] = useState(true);
  const [selectTest, setSelectTest] = useState(null);
  const [showTestSummary, setShowTestSummary] = useState(true);

  const filter = (e) => {
    const value = e.target.value;
    if (value == 0) {
      setFilteredTests(tests);
      return;
    }

    let newFilteredTests = [];
    let filterCondition = 'PASSED';
    if (value == 2) {
      filterCondition = 'FAILED';
    }
    if (value == 3) {
      filterCondition = 'PENDING';
    }
    data.tests.map((test, key) => {
        const testStatus =test.testStatus;
        if(testStatus === filterCondition) {
            newFilteredTests.push(test.testId);
        }
    });
    setFilteredTests(newFilteredTests);
  };

  const SessionTab = ({testName, testStatus, testId, sessionId}) => {
    return (
      <li
        className={
          !showSummary
            ? selectTest == testId
              ? 'sidebar-link active'
              : 'sidebar-link'
            : 'sidebar-link'
        }
        data-state={testStatus}
      >
        <button
          className="link-text"
          onClick={() => {
            setShowSummary(false);
            setShowTestSummary(true);
            setSelectTest(testId);
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
          <li className={showSummary ? 'sidebar-link active' : 'sidebar-link'}>
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
            style={{ width: 'auto' }}
            onChange={(e) => filter(e)}
            id="filter"
          >
            <option value="0" defaultValue>
              All
            </option>
            <option value="1">Passed</option>
            <option value="2">Failed</option>
            <option value="3">Pending</option>
          </select>
        </h6>
        <ul className="sidebar-links" id="testLinks">
          {filteredTests.map((testId, key) => {
            const test = data.tests.filter(test => test.testId === testId)[0];
            const testName = test.testName;
            const testStatus = test.testStatus;
            const sessionId = test.sessionId;
            return (
              <div key={key}>
                <SessionTab testName={testName} testStatus={testStatus} testId={testId} sessionId={sessionId} />
              </div>
            );
          })}
        </ul>
      </nav>
      {!showSummary && (
        <Test
          data={data}
          testId={selectTest}
          showTestSummary={showTestSummary}
          setShowTestSummary={setShowTestSummary}
        />
      )}
      {showSummary && <OverAllExecutionSummary data={data} />}
    </div>
  );
};