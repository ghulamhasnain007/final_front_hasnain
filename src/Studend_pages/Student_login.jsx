import React from 'react';
import { Card, Form, Input, Button, Row, Col, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import a logo image
const img = 'https://img.freepik.com/free-photo/computer-security-with-login-password-padlock_107791-16191.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721260800&semt=sph';
let url = 'https://saylaniportalback-production.up.railway.app/api'
const Student_login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // For navigation

  const onFinish = async (values) => {
    const regdata = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post(`${url}/login/student`, regdata);
      notification.success({
        message: 'Login Successful',
        description: response.data.message,
      });
      navigate('/student/dashboard')
      localStorage.setItem('user', JSON.stringify(response.data));
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/'); 
  };

  return (
    <Row style={{ minHeight: '100vh' }}>
      <Col xs={0} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={img} alt="Logo" style={{ width: '80%', maxWidth: 400, borderRadius: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' , marginBottom : 10 }} />
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          title="Login"
          style={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 20,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
          }}
        >
          <Form
            form={form}
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email address!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 10 }}>
                Login
              </Button>
              <Button type="default" onClick={handleBackToHome} style={{ width: '100%', marginBottom: 10 }}>
                Back to Home
              </Button>
              <br />
              <p>Don't have an account? <Link to={'/student/register'}>Register</Link></p>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Student_login;
