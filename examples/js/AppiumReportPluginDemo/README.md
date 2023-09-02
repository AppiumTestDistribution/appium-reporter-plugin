

#### Install the android driver and appium-reporter-plugin
```
appium driver install uiautomator2
appium plugin install --source=npm appium-reporter-plugin
```


### start appium with plugin
```
appium --use-plugins=appium-reporter-plugin
```

#### Run Tests
```
npm run test:android
```


#### View reports 
HTML file starting with `Report_android` would be created in root of this npm project.


** https://github.com/webdriverio/appium-boilerplate is used as test code.