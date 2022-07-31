# appium-server-reporter


### Intro
`appium-server-reporter` is appium 2.0 plugin, for generating html report with screenshots at server side. To generate report and fetch the report at client side, server binding `session/:sessionId/getReport` is provided. 

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


ToDo
* Add examples of using plugin in readme
* Make report pretty 
* expose resize params as arguments 
* Standalone server to view reports
* Ability to delete old reports 
* Flag retry commands
* add extra details to report ex: time take, pass/fail status etc
* Add New commands for adding test title, test pass/fail status
* githooks for lint and pretty
* github pipelines
* unit tests
* Simplify report saving in tests. 
* add tests for ios

PS: Delete once above are done. Order if items is not priority.