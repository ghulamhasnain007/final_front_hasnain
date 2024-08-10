import React, { useEffect, useState, useContext } from 'react';
import { Card, Row, Col, Modal, Form, Input, DatePicker, Button, message, Tooltip, Empty, Alert, Spin, Typography, Select, Space } from 'antd';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import Tnavi from '../Teachercomp/Tnavi';
import axios from 'axios';
import { CopyOutlined } from '@ant-design/icons';
import teacher from '../token/teacher.js';
import url from '../api/api.js'
import { AuthContext } from '../Context/AuthContext.jsx'

const { Title, Paragraph } = Typography;
// let url = 'http://localhost:3000/api'

const ALL_task = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [classdata, setClassData] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [optionValue, setoptionvalue] = useState('')
  const { auth } = useContext(AuthContext)
  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const showEditModal = (task) => {
    setEditTask(task);
    setIsEditModalOpen(true);
    editForm.setFieldsValue({
      taskTitle: task.title,
      instructions: task.instructions,
      lastDate: moment(task.last_date),
      points: task.points,
    });
  };

  const getTasks = () => {
    setLoading(true);
    axios.get(`${url}/createtask/${id}`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching task details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getClassDetails = () => {
    axios.get(`${url}/creteclass/getclass/${id}`)
      .then(response => {
        setClassData(response.data);
      })
      .catch(error => {
        console.error('Error fetching class details:', error);
      });
  };

  useEffect(() => {
    getTasks();
    getClassDetails();
  }, [id]);

  const handleChange = (value) => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      console.log('Selected label:', selectedOption.label);
      setoptionvalue(selectedOption.label)
    }
  };

  const options = [
    { value: '1', label: 'IMAGE' },
    { value: '2', label: 'URL' },
    { value: '3', label: 'CODE' },
  ];
  const adminchart = async () => {
    try {
      await axios.post(`${url}/adminuser/chartdetail`, {
        Total_Students: 0,
        Total_Tasks: 1,
        Total_Classes: 0,
        Total_submissions: 0,
        Total_teacher: 0
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleOk = (values) => {

    const teacherData = auth.teacher
    // const teacherData = JSON.parse(localStorage.getItem('user'));
    const teacher_name = teacherData.userData.teacher_name;
    const teacher_id = teacherData.userData.id;
    const newTask = {
      title: values.taskTitle,
      instructions: values.instructions,
      last_date: values.lastDate.format('YYYY-MM-DD HH:mm:ss'),
      points: values.points,
      class_id: id,
      teacher_id: teacher_id,
      teacher_name: teacher_name,
      class_name: classdata.className,
      students: classdata.students,
      teacher_profile: teacherData.userData.profileurl,
      IMAGE: optionValue == 'IMAGE' ? true : false,
      URL: optionValue == 'URL' ? true : false,
      CODE: optionValue == 'CODE' ? true : false,
    };


    let chart = async (teacherId) => {
      console.log(teacherId);
      let totalStudents = 0
      let totalTasks = 1
      let totalClasses = 0
      let totalquiz = 0
      await axios.post(`${url}/tchart/teacher`, { totalStudents, totalTasks, totalClasses, teacherId, totalquiz })
        .then((res) => {
          // console.log(res);
        }).catch((err) => {
          // console.log(err)
        })
    }


    teacher.post('/createtask', newTask)
      .then((response) => {
        message.success('Assigment created successfully');
        getTasks();
        adminchart()
        // console.log(response.data.Task.teacher_id);
        chart(response.data.Task.teacher_id)
      })
      .catch((error) => {
        console.error('Error adding Assigment:', error);
        message.error(error.response.data.message);
      });

    setIsModalOpen(false);
  };

  const handleEditOk = (values) => {
    const updatedTask = {
      ...editTask,
      title: values.taskTitle,
      instructions: values.instructions,
      last_date: values.lastDate.format('YYYY-MM-DD HH:mm:ss'),
      points: values.points,
      IMAGE: optionValue == 'IMAGE' ? true : false,
      URL: optionValue == 'URL' ? true : false,
      CODE: optionValue == 'CODE' ? true : false,
    };
    teacher.put(`/createtask/update`, updatedTask)
      .then((response) => {
        message.success('Assigment updated successfully');
        getTasks();
      })
      .catch(error => {
        console.error('Error updating task:', error);
        message.error('Something went wrong');
      });

    setIsEditModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const handleDelete = (item) => {
    teacher.delete(`/createtask/${item}`)
      .then((response) => {
        message.success(response.data.message);
        getTasks();
      })
      .catch(error => {
        console.error('Error deleting Assigment:', error);
        message.error(error.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('Class code copied!');
      })
      .catch(() => {
        message.error('Failed to copy class code.');
      });
  };

  const isPastDate = (date) => {
    const today = new Date();
    const lateDateObj = new Date(date);
    return today > lateDateObj;
  };

  return (
    <>
      <Tnavi />
      <div style={{ padding: '20px', marginTop: 80 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 160px)' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Card
              title={<Title level={3} style={{ color: '#ffffff', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)' }}>Teacher : Sir {classdata.teacher_name}</Title>}
              style={{
                marginBottom: '20px',
                borderRadius: '35px 31px 31px 23px',
                color: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                position: 'relative',
              }}
            >
              <Paragraph>
                <strong>Class : </strong> {classdata.className}
              </Paragraph>
              <Paragraph>
                <strong>Description: </strong> {classdata.description}
              </Paragraph>
              <Paragraph>
                <strong>Class Code: </strong> {classdata.class_code}
                <Tooltip title="Copy code">
                  <Button
                    type="link"
                    style={{ color: '#ffffff', marginLeft: '10px' }}
                    onClick={() => copyToClipboard(classdata.class_code)}
                  >
                    <CopyOutlined style={{ color: 'blue' }} />
                  </Button>
                </Tooltip>
              </Paragraph>
              <Paragraph>
                <strong>Total Students: </strong> {classdata?.students?.length ?? '0'}
              </Paragraph>
              <Paragraph>
                <strong>Class Created At: </strong> {`${classdata.created_at ? classdata.created_at.slice(0, 10) : 'N/A'}`}
              </Paragraph>
            </Card>
            <center>
              <Button type="primary" onClick={showModal} style={{ marginTop: '20px' }}>
                Add New Assigment
              </Button>
            </center>

            <br /><br />
            {tasks.length > 0 ? (
              <Row gutter={[16, 16]}>
                {tasks.map((task, index) => (
                  <Col xs={24} sm={12} md={6} key={index}>
                    <Link to={`/teacher/createclasswork/${id}/task/${task._id}`}>
                      <Tooltip title="Click to check submissions">
                        <Card
                          className="card-hover"
                          hoverable
                          title={`Assigment : ${task.title}`}
                          style={{ height: '100%', backgroundColor: '#f9f9f9' }}
                        >
                          {isPastDate(task.last_date) && (
                            <Alert
                              message="Submission Closed"
                              type="error"
                              showIcon
                              style={{ marginBottom: '10px' }}
                            />
                          )}
                          <p>
                            <strong>Total Submissions: {task.totalSubmissions ? task.totalSubmissions : 0}</strong>
                          </p>
                          <p>
                            <strong>Not Submitted: {task.totalNotSubmitted ? task.totalNotSubmitted : 0}</strong>
                          </p>
                          <p>
                            <strong>Last Date: {`${task.last_date ? task.last_date.slice(0, 10) : 'N/A'}`}</strong>
                          </p>
                          <hr /><br />
                          <Button
                            style={{ marginRight: 10 }}
                            type="dashed"
                            onClick={(e) => {
                              e.preventDefault();
                              showEditModal(task);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            danger
                            type="text"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDelete(task._id);
                            }}
                          >
                            Delete
                          </Button>
                        </Card>
                      </Tooltip>
                    </Link>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description='No Task created' />
            )}

            <Modal
              title='Add New Assigment'
              open={isModalOpen}
              onOk={() => form.submit()}
              onCancel={handleCancel}
              okText='Save'
              cancelText='Cancel'
            >
              <Form form={form} layout="vertical" onFinish={handleOk} onFinishFailed={onFinishFailed}>
                <Form.Item
                  name="taskTitle"
                  label="Assigment Title"
                  rules={[{ required: true, message: 'Please enter assigment title' }]}
                >
                  <Input placeholder="Enter assigment title" />
                </Form.Item>
                <Form.Item name="instructions" label="Instructions"
                  rules={[{ required: true, message: 'Please enter instruction' }]}
                >
                  <Input.TextArea placeholder="Enter instructions" rows={4} />
                </Form.Item>


                <Form.Item name="select" label="Select"
                  rules={[{ required: true, message: 'Please select an option!' }]}
                >
                  <Select
                    showSearch
                    style={{ width: 470 }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={handleChange}
                    options={options}

                  />
                </Form.Item>


                <Form.Item
                  name="lastDate"
                  label="Last Date to Assign"
                  rules={[{ required: true, message: 'Please select last date' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                </Form.Item>
                <Form.Item
                  name="points"
                  label="Points"
                  rules={[{ required: true, message: 'Please enter points' }]}
                >
                  <Input placeholder="Enter points" type="number" />
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title='Edit Assigment'
              open={isEditModalOpen}
              onOk={() => editForm.submit()}
              onCancel={handleEditCancel}
              okText='Save'
              cancelText='Cancel'
            >
              <Form form={editForm} layout="vertical" onFinish={handleEditOk} onFinishFailed={onFinishFailed}>
                <Form.Item
                  name="taskTitle"
                  label="Assigment Title"
                  rules={[{ required: true, message: 'Please enter assigment title' }]}
                >
                  <Input placeholder="Enter assigment title" />
                </Form.Item>
                <Form.Item name="instructions" label="Instructions">
                  <Input.TextArea placeholder="Enter instructions" rows={4} />
                </Form.Item>



                <Form.Item name="select" label="Select">
                  <Select
                    showSearch
                    style={{ width: 470 }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    onChange={handleChange}
                    options={options}
                  />
                </Form.Item>






                <Form.Item
                  name="lastDate"
                  label="Last Date to Assign"
                  rules={[{ required: true, message: 'Please select last date' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
                </Form.Item>
                <Form.Item
                  name="points"
                  label="Points"
                  rules={[{ required: true, message: 'Please enter points' }]}
                >
                  <Input placeholder="Enter points" type="number" />
                </Form.Item>
              </Form>
            </Modal>
          </>
        )}
      </div>
    </>
  );
};

export default ALL_task;
