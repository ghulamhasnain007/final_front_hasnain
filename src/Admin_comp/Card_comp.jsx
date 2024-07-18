import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import axios from 'axios';
import admin from '../token/admin.js';

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

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#3FA037', color: '#fff' }}>
            <Statistic
              title="Total Teachers"
              value={data.totalTeachers}
              prefix={<i className="anticon anticon-line-chart" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#6DB33F', color: '#fff' }}>
            <Statistic
              title="Total Students"
              value={data.totalStudents}
              prefix={<i className="anticon anticon-user" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#3FB33F', color: '#fff' }}>
            <Statistic
              title="Total Quizzes"
              value={data.totalQuizzes}
              prefix={<i className="anticon anticon-question-circle" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#37A03F', color: '#fff' }}>
            <Statistic
              title="Total Tasks"
              value={data.totalTasks}
              prefix={<i className="anticon anticon-schedule" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#4C7F32', color: '#fff' }}>
            <Statistic
              title="Total Classes"
              value={data.totalClasses}
              prefix={<i className="anticon anticon-class" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card bordered={false} style={{ backgroundColor: '#2E5934', color: '#fff' }}>
            <Statistic
              title="Total Submissions"
              value={data.totalSubmissions}
              prefix={<i className="anticon anticon-file-text" />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
