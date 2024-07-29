import React, { useState,useEffect } from 'react';
import { Layout, Row, Col, Button, Card, Carousel, Collapse, Modal } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
// import AppFooter from './Footer';
import Aos from 'aos';
import 'aos/dist/aos.css'
const { Header, Content } = Layout;

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

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const panelStyle = {
    marginBottom: 24,
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #d9d9d9',
  };

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  useEffect(() => {
    Aos.init({ duration: 2000 })
  }, [])
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: '#001529',
          padding: '0 20px',
          borderRadius: '0 0 30px 30px'
        }}
      >
        <Button type="primary" onClick={showModal}>
          Login
        </Button>
        <Modal title="Select and login" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Link to={'/student/login'}>
              <Button type="primary" block>
                Login if you are a Student
              </Button>
            </Link>
            <Link to={'/teacher/login'}>
              <Button block>Login if you are a Teacher</Button>
            </Link>
          </div>
        </Modal>
      </Header>
      <Content style={{ padding: '50px', background: '#f0f2f5', borderRadius: '30px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <h1 data-aos="fade-right"  >Welcome to the SMIT Assignment Submission Portal</h1>
            <p data-aos="fade-up-right" >Submit, track, and receive feedback on your assignments seamlessly.</p>
            <Link to={'/student/register'}>
              <Button data-aos="zoom-in" type="primary" size="large" style={{ marginTop: '20px' }}>Get Started</Button>
            </Link>
          </Col>
          <Col xs={24} md={12}>
            <img  data-aos="fade-down-left"
              src="https://tse4.mm.bing.net/th?id=OIG2.ghqug.oXg8fzA9zIh0xA&pid=ImgGn"
              alt="Assignment Submission"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '30px' }}
            />
          </Col>
        </Row>
        <br /><br />
        <center>
          <h2 data-aos="zoom-in-down" >ROLE & RESPONSIBILITIES</h2>
          <Carousel autoplay style={{ maxWidth: 1000, borderRadius: '30px' }}>
            <div>
              <h2 style={{
                height: '300px',
                color: 'white',
                lineHeight: '160px',
                textAlign: 'center',
                background: '#364d79',
                borderRadius: '20px',
                backgroundImage: `url('https://png.pngtree.com/thumb_back/fw800/background/20231009/pngtree-3d-illustration-of-a-student-engaged-in-an-online-classroom-image_13559709.png')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}>
                ADMIN: <br /> Assess the Performance of Students
              </h2>
            </div>
            <div>
              <h2 style={{
                height: '300px',
                color: 'white',
                lineHeight: '160px',
                textAlign: 'center',
                background: '#364d79',
                borderRadius: '20px',
                backgroundImage: `url('https://img.freepik.com/free-photo/3d-portrait-businessman_23-2150793875.jpg?t=st=1720295757~exp=1720299357~hmac=c30ef5c1c4cd093f5d226aaa8fbe6aca75030d0ee0f892bbc26aecadd9804bb1&w=826')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}>
                TEACHER: <br /> Reading and marking student assignments. Choice of Checking assignments manually.
              </h2>
            </div>
            <div>
              <h2 style={{
                height: '300px',
                color: 'white',
                lineHeight: '160px',
                textAlign: 'center',
                background: '#364d79',
                borderRadius: '20px',
                backgroundImage: `url('https://img.pikbest.com/wp/202348/college-students-illustration-3d-of-a-tablet-wielding-student-taking-flight_9779228.jpg!w700wp')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}>
                STUDENT: <br /> Uploading Assignments Easily
              </h2>
            </div>
          </Carousel>
        </center>
        <br /><br />
        <center>
          <h2 data-aos="zoom-in-down" >OUR MAIN FEATURE</h2> <br /><br />
          <Card style={{ borderRadius: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', maxWidth: '800px' }}>
            <h1 data-aos="fade-up"
     data-aos-duration="3500" >AI Integration</h1>
            <h4 data-aos="fade-up"
     data-aos-duration="4000" >Our advanced AI system automatically evaluates assignments, providing fast and accurate feedback to students and teachers.</h4>
          </Card>
        </center>
        <br /><br />
        <center>
          <h2 data-aos="zoom-out-right" >OUR OTHER FEATURES</h2>
          <br /><br />
          <div  data-aos="flip-left"
     data-aos-easing="ease-out-cubic"
     data-aos-duration="2000" >

          
          <Row  gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card title="1 : ROLE MANAGEMENT" bordered={false} style={{ borderRadius: '10px' }}>
                4 : EASY SUBMISSION
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card title="2 : DEADLINE MANAGEMENT" bordered={false} style={{ borderRadius: '10px' }}>
                5 : PERFORMANCE ANALYTICS
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card title="3 : NOTIFICATION SYSTEM" bordered={false} style={{ borderRadius: '10px' }}>
                6 : Reporting the task
              </Card>
            </Col>
          </Row>

          </div>
        </center>
        <br /><br />
        <center>
          <h2 data-aos="zoom-in-down"  >OUR STUDENT FEATURES</h2> <br /><br />
          <Collapse
          data-aos="fade-up"
     data-aos-anchor-placement="center-bottom"
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#f0f2f5' }}
            items={getItems(panelStyle)}
          />
        </center>
        <br /><br />
        <center>
          <h2 data-aos="zoom-in-down" >OUR TEACHER FEATURES</h2> <br /><br />
          <Collapse
          data-aos="fade-up"
     data-aos-anchor-placement="bottom-bottom"
            bordered={false}
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ background: '#f0f2f5' }}
            items={getTeacherItems(panelStyle)}
          />


          <Card

          data-aos="fade-up"
     data-aos-anchor-placement="center-center"
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              maxWidth: '900px',
              margin: '0 auto',
              background: '#f9f9f9',
            }}
            title={<h2 style={{ textAlign: 'center', color: '#1890ff' }}>Why Choose Our Portal?</h2>}
          >
            <p style={{ fontSize: '16px', lineHeight: '1.5', textAlign: 'center' }}>
              Our portal leverages cutting-edge AI technology to provide accurate, unbiased, and quick evaluations, helping students to improve their skills and knowledge efficiently. Teachers can save valuable time and focus more on personalized instruction, knowing that the routine grading tasks are handled seamlessly by our AI system.
            </p>
          </Card>
        </center>
      </Content>
      {/* <AppFooter /> */}
    </Layout>
  );
};

export default App;
