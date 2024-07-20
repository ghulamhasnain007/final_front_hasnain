import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import axios from 'axios';
import admin from '../token/admin.js';
const { Title } = Typography;


const Dashboard = () => {
  const [data, setData] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalQuizzes: 0,
    totalClasses: 0,
    totalTasks: 0,
    totalSubmissions: 0,
  });

  const fetchData = async () => {
    try {
      const response = await admin.get('/adminuser');
      setData({
        totalTeachers: response.data.allteacher || 0,
        totalStudents: response.data.allstudent || 0,
        totalQuizzes: response.data.totalquiz || 0,
        totalClasses: response.data.totalclasses || 0,
        totalTasks: response.data.totaltask || 0,
        totalSubmissions: response.data.totalsubmission || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cardStyle = {
    borderRadius: "36px 5px 59px 4px",
    color: '#fff',
    textAlign: 'center',
  };

  const statisticStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' ,  borderRadius: "36px 5px 59px 4px" }}>
       <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Dashboard</Title>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ ...cardStyle, backgroundColor: '#1890ff' }}>
            <Statistic
              title="Total Teachers"
              value={data.totalTeachers}
              valueStyle={statisticStyle}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ ...cardStyle, backgroundColor: '#40a9ff' }}>
            <Statistic
              title="Total Students"
              value={data.totalStudents}
              valueStyle={statisticStyle}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ ...cardStyle, backgroundColor: '#69c0ff' }}>
            <Statistic
              title="Total Quizzes"
              value={data.totalQuizzes}
              valueStyle={statisticStyle}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ ...cardStyle, backgroundColor: '#95de64' }}>
            <Statistic
              title="Total Tasks"
              value={data.totalTasks}
              valueStyle={statisticStyle}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ ...cardStyle, backgroundColor: '#52c41a' }}>
            <Statistic
              title="Total Classes"
              value={data.totalClasses}
              valueStyle={statisticStyle}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ ...cardStyle, backgroundColor: '#389e0d' }}>
            <Statistic
              title="Total Submissions"
              value={data.totalSubmissions}
              valueStyle={statisticStyle}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
