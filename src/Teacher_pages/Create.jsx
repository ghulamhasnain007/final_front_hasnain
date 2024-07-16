import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Card, message, Tooltip, Empty, Dropdown, Select } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { FaUsers } from "react-icons/fa6";
import { PiDotsSixVertical } from "react-icons/pi";
import axios from 'axios';
import Tnavi from '../Teachercomp/Tnavi';
import teacher from '../token/teacher.js';

const { Option } = Select;

const CreateClassComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [classDetailsList, setClassDetailsList] = useState([]);
  const [clickedCardIndex, setClickedCardIndex] = useState(null);
  const [dropid, setDropid] = useState('');
  const [teacherprofile, setteacherprofile] = useState('');

  const themes = [
    {name : 'Theme 1',
      url : 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608'
    },
    {name : 'Theme 2',
      url : 'https://storage.googleapis.com/kami-uploads-public/library-resource-egxYhSV74CxA-vdSy9m-google-classroom-banner-paint-splats-png'
    },
    {name : ' Theme 3',
      url : 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/mother%27s-day%2C-event%2C-greeting%2Cretail-design-template-3d3dbf8ff17ea5821edb60d082c02406_screen.jpg?ts=1698430100'
    }
  ]; // Define your themes here

  const getData = () => {
    teacher.get('/creteclass/getclass')
      .then(response => {
        setClassDetailsList(response.data);
      })
      .catch(error => {
        console.error('Error fetching class details:', error);
      });
  }

  useEffect(() => {
    getData();
    getuserdatbyid();
  }, []);

  const showModal = () => {
    setIsOpen(true);
    generateClassCode();
  };

  const getuserdatbyid = () => {
    const teacherData = JSON.parse(localStorage.getItem('techerdata'));
    const id = teacherData.userData.id;
    try {
      axios.get(`http://localhost:3000/api/users/${id}`)
        .then(res => {
          setteacherprofile(res.data.profileurl);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const chart = async () => {
    let totalStudents = 0;
    let totalTasks = 0;
    let totalClasses = 1;
    const teacherData = JSON.parse(localStorage.getItem('techerdata'));
    const teacherId = teacherData.userData.id;
    await axios.post('http://localhost:3000/api/tchart/teacher', { totalStudents, totalTasks, totalClasses, teacherId })
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  };

  const handleOk = () => {
    const teacherData = JSON.parse(localStorage.getItem('techerdata'));
    form.validateFields().then((values) => {
      const generatedClassDetails = {
        className: values.className,
        description: values.description,
        class_code: generateClassCode(),
        theme: values.theme,
        teacher_id: teacherData.userData.id,
        teacher_name: teacherData.userData.teacher_name, // Ensure 'teacher_name' is correctly set in localStorage
        teacher_profile: teacherprofile 
      };

      teacher.post('/creteclass', generatedClassDetails)
        .then(response => {
          setClassDetailsList([...classDetailsList, response.data]);
          message.success(response.data.message);
          setIsOpen(false);
          form.resetFields();
          getData();
          chart();
        })
        .catch(error => {
          console.error('Error creating class:', error);
          message.error(error.response.data.message);
        });

    }).catch((errorInfo) => {
      console.log('Validation failed:', errorInfo);
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const generateClassCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    form.setFieldsValue({ classCode: code });
    return code;
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        message.success('Class code copied!');
      })
      .catch((err) => {
        console.error('Failed to copy class code:', err);
        message.error('Failed to copy class code!');
      });
  };

  const showDeleteConfirm = (classId) => {
    Modal.confirm({
      title: 'Are you sure delete this class?',
      content: 'This action will delete all tasks and submissions associated with this class.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(classId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = (classId) => {
    teacher.delete(`/creteclass/${classId}`)
      .then(() => {
        message.success('Class deleted successfully!');
        getData();
      })
      .catch(error => {
        console.error('Error deleting class:', error);
        message.error('Failed to delete class.');
      });
  };

  const menuItems = (classId) => [
    {
      key: '1',
      label: (
        <Link to={`/teacher/createclasswork/${classId}/studentreport`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <center> <p><FaUsers /> All students</p></center>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(classId)}>
          Delete Class
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Tnavi /> <br /><br /><br /><br /><br /><br />
      <center>
        <Button type="primary" onClick={showModal} style={{ position: 'sticky', marginLeft: 20 }}>
          Create Class
        </Button>
      </center>
      <br />
      <Modal
        title="Create Class"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="className"
            label="Class Name"
            rules={[{ required: true, message: 'Please enter the class name' }]}
          >
            <Input placeholder="Enter the class name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter a description for the class" rows={4} />
          </Form.Item>
          <Form.Item
            name="theme"
            label="Theme"
            rules={[{ required: true, message: 'Please select a theme' }]}
          >
            <Select placeholder="Select a theme">
              {themes.map((theme, index) => (
                <Option key={index} value={theme.url }>{theme.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="classCode"
            label="Class Code"
          >
            <Input readOnly />
          </Form.Item>
        </Form>
      </Modal>


      {classDetailsList.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {classDetailsList.map((classDetails, index) => (
            <Card key={index}
              title={`${index + 1} : ${classDetails.className}`}
              style={{ width: 300, margin: '20px', textAlign: 'center', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}
              hoverable
            >
              {clickedCardIndex !== index && (
                <>
                  <p style={{ textDecorationLine: 'none' }}>
                    <strong>Class Code:</strong> {classDetails.class_code}
                    <Tooltip title="Copy code">
                      <Button type="link" size="small" icon={<CopyOutlined />} onClick={(e) => { e.preventDefault(); handleCopyCode(classDetails.class_code); }} />
                    </Tooltip>
                  </p>
                  <p style={{ marginBottom: 10 }}><strong>Create date:</strong> {`${classDetails.created_at ? classDetails.created_at.slice(0, 10) : 'N/A'} `}</p><br />
                  <div>
                    <Tooltip title="Go to the task">
                      <Link style={{ textDecorationLine: 'none' }} to={`/teacher/createclasswork/${classDetails._id}`} onClick={() => setClickedCardIndex(index)}>
                        Go to the Task
                      </Link>
                      <br /> <hr />
                    </Tooltip>
                    <Dropdown
                      menu={{ items: menuItems(classDetails._id) }}
                      placement="bottomLeft"
                      trigger={['click']}
                    >
                      <Button style={{ marginLeft: 205 }} onClick={() => setDropid(classDetails._id)}>
                        <PiDotsSixVertical style={{ color: "blue" }} />
                      </Button>
                    </Dropdown>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Empty description="No class created" />
      )}
    </div>
  );
};

export default CreateClassComponent;
