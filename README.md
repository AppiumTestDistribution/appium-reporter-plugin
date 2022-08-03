# appium-server-reporter


### Intro
`appium-server-reporter` is appium 2.0 plugin, for generating simple html report with screenshots. Report is generated at server side and be fetched from server. To generate report and fetch the report at client side, server binding `session/:sessionId/getReport` is provided. 


`session/:sessionId/getReport` has binding as below 
    
    '/session/:sessionId/getReport': {
      POST: {
        command: 'getReport',
        payloadParams: { optional: ['testName', 'testStatus', 'error'] },
      },
    }
  
testName, testStatus and error are optional params. If testName, testStatus and error are provided, they would be used to populated data in `Test Status` section. 

Sample implementation can be found in tests.


### Build 
`npm run build`

 ### Install 
 `npm run install-plugin`

### Re-Install 
 `npm run reinstall-plugin`
  
### Start appium server with plugin
`appium  --allow-insecure chromedriver_autodownload --use-plugins=appium-server-reporter`

### Run tests
`npm run test`

### Sample Report
![Sample Report](https://github.com/AppiumTestDistribution/appium-server-reporter/blob/main/images/Report.png)


ToDo
* expose resize params as arguments 
* githooks for lint and pretty
* github pipelines
* unit tests
* add tests for ios

PS: Delete once above are done. Order if items is not priority.
