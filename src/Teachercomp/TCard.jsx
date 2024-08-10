import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import axios from 'axios';
import teacher from '../token/teacher.js';
import { AuthContext } from '../Context/AuthContext.jsx';

const DashboardPage = () => {
  const [data, setData] = useState('');
  const { Title } = Typography;
  const { auth } = useContext(AuthContext)
  // Mock data for total counts
  const totalStudent = data.totalstudent ? data.totalstudent : '0';
  const totalClasses = data.totalclass ? data.totalclass : '0';
  const totalQuizzes = data.totalQuiz ? data.totalQuiz : '0';
  const totalTasks = data.totaltask ? data.totaltask : '0';

  let get = () => {
    const teacher_id = auth.teacher.userData.id;
    // const teacher_id = JSON.parse(localStorage.getItem('user')).userData.id;
    teacher.get(`/joinclass/get/${teacher_id}`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    get();
  }, []);

  const cardStyle = {
    borderRadius: "17px 42px 20px 0px",
    boxShadow: "-6px -1px 22px 3px rgba(34, 161, 204, 1)",
    background: "rgba(15, 16, 15, 0.01)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(3.6px)",
    WebkitBackdropFilter: "blur(3.6px)",
    border: "1px solid rgba(15, 16, 15, 0.75)",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const hoverEffect = {
    transform: "scale(1.05)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
  };

  return (
    <><br /><br /><br /><br />
    <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Teacher Dashboard</Title>
      <div style={{ background: '#ECECEC', padding: '30px', borderRadius: "39px 0px 39px 7px", margin: '0 auto', maxWidth: '1200px' }}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{ ...cardStyle }}
              onMouseEnter={(e) => (e.currentTarget.style = { ...cardStyle, ...hoverEffect })}
              onMouseLeave={(e) => (e.currentTarget.style = { ...cardStyle })}
            >
              <Statistic
                title="Total Students"
                value={totalStudent}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{ ...cardStyle }}
              onMouseEnter={(e) => (e.currentTarget.style = { ...cardStyle, ...hoverEffect })}
              onMouseLeave={(e) => (e.currentTarget.style = { ...cardStyle })}
            >
              <Statistic
                title="Total Class Created"
                value={totalClasses}
                valueStyle={{ color: '#096dd9' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{ ...cardStyle }}
              onMouseEnter={(e) => (e.currentTarget.style = { ...cardStyle, ...hoverEffect })}
              onMouseLeave={(e) => (e.currentTarget.style = { ...cardStyle })}
            >
              <Statistic
                title="Total Quizzes"
                value={totalQuizzes}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              hoverable
              style={{ ...cardStyle }}
              onMouseEnter={(e) => (e.currentTarget.style = { ...cardStyle, ...hoverEffect })}
              onMouseLeave={(e) => (e.currentTarget.style = { ...cardStyle })}
            >
              <Statistic
                title="Total Assigment Created"
                value={totalTasks}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardPage;
