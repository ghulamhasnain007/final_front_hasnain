import React from 'react';
import { Card, Form, Input, Button, Row, Col, Typography, notification } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';
const { Title } = Typography;
let url = 'http://localhost:3000/api'
const TeacherLogin = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const onFinish = async (values) => {
    const loginData = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post(`${url}/login/teacher`, loginData);
      notification.success({
        message: 'Login Successful',
        description: response.data.message,
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('role', JSON.stringify(response.data.userData.role));
      form.resetFields();
      setTimeout(() => {
        window.location.href = '/teacher/dashboard';
      }, 1000);
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (

    <>
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' , borderRadius : 20 }}>
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
         <Link to={'/'}>
            <Button style={{ marginBottom: 20 }}>Back to Home</Button>
          </Link>
          <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', overflow: 'hidden', display: 'flex' }}>

         

            <Row justify="center" align="middle" style={{ width: '100%' }}>
              <Col span={12} style={{ background: '#1890ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="https://img.freepik.com/premium-vector/3d-user-login-form-page_165488-4918.jpg" alt="Login Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' , borderRadius : 20 }} />
              </Col>
              <Col span={12} style={{ padding: '20px' }}>
                <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Teacher Login</Title>
                <Form
                form={form}
                  name="Teacher_login"
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
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default TeacherLogin;
