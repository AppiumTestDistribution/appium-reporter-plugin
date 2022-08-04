# appium-reporter-plugin


### Intro
`appium-reporter-plugin` is appium 2.0 plugin, for generating simple html report with screenshots. Report is generated at server side and can be fetched from server and written to file (just like screenshots). To generate report and fetch the report at client side, server binding `session/:sessionId/getReport` is provided. 

    
    '/session/:sessionId/getReport': {
      POST: {
        command: 'getReport',
        payloadParams: { 
          optional: [ 
                      'testName', 
                      'testStatus', 
                      'error'
                    ] 
          },
      },
    }
  
`getReport` returns a html report with screenshots as a string. It has to be written to a file at client side.   

If testName, testStatus and error are provided, they would be used to populated data in `Test Status` section. 

| Param       | Description                    | Type      | Accepted Values |
| ----------- | -----------                    | ----      | --------------- |
| testName    | Name of the test               | Optinal   | any string      |
| testStatus  | Test execution status          | Optional  | Passed, Failed  |
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
* expose resize params as arguments 
* githooks for lint and pretty
* github pipelines
* unit tests
* add tests for ios

PS: Delete once above are done. Order if items is not priority.
