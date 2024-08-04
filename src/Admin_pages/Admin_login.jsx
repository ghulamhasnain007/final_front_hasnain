import React from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../api/api';
const { Title } = Typography;
// let url = 'http://localhost:3000/api'
const AdminLogin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate('')
  const onFinish = async (values) => {
    const loginData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post(`${url}/login/admin`, loginData)
      notification.success({
        message:` Welcome ${response.data.userData.username}`,
        description: response.data.message,
      });

      localStorage.setItem('admin', JSON.stringify(response.data));
      localStorage.setItem('role', JSON.stringify(response.data.userData.role));
      form.resetFields();
      const timer = setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1000); 



      // Redirect or perform actions after successful login
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <>
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 450, padding: '30px', borderRadius: 20 }}>
          <Link to={'/'}>
            <Button style={{ marginBottom: 20 }}>Back to Home</Button>
          </Link>
          <Card
            title={<Title level={3} style={{ textAlign: 'left', color: '#1890ff' }}>Admin Login</Title>}
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#fff',
              padding: '20px'
            }}
          >
            <Form
              form={form}
              name="admin_login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
            >
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
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
