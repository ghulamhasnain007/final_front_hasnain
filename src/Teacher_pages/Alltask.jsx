import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Modal, Form, Input, DatePicker, Button, message, Tooltip, Empty, Alert } from 'antd';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
import Tnavi from '../Teachercomp/Tnavi';
import axios from 'axios';
import { CopyOutlined } from '@ant-design/icons';
import teacher from '../token/teacher.js'
const ALL_task = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [classdata, setClassData] = useState([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

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
    });
  };

  let chart = async () => {
    let totalStudents = 0;
    let totalTasks = 1;
    let totalClasses = 0;
    const teacherData = JSON.parse(localStorage.getItem('techerdata'));
    const teacherId = teacherData.userData.id;
    await axios.post('http://localhost:3000/api/tchart/teacher', { totalStudents, totalTasks, totalClasses, teacherId })
      .then((res) => {
        console.log(res);
      }).catch((err) => {
        console.log(err);
      });
  };

  let adminchart = () => {
    try {
      axios.post('http://localhost:3000/api/adminuser/chartdetail',
        {
          Total_Students: 0,
          Total_Tasks: 1,
          Total_Classes: 0,
          Total_submissions: 0,
          Total_teacher: 0
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = (values) => {
    const teacherData = JSON.parse(localStorage.getItem('techerdata'));
    const teacher_name = teacherData.userData.teacher_name;
    const teacher_id = teacherData.userData.id;
    const newTask = {
      title: values.taskTitle,
      instructions: values.instructions,
      last_date: values.lastDate.format('YYYY-MM-DD HH:mm:ss'),
      class_id: id,
      teacher_id: teacher_id,
      teacher_name: teacher_name
    };

    teacher.post('/createtask', newTask)
      .then((response) => {
        message.success('Task created successfully');
        getTasks();
        chart();
        adminchart();
      })
      .catch((error) => {
        console.error('Error adding task:', error);
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
    };
    teacher.put(`/createtask/update`, updatedTask)
      .then((response) => {
        message.success('Task updated successfully');
        getTasks();
      })
      .catch(error => {
        console.error('Error updating task:', error);
        message.error('Something went wrong');
      });

    setIsEditModalOpen(false);
  };

  const getTasks = () => {
    axios.get(`http://localhost:3000/api/createtask/${id}`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Error fetching task details:', error);
      });
  };

  const getClassDetails = () => {
    axios.get(`http://localhost:3000/api/creteclass/getclass/${id}`)
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
        console.error('Error deleting task:', error);
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
    const today = moment();
    const lastDate = moment(date);
    return lastDate.isBefore(today, 'day');
  };

  return (
    <>
      <Tnavi />
      <div style={{ padding: '20px', marginTop: 80 }}>
        <Card title={`Teacher name : ${classdata.teacher_name}`} style={{ marginBottom: '20px' }}>
          <p>
            <strong>Class Name: </strong> {classdata.className}
          </p>
          <p>
            <strong>Description: </strong> {classdata.description}
          </p>
          <p>
            <strong>Class Code: {classdata.class_code}</strong>
            <Tooltip title="Copy code">
              <Button type="link" onClick={() => copyToClipboard(classdata.class_code)}>
                <CopyOutlined />
              </Button>
            </Tooltip>
          </p>
          <p>
            <strong>
              Total Students: {`${classdata?.students?.length ?? '0'}`}
            </strong>
          </p>
          <p>
            <strong>Class Created At: {`${classdata.created_at ? classdata.created_at.slice(0, 10) : 'N/A'}`}</strong>
          </p>
        </Card>
        <center>
          <Button type="primary" onClick={showModal} style={{ marginTop: '20px' }}>
            Add New Task
          </Button>
        </center>

        <br /><br />
        {tasks.length > 0 ? (
          <Row gutter={[16, 16]}>
            {tasks.map((task, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Link to={`/teacher/createclasswork/${id}/task/${task._id}`}>
                  <Tooltip title="Click to check submissions">
                    <Card hoverable title={`Task Name: ${task.title}`} style={{ height: '100%' }}>
                      {isPastDate(task.last_date) && (
                        <Alert
                          message="Task Submission Closed"
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
                      <Button style={{ marginRight: 10 }} type="dashed" onClick={(e) => {
                        e.preventDefault();
                        showEditModal(task);
                      }}>Edit</Button>
                      <Button
                        danger type="text"
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
          title='Add New Task'
          open={isModalOpen}
          onOk={() => form.submit()}
          onCancel={handleCancel}
          okText='Save'
          cancelText='Cancel'
        >
          <Form form={form} layout="vertical" onFinish={handleOk} onFinishFailed={onFinishFailed}>
            <Form.Item
              name="taskTitle"
              label="Task Title"
              rules={[{ required: true, message: 'Please enter task title' }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
            <Form.Item name="instructions" label="Instructions">
              <Input.TextArea placeholder="Enter instructions" rows={4} />
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
          </Form>
        </Modal>

        <Modal
          title='Edit Task'
          open={isEditModalOpen}
          onOk={() => editForm.submit()}
          onCancel={handleEditCancel}
          okText='Save'
          cancelText='Cancel'
        >
          <Form form={editForm} layout="vertical" onFinish={handleEditOk} onFinishFailed={onFinishFailed}>
            <Form.Item
              name="taskTitle"
              label="Task Title"
              rules={[{ required: true, message: 'Please enter task title' }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
            <Form.Item name="instructions" label="Instructions">
              <Input.TextArea placeholder="Enter instructions" rows={4} />
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
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default ALL_task;
