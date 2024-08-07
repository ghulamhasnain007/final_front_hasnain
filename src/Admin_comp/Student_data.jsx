import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Avatar, Modal } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import admin from '../token/admin.js';
const { Search } = Input;
import url from '../api/api.js';

const App = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modaldata, setModaldata] = useState('')
  const [join,setjoin] = useState('')
  const fetchStudents = async () => {
    try {
      const response = await admin.get('/users');
      const studentsWithKeys = response.data.student.map((student, index) => ({
        ...student,
        key: index + 1,
      }));
      setStudents(studentsWithKeys);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${url}/users/S_detail/${id}`);
      setModaldata(response.data); 
      setjoin(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleView = (record) => {
    fetchUserData(record._id);
    setModalData(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleDelete = async (id) => {
    try {
      await admin.delete(`/users/delete/${id}`);
      fetchStudents(); 
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this student?',
      content: `Student Name: ${record.username}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(record._id);
      },
      onCancel() {
       
      },
    });
  };

  const handleSearch = (value) => {
    if (value) {
      const filteredStudents = students.filter(student =>
        student.username.toLowerCase().includes(value.toLowerCase())
      );
      setStudents(filteredStudents);
    } else {
      fetchStudents();
    }
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Profile Image',
      dataIndex: 'profileurl',
      key: 'profileurl',
      render: (text) => <Avatar src={text} />,
    },
    {
      title: 'S_Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            style={{ marginRight: 8 }}
          >
            View Detail
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined style={{ color: 'red' }} />}
            onClick={() => showDeleteConfirm(record)} // Show delete confirmation modal
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const column = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: 'Quiz',
      dataIndex: 'quizName',
      key: 'quizName',
    },
    {
      title: 'Passing score',
      dataIndex: 'passing_point',
      key: 'passing_point',
    },
    {
      title: 'Student Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Status',
      key: 'status',
      render: (text, record) => (
        <span
          style={{
            color: record.score >= record.passing_point ? 'green' : 'red',
            fontWeight: 'bold'
          }}
        >
          {record.score >= record.passing_point ? 'Pass' : 'Fail'}
        </span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

 
  const dataSource = modaldata?.S_quiz
    ? modaldata.S_quiz.map((quiz, index) => ({
        key: index + 1 ,
        quizName : quiz.quizName, 
        passing_point: quiz.passing_point,
        score: quiz.score, 
        teacherName : `Sir ${quiz.teacherName}`,
        date : quiz.date.slice(0,10),
      }))
    : [];

  return (
    <div>
      <br /><br /><br /><br />
      <center>
        <h3 style={{ textAlign: 'center' }}> Manage All Students</h3>
        <Search
          placeholder="Search student by name"
          style={{ width: '60%', marginBottom: 10 }}
          onSearch={handleSearch}
        />
      </center><br />
      <div style={{ overflowX: 'auto' }}>
        <Table columns={columns} dataSource={students} scroll={{ x: '100%' }}  pagination={{ pageSize: 10 }} />
      </div>
      {modalData && (
        <Modal
          title="Student Details"
          open={isModalOpen}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              OK
            </Button>,
          ]}
        >
          <center>
            <Avatar src={modalData.profileurl ? modalData.profileurl : ''} size={64} />
          </center>
          <p><strong>Student Name:</strong> {modalData.username ? modalData.username : ''}</p>
          <p><strong>Email:</strong> {modalData.email ? modalData.email : ''}</p>
          <p><strong>Gender:</strong> {modalData.gender ? modalData.gender : ''}</p>
          <p><strong>S_Class join : </strong>{join.S_Classes ? join.S_Classes: 0}</p>
          <p><strong>S_subbmmision"s : </strong>{join.S_submmisions ? join.S_submmisions : 0 }</p>
          <Table columns={column} dataSource={dataSource} scroll={{ x: '100%' }}  pagination={{ pageSize: 5 }}  /> <br />
          <center>
            <p><strong>Joined date:</strong> {modalData.created_at?.slice(0, 10) ? modalData.created_at?.slice(0, 10) : ''}</p>
          </center>
          
        </Modal>
      )}
    </div>
  );
};

export default App;
