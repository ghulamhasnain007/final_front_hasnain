import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import axios from 'axios';
import student from '../token/student.js';
import { AuthContext } from '../Context/AuthContext.jsx';

const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState({});
  const { auth} = useContext(AuthContext)

  const totalClasses = async () => {
    const user = auth.student;
    // console.log(auth);
    
    // const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.userData.id;
    try {
      const response = await student.get(`/point/get/${id}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    totalClasses();
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Student Dashboard</Title>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card
            title="Total Class Join"
            bordered={false}
            style={{ backgroundColor: '#40a9ff', color: '#fff', borderRadius: "39px 12px 74px 0px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{data.class_join || 0}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card
            title="Total Submission"
            bordered={false}
            style={{ backgroundColor: '#40a9ff', color: '#fff', borderRadius: "39px 12px 74px 0px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{data.submission || 0}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card
            title="Total Points"
            bordered={false}
            style={{ backgroundColor: '#40a9ff', color: '#fff', borderRadius: "39px 12px 74px 0px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{data.total_point || 0}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card
            title="Total Quiz Score"
            bordered={false}
            style={{ backgroundColor: '#40a9ff', color: '#fff', borderRadius: "39px 12px 74px 0px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
          >
            <p style={{ fontSize: '24px', textAlign: 'center' }}>{data.totalQuizScore || 0}</p>
          </Card>
        </Col>
      </Row>
  <br /> <br />
    </div>
  );
};

export default Dashboard;
