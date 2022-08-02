# appium-server-reporter


### Intro
`appium-server-reporter` is appium 2.0 plugin, for generating html report with screenshots. Report is generated at server side and be fetched from server. To generate report and fetch the report at client side, server binding `session/:sessionId/getReport` is provided. 

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
![Sample Report](https://github.com/AppiumTestDistribution/appium-server-reporter/tree/main/images/Report.png)


ToDo
* Add examples of using plugin in readme
* expose resize params as arguments 
* githooks for lint and pretty
* github pipelines
* unit tests
* Simplify report saving in tests. 
* add tests for ios

PS: Delete once above are done. Order if items is not priority.