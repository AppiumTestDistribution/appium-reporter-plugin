# appium-reporter-plugin
![example workflow](https://github.com/AppiumTestDistribution/appium-reporter-plugin/actions/workflows/node.js.yml/badge.svg)



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


Sample implementation can be found @
1. JS Implementation -> https://github.com/AppiumTestDistribution/appium-reporter-plugin/tree/main/examples/js/AppiumReportPluginDemo
2. Java Implementation -> https://github.com/AppiumTestDistribution/appium-reporter-plugin/tree/main/examples/java/AppiumReportPluginDemo

### Mappings / Commands

`appium-reporter-plugin` assumes every test/spec uses new driver session. For commands invoked on the driver session, screenshot and metrics are captured at server side. At the end of the test i.e., before deleting the driver session, `/setTestInfo` should be called to map test information. After all the tests are completed `/getReport` can be called to fetch the html report and written to file. To clear the test info stored on the server, `/deleteReportData`
 can be used. 

#### setTestInfo
For mapping test information to data collected, server binding `POST: /setTestInfo` is exposed. This binding accepts JSON payload with keys as mentioned below

| key         | Description                    | Type      | Accepted Values                                                     |
| ----------- | -----------                    | ----      | ---------------                                                     |
| sessionId   | driver's sessionId             | Mandatory | driver's sessionId or null if session is not created (pendig test)  |
| testName    | Name of the test               | Mandatory | any string                                                          |
| testStatus  | Test execution status          | Mandatory | PASSED, FAILED, PENDING, All other string considered as unknown     |
| error       | Reason for test Failure        | Optinal   | any string                                                          |

ex: 
```
    {sessionId: 'asdas-asdasd-asdasda-asdasdasd', testName: 'Sum of 1 and 2 should be 3', testStatus: 'PASSED'}
    {sessionId: 'asdas-asdasd-asdasda-asdasdasd', testName: 'Sum of 1 and 2 should be 4', testStatus: 'FAILED', error: 'Sum of 1 and 2 is 3'}
    {sessionId: null, testName: 'Sum of 1 and 2 should be 3', testStatus: 'PENDING'}
```

#### getReport

After execution of all the tests, report can be downloaded from server using `GET: /getReport`. `getReport` returns a html report with screenshots as a string.  

### deleteReportData
screenshots and test information is stored on server and this occupies space. To clear the space and delete all the test infomation on server `DELETE: /deleteReportData` can be used.

-- demo.spec.js has working example and we recommamd checking the implementation. 

Note: 
1. `appium-reporter-plugin` doesn't gather test results data from any unit test framework. 
2. Bindings exposed by this plugin are not default W3C binding, hence these commands can't be drirecly called on driver object. Either wdio setCommand should be used or direct api call can be made.
  

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
* expose the exclusion command list 
* expose screenshot resize params as arguments 
* githooks for lint and pretty
