import { join } from 'path';
import { config } from './wdio.shared.conf';

config.specs = [
    './tests/specs/**/app.*.spec.ts',
];

config.capabilities = [
    {
        platformName: 'Android',
        maxInstances: 1,
        'appium:deviceName': 'Pixel_3_10.0',
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'uiautomator2',
        'appium:app': join(process.cwd(), '../../apps/android.apk'),
        'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
        'appium:newCommandTimeout': 240,
    }
];

exports.config = config;
