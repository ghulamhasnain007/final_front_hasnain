import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Collapse, Typography } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Smit from './Smit'
const { Title, Paragraph } = Typography;
const getItems = (panelStyle) => [
  {
    key: '1',
    label: '1 : Statistics',
    children: <p>View assignment statistics at a glance.</p>,
    style: panelStyle,
  },
  {
    key: '2',
    label: '2 : Join Classroom',
    children: <p>Easily join classrooms and start doing tasks.</p>,
    style: panelStyle,
  },
  {
    key: '3',
    label: '3 : Join Quiz',
    children: <p>Join and take quizzes to test your knowledge.</p>,
    style: panelStyle,
  },
];

const getTeacherItems = (panelStyle) => [
  {
    key: '1',
    label: '1 : Create Classroom',
    children: <p>Create and manage the classrooms with ease.</p>,
    style: panelStyle,
  },
  {
    key: '2',
    label: '2 : Add New Task',
    children: <p>Add new tasks and assignments for the students.</p>,
    style: panelStyle,
  },
  {
    key: '3',
    label: '3 : Check Tasks',
    children: <p>Check and grade tasks efficiently.</p>,
    style: panelStyle,
  },
  {
    key: '4',
    label: '4 : Create Quiz',
    children: <p>Create and manage quizzes for students.</p>,
    style: panelStyle,
  },
  {
    key: '5',
    label: '5 : Manage Quizzes',
    children: <p>Enable or disable quizzes, and track quiz statistics.</p>,
    style: panelStyle,
  },
];

