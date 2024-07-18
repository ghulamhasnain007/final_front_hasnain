import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';

const ColumnChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let id = JSON.parse(localStorage.getItem('user')).userData.id;
      try {
        const response = await axios.get(`http://localhost:3000/api/result/${id}`);
        console.log('Fetched data:', response.data); // Log fetched data
        setData(response.data.result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          const score = params[0].data;
          const passingPoint = data[params[0].dataIndex].passing_point;
          const status = score >= passingPoint ? 'Pass' : 'Fail';
          return `
            <div>${params[0].axisValue}</div>
            <div>Score: ${score}</div>
            <div>Passing Point: ${passingPoint}</div>
            <div>Status: ${status}</div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.quizName),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Score',
        nameLocation: 'center',
        nameGap: 40
      },
      series: [
        {
          name: 'Score',
          data: data.map(item => item.score),
          type: 'bar',
          itemStyle: {
            color: params => params.data >= data[params.dataIndex].passing_point ? 'green' : 'red'
          }
        },
        {
          name: 'Passing Point',
          data: data.map(item => item.passing_point),
          type: 'line',
          itemStyle: {
            color: 'blue'
          }
        }
      ]
    };
  };

  return (
    <Card
      title="Quiz Scores Overview"
      style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <div style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        ) : (
          <ReactECharts option={getOption()} style={{ height: '400px' }} />
        )}
      </div>
    </Card>
  );
};

export default ColumnChart;
