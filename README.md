# appium-reporter-plugin


### Intro
`appium-reporter-plugin` is appium 2.0 plugin, for generating simple html report with screenshots. Consolidated Report is generated for all the test that ran in the appium session. Report can be fetched from server and be written to file (just like screenshots).

 Test name, test result & error should be mapped to driver session at the end of each test. For setting test info, below mapping is exposed

    POST: /session/:sessionId/setTestInfo
        payloadParams: {
          required: ['testName', 'testStatus'],
          optional: ['error'],
        }

After execution of all the tests, report can be downloaded from server. For this, below mapping is provided.
      
      GET: /getReport

`getReport` returns a html report with screenshots as a string.  


### setTestInfo
Sample payload for `/session/:sessionId/setTestInfo` is as below

ex: 
```
    {testName: 'Sum of 1 and 2 should be 3', testStatus: 'PASSED'}
    {testName: 'Sum of 1 and 2 should be 4', testStatus: 'FAILED', error: 'Sum of 1 and 2 is 3'}
```

| Param       | Description                    | Type      | Accepted Values |
| ----------- | -----------                    | ----      | --------------- |
| testName    | Name of the test               | Mandatory | any string      |
| testStatus  | Test execution status          | Mandatory | PASSED, FAILED|
| error       | Reason for test Failure        | Optinal   | any string      |

Note: `appium-reporter-plugin` doesn't gather test results data from any unit test framework. Params mentioned above should be provided to get test result information populated in report.

Sample implementation can be found in tests. `test/browser.spec.js`


### Build 
`npm run build`

 ### Install 
 `npm run install-plugin`

### Re-Install 
 `npm run reinstall-plugin`
  
### Start appium server with plugin
`appium  --allow-insecure chromedriver_autodownload --use-plugins=appium-reporter-plugin`

### Run tests
`npm run test`

### Sample Report
![Sample Report](https://github.com/AppiumTestDistribution/appium-reporter-plugin/blob/main/images/Report.png)


ToDo
* explore event timing apis - to get the time taken for cmd execution
* Add details such as - 
    sessionId
    overall timing of test
    number of android and ios
    device info of test run
* expose the exclusion command list 
* expose resize params as arguments 
* githooks for lint and pretty
* github pipelines
* unit tests
* add tests for ios
