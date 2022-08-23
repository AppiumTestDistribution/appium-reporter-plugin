# appium-reporter-plugin

### Intro
`appium-reporter-plugin` is appium 2.0 plugin, for generating simple html report with screenshots. Consolidated Report is generated for all the test that ran in the appium session. Report can be fetched from server and be written to file (just like screenshots).

### When to use
`appium-reporter-plugin` would be handly, if you need to 
* Take screenshot at every step of your test (not just at test failure / end)
* Generate a simple standalone html report with screenshots

### Sample Report Demo
https://user-images.githubusercontent.com/2680841/183408319-cf7a550d-2b74-4732-8a13-e80c57524467.mov
 
### How to use

To install plugin 

```appium plugin install --source=npm appium-reporter-plugin```

Start appium server with plugin

```appium --use-plugins=appium-reporter-plugin```


Sample implementation can be found in `test/demo/demo.spec.js` and  `test/demo/base.js`

### Mappings / Commands

`appium-reporter-plugin` assumes every test/spec uses new driver session. For commands invoked on the driver session, screenshot and metrics are captured at server side. At the end of the test i.e., before deleting the driver session, `driver.setTestInfo(..)` should be called to map test information. After all the tests are completed `driver.getReport()` can be called to fetch the html report and written to file. 

#### setTestInfo
For mapping test information to data collected, server binding `POST: /session/:sessionId/setTestInfo` is exposed. This binding accepts JSON payload with keys as mentioned below

| key         | Description                    | Type      | Accepted Values |
| ----------- | -----------                    | ----      | --------------- |
| testName    | Name of the test               | Mandatory | any string      |
| testStatus  | Test execution status          | Mandatory | PASSED, FAILED  |
| error       | Reason for test Failure        | Optinal   | any string      |

ex: 
```
    {testName: 'Sum of 1 and 2 should be 3', testStatus: 'PASSED'}
    {testName: 'Sum of 1 and 2 should be 4', testStatus: 'FAILED', error: 'Sum of 1 and 2 is 3'}
```

#### getReport

After execution of all the tests, report can be downloaded from server using `GET: /getReport`. `getReport` returns a html report with screenshots as a string.  


Note: 
1. `appium-reporter-plugin` doesn't gather test results data from any unit test framework. 
2. Bindings exposed by this plugin are not default W3C binding, hence these commands cant be drirecly called on driver object. Either wdio setCommand should be used or direct api call can be made.
  

### Build 
`npm run build`

 ### Install from code base
 ```
 1. set APPIUM_HOME to a local directory and install drivers needed
  export APPIUM_HOME=~/Documents/AppiumTestDistribution/appium-reporter-plugin/local_appium_home

 2. npm run install-plugin
 ```

### Re-Install from code base
 `npm run reinstall-plugin`
  
### Start appium server with plugin
`appium --use-plugins=appium-reporter-plugin`

### Run tests
`npm run test`

Note : If you are overriding APPIIM_HOME make sure drivers are installed 
```  
appium driver install xcuitest
appium driver install uiautomator2
```





ToDo
* explore event timing apis
* Add details such as - 
    sessionId
    overall timing of test
    number of android and ios
    device info of test run
* expose the exclusion command list 
* expose screenshot resize params as arguments 
* githooks for lint and pretty
* github pipelines
* add tests for ios
