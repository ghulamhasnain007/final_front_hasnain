import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Select, Card, Avatar, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import TNavi from '../Student_comp/Student_nav';

const { Option } = Select;
let url = 'http://localhost:3000/api'
const Tprofile = () => {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      formData.append('profileImage', file);
    }
    formData.append('username', values.name);
    formData.append('gender', values.gender);

    const userId = JSON.parse(localStorage.getItem('user')).userData.id;

    try {
      await axios.put(`${url}/users/profileupdate/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Profile updated successfully!');
      setIsEditing(false); // Disable edit mode after update
      fetchUserData(); // Refetch the user data after update
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      message.error('Failed to update profile.');
    }
  };

  const fetchUserData = async () => {
    const userId = JSON.parse(localStorage.getItem('user')).userData.id;
    try {
      const response = await axios.get(`${url}/users/${userId}`);
      const userData = response.data;
      setInitialValues(userData);
      form.setFieldsValue({
        name: userData.username,
        email: userData.email,
        gender: userData.gender,
      });
      if (userData.profileurl) {
        setFileList([
          {
            uid: '-1',
            name: 'profileImage.png',
            status: 'done',
            url: userData.profileurl,
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      message.error('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <TNavi /><br /><br /><br />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', backgroundColor: '#f0f2f5' }}>
        <Card style={{ width: '100%', maxWidth: '600px',  borderRadius: "32px 0px 59px 0px" }} title="Student  Profile">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              src={
                fileList.length > 0
                  ? fileList[0].url || URL.createObjectURL(fileList[0].originFileObj)
                  : initialValues.profileurl || null
              }
            />
          </div>
          <Form
            form={form}
            name="profile"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              gender: 'male',
            }}
          >
            {/* Name */}
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Enter your name" disabled={!isEditing} />
            </Form.Item>

            {/* Email (Read-only) */}
            <Form.Item name="email" label="Email" tooltip="Email cannot be edited">
              <Input placeholder="Enter your email" disabled />
            </Form.Item>

            {/* Gender */}
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select your gender!' }]}
            >
              <Select placeholder="Select your gender" disabled={!isEditing}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            {/* Profile Image */}
            <Form.Item label="Profile Image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageUpload}
                beforeUpload={() => false}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>

            {/* Edit/Update Button */}
            {!isEditing && (
              <Form.Item>
                <Button type="primary" onClick={() => setIsEditing(true)} style={{ width: '100%', borderRadius: '5px' }}>
                  Edit
                </Button>
              </Form.Item>
            )}

            {isEditing && (
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', borderRadius: '4px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                  Update
                </Button>
              </Form.Item>
            )}
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Tprofile;
