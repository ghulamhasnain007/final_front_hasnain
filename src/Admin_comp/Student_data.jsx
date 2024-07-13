import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Avatar, Modal } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import admin from '../token/admin.js'
const { Search } = Input;

const App = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await admin.get('/users');
      const studentsWithKeys = response.data.student.map((student, index) => ({
        ...student,
        key: index.toString(),
      }));
      setStudents(studentsWithKeys);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleView = (record) => {
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
      console.log('Student deleted successfully');
      fetchStudents(); // Refresh students data after deletion
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
        handleDelete(record._id); // Call handleDelete with the student's ID
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSearch = (value) => {
    if(value){
       // Perform filtering based on the search value (username)
    const filteredStudents = students.filter(student =>
      student.username.toLowerCase().includes(value.toLowerCase())
    );
    setStudents(filteredStudents);
    }else{
      fetchStudents();
    }
   
  };

  const columns = [
    {
      title: 'Profile Image',
      dataIndex: 'profileurl',
      key: 'profileurl',
      render: (text) => <Avatar src={text} />,
    },
    {
      title: 'Username',
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
            icon={<DeleteOutlined  style={{color : 'red'}} />}
            onClick={() => showDeleteConfirm(record)} // Show delete confirmation modal
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <br /><br /><br /><br />
      <center>
        <h3 style={{ textAlign: 'center' }}> Manage  All Students</h3> 
        <Search
          placeholder="Search student by name"
          style={{ width: '60%', marginBottom: 10 }}
          onSearch={handleSearch}
        />
      </center><br />
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={students}
          scroll={{ x: '100%' }}
        />
      </div>
      {modalData && (
        <Modal
          title="Student Details"
          open={isModalOpen} // Use visible instead of open
          onCancel={handleCancel}
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
          <p><strong>Student Name:</strong> {modalData.username ? modalData.username : '' }</p>
          <p><strong>Email:</strong> {modalData.email ? modalData.email : ''}</p>
          <p><strong>Gender:</strong> {modalData.gender ? modalData.gender : '' }</p>
          <p><strong>Joined date :</strong> {modalData.created_at ? modalData.created_at : '' }</p>
          
        </Modal>
      )}
    </div>
  );
};

export default App;