const ContentComponent = () => {
  const [role, setRole] = useState('');

  const panelStyle = {
    marginBottom: 24,
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #d9d9d9',
  };

  useEffect(() => {
    let role = JSON.parse(localStorage.getItem('role'));
    setRole(role);
  }, []);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div className="content">
      <div className="home-container" style={{ backgroundColor: '#f0f2f5', padding: '50px 20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <h1 className="home-title" data-aos="fade-right"
             style={{ color: '#40a9ff', fontSize: '2.5rem',
              textShadow : '-5px 6px 6px rgba(66, 68, 90, 1)' }}
             >
              Welcome to the SMIT Assignment Submission Portal
            </h1>
            <p className="home-description" data-aos="fade-up-right" style={{ color: '#52c41a', fontSize: '1.2rem'  ,textShadow : '-5px 6px 6px rgba(66, 68, 90, 1)'}}>
              Submit, track, and receive feedback on your assignments seamlessly.
            </p>
            <Link to={role === 'student' ? '/student/dashboard' : role === 'teacher' ? '/teacher/dashboard' : !role ? 'student/register' : '/admin/dashboard'}>
              <Button
                className="home-button"
                data-aos="zoom-in"
                type="primary"
                size="large"
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', borderRadius: '5px' }}
              >
                {role ? 'Dashboard' : 'Get Started'}
              </Button>
            </Link>
          </Col>
          
          <Col xs={24} sm={12} md={12} lg={12} style={{width : '80%'}}   >
            {/* <img
              className="home-image"
              data-aos="fade-down-left"
              src="https://tse4.mm.bing.net/th?id=OIG2.ghqug.oXg8fzA9zIh0xA&pid=ImgGn"
              alt="Assignment Submission"
              style={{ width: '100%', borderRadius: '10px' }}
            /> */}

            <Smit />
          </Col>
        </Row>
      </div>

      <section className="main-feature" 
      
      // style={{ margin: '50px 0', padding: '50px 20px' }}


      >
        <center>
          <h2 data-aos="zoom-in-down" style={{ color: '#1890ff', marginBottom: '20px' }}>OUR MAIN FEATURE</h2>
          <Card
            data-aos="fade-up"
            style={{
              borderRadius: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              padding: '10px',
              maxWidth: '800px',
              margin: '20px 0',
              backgroundColor: 'transparent',
            }}
          >
            <h1 style={{ color: '#40a9ff' }}>AI Integration</h1>
            <h4>
              Our advanced AI system automatically evaluates assignments, providing fast and accurate feedback to students and teachers.
            </h4>
          </Card>
        </center>
      </section>

      <section className="other-features" style={{ margin: '50px 0', padding: '50px 20px' }}>
        <center>
          <h2 data-aos="zoom-out-right" style={{ color: '#40a9ff' }}>OUR OTHER FEATURES</h2>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title="ROLE MANAGEMENT"
                bordered={false}
                data-aos="flip-left"
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: '#f0f2f5',
                }}
              >
                Manage roles and permissions seamlessly.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title="DEADLINE MANAGEMENT"
                bordered={false}
                data-aos="flip-left"
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: '#f0f2f5',
                }}
              >
                Keep track of assignment deadlines.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                title="NOTIFICATION SYSTEM"
                bordered={false}
                data-aos="flip-left"
                style={{
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  backgroundColor: '#f0f2f5',
                }}
              >
                Receive timely notifications.
              </Card>
            </Col>
          </Row>
        </center>
      </section>

      <section className="student-features" style={{ margin: '50px 0' }}>
        <center>
          <h2 data-aos="zoom-in-down" style={{ color: '#40a9ff' }}>OUR STUDENT FEATURES</h2>
          <Collapse
            data-aos="fade-up"
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#f0f2f5', maxWidth: '800px', margin: '20px 0' }}
            items={getItems(panelStyle)}
            onChange={() => {
              const elements = document.querySelectorAll('.ant-collapse-content');
              elements.forEach((element) => {
                element.style.transition = 'height 0.3s ease';
              });
            }}
          />
        </center>
      </section>

      <section className="teacher-features">
        <center>
          <h2 data-aos="zoom-in-down" style={{ color: '#40a9ff' }}>OUR TEACHER FEATURES</h2>
          <Collapse
            data-aos="fade-up"
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#f0f2f5', maxWidth: '800px', margin: '20px 0' }}
            items={getTeacherItems(panelStyle)}
            onChange={() => {
              const elements = document.querySelectorAll('.ant-collapse-content');
              elements.forEach((element) => {
                element.style.transition = 'height 0.3s ease';
              });
            }}
          />
        </center>
      </section>
      <br /><br />
      <Card title="Why Choose Our Portal?" style={{ margin: '20px', backgroundColor: 'transparent' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <p>
            Our portal is a comprehensive and user-friendly solution designed to streamline the assignment submission process for students and teachers alike. Here's why you should choose our portal:
          </p>
        </Col>

        <Col xs={24}>
          <h3>Key Features</h3>
        </Col>

        <Col xs={24} md={12}>
          <Card type="inner" title="Our Portal" bordered={false}>
            <ul>
              <li><strong>AI-Powered Assignment Evaluation:</strong> Ensures assignments are evaluated with precision, providing instant and accurate feedback.</li>
              <li><strong>Real-Time Collaboration:</strong> Allows for seamless communication with features like instant feedback and real-time updates.</li>
              <li><strong>Efficient Task Management:</strong> Simplifies task management with deadline tracking, progress monitoring, and easy submission options.</li>
              <li><strong>Performance Analytics:</strong> Offers advanced tools to track student progress and make data-driven decisions.</li>
              <li><strong>Role-Based Access Control:</strong> Provides secure, role-based access to the most relevant features.</li>
              <li><strong>Easy Integration:</strong> Integrates seamlessly with existing tools, including popular platforms like Google Classroom.</li>
              <li><strong>User-Friendly Interface:</strong> Designed for users of all tech-savviness levels with a clean, intuitive layout.</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card type="inner" title="Google Classroom" bordered={false}>
            <ul>
              <li>Basic assignment submission and feedback options without AI-powered precision.</li>
              <li>Real-time collaboration limited to comments and document sharing.</li>
              <li>Standard task management with basic deadline and submission tracking.</li>
              <li>Limited analytics tools with basic performance tracking.</li>
              <li>Standard role-based access, but less customizable.</li>
              <li>Primarily focused on Google ecosystem integration, limiting flexibility with other tools.</li>
              <li>User-friendly interface but may lack advanced customization options.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </Card>
    </div> 
  );
};

export default ContentComponent;
