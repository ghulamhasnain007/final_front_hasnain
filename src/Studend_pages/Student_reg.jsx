import React from 'react';
import { Card, Form, Input, Button, Row, Col, notification } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const regdata = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: 'student'
    };
  // add admin chartdetail 
   let adminchart = () =>{
    try {
      axios.post('http://localhost:3000/api/adminuser/chartdetail' ,
        {
          Total_Students : 1,
          Total_Tasks : 0,
          Total_Classes : 0,
          Total_submissions : 0,
          Total_teacher : 0
      
      } )
      .then((res)=>{
        console.log(res)
      })
      .catch((err)=>{
        console.log(err)
      })
    } catch (error) {
      
    }
   }

    try {
      const response = await axios.post('http://localhost:3000/api/reg', regdata);
      notification.success({
        message: 'Registration Successful',
        description: response.data.message,
      });
      form.resetFields();
      adminchart()
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <div style={{ padding: '30px', borderRadius: 40, marginTop: 100 }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card title="Registration" style={{ width: '100%', maxWidth: 400, borderRadius: 40, alignItems: 'center' }}>
            <Form
              form={form}
              name="registration_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>

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
                  Register
                </Button>
                <br />
                <p>Already have an account? <Link to="/student/login">Login</Link></p>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RegistrationForm;
