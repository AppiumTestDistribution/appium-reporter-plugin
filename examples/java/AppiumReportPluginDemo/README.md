#### This is a sample implementation of appium-reporter-plugin using 
 Junit5 - unit testing fw
 unirest - for making api calls to reporter plugin bindings.

#### Install driver and appium-reporter-plugin
```shell
appium driver install uiautomator2
appium plugin install --source=npm appium-reporter-plugin
```

#### Run tests
Start appium with 
```shell
appium --use-plugins=appium-reporter-plugin
```
Run test
```shell
mvn test 
```

#### View report generated
```shell
open report.html
```