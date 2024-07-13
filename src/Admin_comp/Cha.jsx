import React from 'react';
import { Column } from '@ant-design/charts';
import moment from 'moment';

const ColumnChart = () => {
  const data = [
    { date: '2024-07-01', category: 'Assignments', count: 5 },
    { date: '2024-07-01', category: 'Points', count: 10 },
    { date: '2024-07-01', category: 'Quiz Points', count: 7 },
    { date: '2024-07-01', category: 'Tasks Completed', count: 4 },
    { date: '2024-07-01', category: 'Projects', count: 6 },
    { date: '2024-07-01', category: 'Exams', count: 9 },
    { date: '2024-07-02', category: 'Assignments', count: 3 },
    { date: '2024-07-02', category: 'Points', count: 8 },
    { date: '2024-07-02', category: 'Quiz Points', count: 5 },
    { date: '2024-07-02', category: 'Tasks Completed', count: 6 },
    { date: '2024-07-02', category: 'Projects', count: 4 },
    { date: '2024-07-02', category: 'Exams', count: 7 },
    { date: '2024-07-03', category: 'Assignments', count: 7 },
    { date: '2024-07-03', category: 'Points', count: 15 },
    { date: '2024-07-03', category: 'Quiz Points', count: 10 },
    { date: '2024-07-03', category: 'Tasks Completed', count: 9 },
    { date: '2024-07-03', category: 'Projects', count: 8 },
    { date: '2024-07-03', category: 'Exams', count: 11 },
    // Add more daily data here
  ];

  const config = {
    data,
    xField: 'date',
    yField: 'count',
    seriesField: 'category',
    colorField: 'category',
    isGroup: true,
    columnWidthRatio: 0.8,
    xAxis: {
      type: 'timeCat',
      tickCount: 5,
      label: {
        formatter: (v) => moment(v).format('MM-DD'),
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
    tooltip: {
      customContent: (title, items) => {
        return `<div style="padding: 10px;">
                  <div style="margin-bottom: 5px; font-weight: bold;">${title}</div>
                  ${items.map(item => (
                    `<div key={item.name} style="color:${item.color};">
                       <span style="margin-right: 10px;">${item.name}:</span>
                       <span>${item.value}</span>
                     </div>`
                  )).join('')}
                </div>`;
      },
    },
    legend: { position: 'top-left' },
  };

  return (
    <div>
      <Column {...config} />
    </div>
  );
};

export default ColumnChart;
