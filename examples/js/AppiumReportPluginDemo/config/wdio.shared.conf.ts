const fs = require('fs');

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: [],
    capabilities: [],
    logLevel: 'debug',
    bail: 0,
    baseUrl: 'http://the-internet.herokuapp.com',
    waitforTimeout: 45000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 3 * 60 * 1000, // 3min
    },
    services: [[
        'appium',
        {
            command: 'appium',
            args: {
                relaxedSecurity: true,
                address: 'localhost',
                usePlugins: 'appium-reporter-plugin',
                log: './appium.log',
            },
        },
    ]],
    port: 4723,
    afterTest: async function (
        test, context, { error, result, duration, passed, retries }
    ) {
        const sessionId = driver.sessionId;
        const testName = `${test.title} in ${duration / 1000} s`;
        const boolTestStatus = passed;
        console.log('setTestInfo: %s', testName);
        let testStatus = 'FAILED';
        if (boolTestStatus) {
            testStatus = 'PASSED';
        }

      await global.setTestInfoGlobal(sessionId, testName, testStatus, error);
    },

    after: async function (result, capabilities, specs)  {
        await global.getReportGlobal('andoird');
    },

    before: async function (capabilities, specs) {
        global.getReportGlobal = async function (currentOS) {
            const url = 'http://localhost:4723/getReport';
            const response = await fetch(url).catch(rejected => {
                console.log('*********** Failed to make fetch call in after');
                console.log(rejected);
            });
            const data = await response.text();

            // Create Report File
            const fileName = `Report_${currentOS}_${Math.floor(Date.now() / 1000) }`;
            fs.writeFile(`./${fileName}.html`, data, 'utf-8', (err: any) => {
                if (err) throw err;
            });

            // delete report data from plugin
            const urlD = 'http://127.0.0.1:4723/deleteReportData';
            await fetch(urlD, { method: 'DELETE' }).catch(rejected => {
                console.log('*********** Failed to delete report data');
                console.log(rejected);
            });
        };

        // api call to setTestinfo binding is made with params
        global.setTestInfoGlobal = async function (sessionId, testName, testStatus, error) {
            const url = 'http://localhost:4723/setTestInfo';
            const reqBody = {};
            reqBody.sessionId = sessionId;
            reqBody.error = `${error}`;
            reqBody.testName = testName;
            reqBody.testStatus = testStatus;

            await fetch(url, {
                method: 'post',
                body: JSON.stringify(reqBody),
                headers: { 'Content-Type': 'application/json' }
            }).catch(rejected => {
                console.log('*********** Failed to make fetch call');
                console.log(rejected);
            });
        };
    },

};
