import React, { useState, useEffect } from 'react';
import { Card, Select, Spin, Button } from 'antd';
import axios from 'axios';
import { Line } from '@ant-design/charts';
import teacher from '../token/teacher.js';

const { Option } = Select;

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const id = JSON.parse(localStorage.getItem('techerdata')).userData.id

      const response = await teacher.get(`/tchart/chart/${id}`);
      console.log('Fetched data:', response.data); // Log fetched data
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredData(data.map(item => ({
        date: item.created_at.slice(0, 10) ? item.created_at.slice(0, 10) : item.created_at,
        value: (item.totalStudents || 0) + (item.totalTasks || 0) + (item.totalClasses || 0) + (item.totalquiz || 0),
        category: 'total',
      })));
    } else {
      setFilteredData(data.map(item => ({
        date: item.created_at.slice(0, 10) ? item.created_at.slice(0, 10) : item.created_at,
        value: item[filter] || 0,
        category: filter,
      })));
    }
  }, [filter, data]);

  const config = {
    data: filteredData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        formatter: (value) => `${value}`,
      },
    },
    legend: {
      position: 'top',
    },
    height: 400,
  };

  return (
    <div style={{ padding: '50px' }}>
      <Select
        defaultValue="all"
        style={{ width: 200, marginBottom: '20px' }}
        onChange={setFilter}
      >
        <Option value="all">All</Option>
        <Option value="totalStudents">Total Students</Option>
        <Option value="totalTasks">Total Tasks Created</Option>
        <Option value="totalClasses">Total Classes Created</Option>
        <Option value="totalquiz">Total Quiz</Option>
      </Select>
      <Button onClick={fetchData} type='primary' style={{ marginLeft: 10 }} >Reload</Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ textAlign: 'center' }}>Daily Summary Overview</h2>
          <Line {...config} />
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
