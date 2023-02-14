import React from 'react';
import ChartJS from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';

export const Canvas = ({ passCount, failCount, pendingCount, unknownCount }) => {
  const labels = ['PASSED', 'FAILED', 'PENDING', 'UNKNOWN'];
  console.log(`Canvas passcount = ${passCount}; failCount = ${failCount}; pendingCount = ${pendingCount}; unknownCount = ${unknownCount}`);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Test Execution Result',
        data: [passCount, failCount, pendingCount, unknownCount],
        backgroundColor: ['rgb(46,139,87)', 'rgb(255, 99, 132)', 'rgb(51, 175, 255)', 'rgb(253, 218, 13)'],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};
