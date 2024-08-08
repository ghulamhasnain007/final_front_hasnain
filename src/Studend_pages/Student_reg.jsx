import React from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, notification } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../api/api.js'
const { Title } = Typography;
import ParticlesComponent from '../Student_comp/Animation.jsx';
// let url = 'http://localhost:3000/api'
const RegistrationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate('')
  const onFinish = async (values) => {
    const regdata = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: 'student'
    };

    // Add admin chart detail
    const adminchart = async () => {
      try {
        await axios.post(`${url}/adminuser/chartdetail`, {
          Total_Students: 1,
          Total_Tasks: 0,
          Total_Classes: 0,
          Total_submissions: 0,
          Total_teacher: 0
        });
      } catch (error) {
        console.error(error);
      }
    };

    try {
      const response = await axios.post(`${url}/reg`, regdata);
      notification.success({
        message: 'Registration Successful',
        description: response.data.message,
      });
      navigate('/student/login')
      form.resetFields();
      adminchart();
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (

    <>
    
    {/* <Header/> */}
    <ParticlesComponent/>
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
    
     
      <Row justify="center" style={{ width: '100%' }} gutter={20}>
         
        {/* Left Column with Image */}
        <Col xs={0} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       <h1 style={{ width: '100%',  borderRadius: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: 10 , color : 'white',marginBottom : 30  }} >Welcome! We're excited to have you join our community. To get started, please fill out the registration form below. </h1>
      
      </Col>

        {/* Right Column with Form */}
        <Col xs={24} sm={24} md={12} lg={10} xl={8}>
          <Card
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              padding: '20px',
              backgroundColor: '#fff',
              maxWidth: 400, // Adjust this value to decrease the form width
              margin: '0 auto' // Center the form within its column
            }}
          >
            <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Registration</Title>
            <Form
              form={form}
              name="registration_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                  style={{ borderRadius: '5px' }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Email"
                  style={{ borderRadius: '5px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Password"
                  style={{ borderRadius: '5px' }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '5px' }}>
                  Register
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <p>Already have an account? <Link to="/student/login">Login</Link></p>
              <Link to="/" style={{ display: 'inline-block', marginTop: '10px' }}>
                <Button style={{ borderRadius: '5px' }}>Back to Home</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>

    </>
  );
};

export default RegistrationForm;
