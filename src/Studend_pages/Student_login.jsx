import React, { useContext } from 'react';
import { Card, Form, Input, Button, Row, Col, notification, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import url from '../api/api.js'
const img = 'https://img.freepik.com/free-photo/computer-security-with-login-password-padlock_107791-16191.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1721260800&semt=sph';
// let url = 'http://localhost:3000/api';
import ParticlesComponent from '../Student_comp/Animation.jsx';
import { AuthContext } from '../Context/AuthContext.jsx';

const Student_login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Title } = Typography;
  const {login} = useContext(AuthContext)
  const onFinish = async (values) => {
    const regdata = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await axios.post(`${url}/login/student`, regdata);
      notification.success({
        message: ` Welcome ${response.data.userData.username}`,
        description: response.data.message,
      });
      console.log(response.data.userData.username
      );
      
      login('student', response.data)
      // localStorage.setItem('user', JSON.stringify(response.data));
      // localStorage.setItem('role', JSON.stringify(response.data.userData.role));
      form.resetFields();


      setTimeout(() => {
        window.location.href = '/student/dashboard';

      }, 1000);
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


<div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
    <Row style={{ minHeight: '100vh' }}  >
      <ParticlesComponent />
      <Col xs={0} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* <img src={img} alt="Logo" style={{ width: '80%', maxWidth: 400, borderRadius: 20, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: 10 }} /> */}
        <center>


          <h1 style={{ width: '100%',  borderRadius: 20,  marginBottom: 30 , color : 'white' }} >Welcome back! Please enter your credentials to access your account. </h1>
        </center>
      </Col>
      <Col xs={24} sm={12} md={12} lg={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card
          // title="Login"
          style={{
            width: '90%',
            maxWidth: 400,
            borderRadius: 20,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            marginBottom: 50
          }}
        >
           <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Login</Title>
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

              <center>
                <br /> 
                <p>Don't have an account? <Link to={'/student/register'}>Register</Link></p>
                <br />

                <Button type="default" onClick={handleBackToHome} style={{ marginBottom: 10 }}>
                  Back to Home
                </Button>
              </center>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
</div>
    
  );
};

export default Student_login;
