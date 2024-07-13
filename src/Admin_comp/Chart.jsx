import React, { useEffect, useState } from 'react';
import { Bar } from '@ant-design/charts';
import { Button, Row, Col, Select } from 'antd';
import moment from 'moment';
import axios from 'axios';
import admin from '../token/admin.js'
const { Option } = Select;

const BarChart = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getAdminChart = async () => {
    try {
      const res = await admin.get('/adminuser/getchart');
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminChart();
  }, []);

  const filterData = (days) => {
    const filtered = data.filter(item => {
      const itemDate = moment(item.created_at);
      return itemDate.isSameOrAfter(moment().subtract(days, 'days'), 'day');
    });
    setFilteredData(filtered);
  };

  // Transform the data to a suitable format
  const transformedData = filteredData.flatMap(item =>
    Object.keys(item)
      .filter(key => ['Total_Students', 'Total_Tasks', 'Total_Classes', 'Total_submissions', 'Total_teacher'].includes(key))
      .map(key => ({
        date: item.created_at.slice(0,10),
        type: key,
        value: item[key],
      }))
  );

  const config = {
    data: transformedData,
    isGroup: true,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    color: ({ type }) => {
      switch (type) {
        case 'Total_Students': return '#1f77b4';
        case 'Total_Tasks': return '#ff7f0e';
        case 'Total_Classes': return '#2ca02c';
        case 'Total_submissions': return '#d62728';
        case 'Total_teacher': return '#9467bd';
        default: return '#1f77b4';
      }
    },
    label: {
      position: 'top',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    xAxis: {
      title: {
        text: 'Date',
      },
    },
    yAxis: {
      title: {
        text: 'Count',
      },
    },
    legend: {
      position: 'top-right',
    },
  };

  const handleSelectChange = (value) => {
    switch (value) {
      case 'today':
        filterData(0);
        break;
      case 'last3days':
        filterData(3);
        break;
      case 'last7days':
        filterData(7);
        break;
      case 'last30days':
        filterData(30);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Row gutter={16} justify="start">
          <Col>
            <Select defaultValue="today" style={{ width: 120 }} onChange={handleSelectChange}>
              <Option value="today">Today</Option>
              <Option value="last3days">Last 3 Days</Option>
              <Option value="last7days">Last 7 Days</Option>
              <Option value="last30days">Last 30 Days</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={getAdminChart} style={{ marginLeft: 8 }}>Reload</Button>
          </Col>
        </Row>
      </div>
      <Bar {...config} />
    </div>
  );
};

export default BarChart;
