const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 4723;
export const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/',
  logLevel: 'silent',
};

export const androidBrowserCapabilities = {
  platformName: 'Android',
  'appium:automationName': 'UIAutomator2',
  'appium:browserName': 'chrome',
};

export const androidAppCapabilities = {
  platformName: 'Android',
  'appium:uiautomator2ServerInstallTimeout': '50000',
  'appium:automationName': 'UIAutomator2',
  // replace the path absolute path of VodQA.apk under apps
  'appium:app': '/Users/dileepbellamkonda/Documents/ATD/appium-server-reporter/apps/VodQA.apk',
};

export const iOSCapabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:iPhoneOnly': true,
};
