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
`appium  --allow-insecure chromedriver_autodownload --use-plugins=appium-reporter`

### Run tests
`npm run test`