import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import axios from 'axios';
import admin from '../token/admin.js'
const Dashboard = () => {
  const [data, setData] = useState({
    allteacher: 0,
    allstudent: 0,
    allusers: 0,
    totalclasses: 0,
    totaltask: 0,
    totalsubmission: 0,
  });

  const fetchData = async () => {
    try {
      const response = await admin.get('/adminuser');
      

      setData({
        totalTeachers: response.data.allteacher
          || 0,
        totalStudents: response.data.allstudent
          || 0,
        totalUsers: response.data.allusers
          || 0,
        totalClasses: response.data.totalclasses
          || 0,
        totalTasks: response.data.totaltask
          || 0,
        totalSubmissions: response.data.totalsubmission || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#3FA037' }}>
            <Statistic
              title="Total Teachers"
              value={data.totalTeachers}
              prefix={<i className="anticon anticon-line-chart" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#6DB33F' }}>
            <Statistic
              title="Total Students"
              value={data.totalStudents}
              prefix={<i className="anticon anticon-book" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#3FB33F' }}>
            <Statistic
              title="Total Users"
              value={data.totalUsers}
              prefix={<i className="anticon anticon-user" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#37A03F' }}>
            <Statistic
              title="Total Tasks"
              value={data.totalTasks}
              prefix={<i className="anticon anticon-profile" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#4C7F32' }}>
            <Statistic
              title="Total Classes"
              value={data.totalClasses}
              prefix={<i className="anticon anticon-bank" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#2E5934' }}>
            <Statistic
              title="Total Submissions"
              value={data.totalSubmissions}
              prefix={<i className="anticon anticon-file" />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
