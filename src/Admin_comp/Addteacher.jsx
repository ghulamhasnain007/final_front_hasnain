import React, { useState } from 'react';
import { Button, Form, Input, Space, Modal, notification } from 'antd';
import axios from 'axios';
import TeacherData from '../Admin_comp/Teacherdata'
const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  React.useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};

const AddTeacher = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh,setrefresh] = useState(true)


  let adminchart = () =>{
    try {
      axios.post('http://localhost:3000/api/adminuser/chartdetail' ,
        {
          Total_Students : 0,
          Total_Tasks : 0,
          Total_Classes : 0,
          Total_submissions : 0,
          Total_teacher : 1
      
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



  const onFinish = async (values) => {
    console.log('Form values:', values);
    const regdata = {
      username: values.username,
      email: values.email,
      password: values.password,
      role: 'teacher'
    };
    try {
      const response = await axios.post('http://localhost:3000/api/reg', regdata);
      notification.success({
        message: 'Registration Successful',
        description: response.data.message,
      });
      setrefresh(false)
      form.resetFields();
      setIsModalOpen(false);
      adminchart()
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginTop: 100, display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
        Create
      </Button>
      <Modal
        title="Create a new Teacher"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="Teacher Name"
            rules={[
              {
                required: true,
                message: 'Please input the Teacher name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input a valid email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Space>
              <SubmitButton form={form}>Submit</SubmitButton>
              <Button htmlType="reset" onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <TeacherData  refresh={refresh}  />
    </div>
  );
};

export default AddTeacher;
