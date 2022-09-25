const fs = require('fs');
const editJsonFile = require('edit-json-file');
import { parse } from 'node-html-parser';
const { v4: uuidv4 } = require('uuid');
import { htmlTemplatePath, jsonReportPath, testStatusValues } from './constants';

async function initReport(sessionID, deviceDetails) {
  if (sessionID && sessionID.length > 0) {
    let file = editJsonFile(jsonReportPath);
    file.append('sessions', sessionID);
    file.set(`testInfo.${sessionID}.deviceInfo`, deviceDetails);
    file.save();
  } else {
    throw 'Report creation failed because of invalid session ID';
  }
}

async function setTestInfo(sessionID, testName, testStatus, error = undefined) {
  if (sessionID === undefined || testName === undefined || testStatus === undefined)
    throw new Error('sessionID, testName, testStatus are mandatory arguments');

  let file = editJsonFile(jsonReportPath);
  const info = {};
  if (!testStatusValues.includes(testStatus.toUpperCase()))
    throw new Error(`Test status ${testStatus} is not valid state.`);

  info['testName'] = Buffer.from(testName, 'utf8').toString('base64');
  info['testStatus'] = Buffer.from(testStatus.toUpperCase(), 'utf8').toString('base64');
  if (error) info['error'] = Buffer.from(error, 'utf8').toString('base64');
  info['deviceInfo'] = file.get(`testInfo.${sessionID}.deviceInfo`);
  file.set(`testInfo.${sessionID}`, info);
  file.save();
}

async function setCmdData(sessionID, key, value, args) {
  let file = editJsonFile(jsonReportPath);
  const cmdId = await uuidv4();
  file.set(`sesssionData.${sessionID}.data.${key + cmdId}.img`, `${value}`);
  file.set(`sesssionData.${sessionID}.data.${key + cmdId}.args`, args);
  file.append(`sesssionData.${sessionID}.cmd`, [key, cmdId]);
  file.save();
}

async function buildReport() {
  let file = editJsonFile(jsonReportPath);
  const data = await fs.readFileSync(htmlTemplatePath, 'utf8');
  let dom = await parse(data);
  const webpack = require('webpack');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  const port = process.env.PORT || 3000;

  // set all data variable
  const allData = file.get();
  const dataScript = `
  <script>
    const data = ${JSON.stringify(allData)};
  </script>`;
  dom.getElementById('root').innerHTML = dataScript;

  webpack(
    {
      mode: 'development',
      entry: './src/App.js',
      output: {
        filename: 'bundle.js',
      },
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: [
              /node_modules/,
              '/constants.js',
              '/index.js',
              '/logger.js',
              '/plugin.js',
              '/reporter.js',
            ],
            use: ['babel-loader'],
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: 'src/template.html',
        }),
      ],
      devServer: {
        host: 'localhost',
        port: port,
        historyApiFallback: true,
        open: true,
      },
    },
    (err, stats) => {
      // [Stats Object](#stats-object)
      if (err || stats.hasErrors()) {
        // [Handle errors here](#error-handling)
      }
      // Done processing
    }
  );

  return dom.toString();
}

module.exports = {
  initReport,
  setCmdData,
  buildReport,
  setTestInfo,
};
