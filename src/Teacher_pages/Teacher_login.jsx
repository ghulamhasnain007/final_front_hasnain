import React from 'react';
import { Card, Form, Input, Button, Row, Col, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const Teacher_login = () => {
  const onFinish = async (values) => {
    const loginData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/login/teacher', loginData);
      notification.success({
        message: 'Login Successful',
        description: response.data.message,
      });

      // Save user data to localStorage
      localStorage.setItem('techerdata', JSON.stringify(response.data)); // Assuming 'user' is the key and response.data.user is the user object

      // Optionally, redirect to another page or perform additional actions
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <div style={{ padding: '30px', borderRadius: 40, marginTop: 100 }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card title="Teacher Login" style={{ width: '100%', maxWidth: 400, borderRadius: 40, alignItems: 'center' }}>
            <Form
              name="Teacher_login"
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
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Login
                </Button>
                <br />
                {/* You can add a link to password recovery or other options here */}
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Teacher_login;
