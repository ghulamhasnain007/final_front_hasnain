import React, { useState } from 'react';
import { Layout, Menu, Row, Col, Button, Card, theme, Carousel, Collapse, Dropdown, Space, Modal, Flex } from 'antd';
import { CaretRightOutlined, DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { SettingOutlined } from '@ant-design/icons';
import { FaHandsClapping } from "react-icons/fa6";
import AppFooter from './Footer';

const { Header, Content } = Layout;

const item = [
    {
        label: (
            <Link to="/student/profile">
                Profile
            </Link>
        ),
        key: '1',
        icon: <CgProfile />
    },
    {
        label: (
            <Link to="/admin/setting">
                Setting
            </Link>
        ),
        key: '2',
        icon: <SettingOutlined />,
    },
    {
        type: 'divider',
    },
    {
        label: 'Logout',
        key: '3',
        icon: <CiLogout />
    },
];

// const items = [
//   { key: '1', label: 'Home' },
//   { key: '2', label: 'List' },
//   { key: '3', label: '' },
// ];

const getItems = (panelStyle) => [
    {
        key: '1',
        label: '1 : Statistics',
        children: <p>View assignment statistics at a glance.</p>,
        style: panelStyle,
    },
    {
        key: '2',
        label: '2 :Join Classroom',
        children: <p>Easily join classrooms and start doing tasks.</p>,
        style: panelStyle,
    },
    {
        key: '3',
        label: '3 : Report a Task',
        children: <p>Report the tasks and track the task progress.</p>,
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
        label: '2 :Add New Task',
        children: <p>Add new tasks and assignments for the students.</p>,
        style: panelStyle,
    },
    {
        key: '3',
        label: '3 : Check Tasks',
        children: <p>Check and grade tasks efficiently.</p>,
        style: panelStyle,
    },
];

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { token } = theme.useToken();
    const panelStyle = {
        marginBottom: 24,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
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
                    borderRadius: 30,
                    justifyContent: 'flex-end',
                    gap: 10
                }}
            >
                <div className="demo-logo" />
                {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
            justifyContent: 'flex-end'
          }}
        /> */}


                <Button type="primary" onClick={showModal}>
                    Login
                </Button>
                <Modal title="Select and login" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <Flex
                        vertical
                        gap="small"
                        style={{
                            width: '100%',
                        }}
                    >
                        <center>
                            <Link to={'/student/login'}>
                                <Button type="primary" >
                                    Login if you are a Student
                                </Button>
                            </Link>
                            <br /><br />
                            <Link to={'/teacher/login'}>
                                <Button>Login if you are a Teacher</Button>
                            </Link>
                        </center>



                    </Flex>
                </Modal>
                <Dropdown menu={{ items: item }} style={{ display: 'flex' }}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <Space style={{ color: 'white' }}>
                            Hello <FaHandsClapping /> Haseeb
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>


            </Header>
            <Content style={{ padding: '50px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                        <h1>Welcome to the SMIT Assignment Submission Portal</h1>
                        <p>Submit, track, and receive feedback on your assignments seamlessly.</p>
                        <Link to={'/student/register'}>
                            <Button type="primary" size="large" style={{ marginTop: '20px' }}>Get Started</Button>
                        </Link>


                    </Col>
                    <Col xs={24} md={12}>
                        <img
                            src="https://tse4.mm.bing.net/th?id=OIG2.ghqug.oXg8fzA9zIh0xA&pid=ImgGn"
                            alt="Assignment Submission"
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: 30 }}
                        />
                    </Col>
                </Row>
                <br /><br />
                <center>
                    <h2>ROLE & RESPONSIBILITIES</h2>
                    <Carousel autoplay style={{ maxWidth: 1000, borderRadius: 30 }}>
                        <div>
                            <h2 style={{
                                height: '300px',
                                color: 'black',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: '#364d79',
                                borderRadius: 20,
                                backgroundImage: `url('https://png.pngtree.com/thumb_back/fw800/background/20231009/pngtree-3d-illustration-of-a-student-engaged-in-an-online-classroom-image_13559709.png')`,
                                backgroundPosition: 'center'
                            }}>
                                ADMIN: <br /> Assets the Performance of Students
                            </h2>
                        </div>
                        <div>
                            <h2 style={{
                                height: '300px',
                                color: 'black',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: '#364d79',
                                borderRadius: 20,
                                backgroundImage: `url('https://img.freepik.com/free-photo/3d-portrait-businessman_23-2150793875.jpg?t=st=1720295757~exp=1720299357~hmac=c30ef5c1c4cd093f5d226aaa8fbe6aca75030d0ee0f892bbc26aecadd9804bb1&w=826')`,
                                backgroundPosition: 'center'
                            }}>
                                TEACHER: <br /> Reading and marking student assignments
                                Choice of Checking assignments manually
                            </h2>
                        </div>
                        <div>
                            <h2 style={{
                                height: '300px',
                                color: 'black',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: '#364d79',
                                borderRadius: 20,
                                backgroundImage: `url('https://img.pikbest.com/wp/202348/college-students-illustration-3d-of-a-tablet-wielding-student-taking-flight_9779228.jpg!w700wp')`,
                                backgroundPosition: 'center'
                            }}>
                                STUDENT: <br /> Uploading Assignments Easily
                            </h2>
                        </div>
                    </Carousel>
                </center>
                <br /><br />
                <center>
                    <h2>OUR MAIN FEATURE</h2> <br /><br />
                    <Card style={{ borderRadius: 30 }} >
                        <h1>AI Integration</h1>
                        <h4>Our advanced AI system automatically evaluates assignments, providing fast and accurate feedback to students and teachers.</h4>
                    </Card>
                </center>
                <br /><br />
                <center>
                    <h2>OUR OTHER FEATURES</h2>
                    <br /><br />
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card title="1 : ROLE MANAGEMENT" bordered={false}>
                                4 : EASY SUBMISSION
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card title="2 : DEADLINE MANAGEMENT" bordered={false}>
                                5 : PERFORMANCE ANALYTICS
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card title="3 : NOTIFICATION SYSTEM" bordered={false}>
                                6 : Reporting the task
                            </Card>
                        </Col>
                    </Row>
                </center>
                <br /><br />
                <center>
                    <h2>OUR STUDENT FEATURES</h2> <br /><br />
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{ background: token.colorBgContainer }}
                        items={getItems(panelStyle)}
                    />
                </center>
                <br /><br />
                <center>
                    <h2>OUR TEACHER FEATURES</h2> <br /><br />
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 :



                            0} />}
                        style={{
                            background: token.colorBgContainer,
                        }}
                        items={getItems(panelStyle)}
                    />
                </center>


                {/*  */}
                <br /><br />
                <center>
                    <h2>OUR  TEACHER FEATURE</h2> <br /><br />
                    <Collapse
                        bordered={false}
                        defaultActiveKey={['1']}
                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                        style={{
                            background: token.colorBgContainer,
                        }}
                        items={getTeacherItems(panelStyle)}
                    />
                </center>


            </Content>
            <AppFooter />
        </Layout>
    );
};

export default App;
