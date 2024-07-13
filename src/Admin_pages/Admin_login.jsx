import React from 'react';
import { Card, Form, Input, Button, Row, Col, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const loginData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/login/admin', loginData);
      notification.success({
        message: 'Login Successful',
        description: response.data.message,
      });
      localStorage.setItem('admin', JSON.stringify(response.data));
      form.resetFields();
      // Redirect or perform actions after successful login
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
          <Card title="Admin Login" style={{ width: '100%', maxWidth: 400, borderRadius: 40, alignItems: 'center' }}>
            <Form
              form={form}
              name="admin_login_form"
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
                <p>Create a new account <Link to={'/student/register'}>Register</Link></p>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminLogin;
