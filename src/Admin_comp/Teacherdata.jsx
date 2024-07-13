import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Avatar, Modal } from 'antd';
import { DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import admin from '../token/admin.js'
const { Search } = Input;

const App = (refresh) => {
  const [teacher, setTeacher] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const fetchTeacher = async () => {
    try {
      const response = await admin.get('/users');
      const teacherWithKeys = response.data.teacher.map((teacher, index) => ({
        ...teacher,
        key: index.toString(),
      }));
      setTeacher(teacherWithKeys);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [refresh]);

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
      console.log('Teacher deleted successfully');
      fetchTeacher(); // Refresh teacher data after deletion
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this teacher?',
      content: `Teacher Name: ${record.username}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDelete(record._id); // Call handleDelete with the teacher's ID
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSearch = (value) => {
    if (value) {
      // Perform filtering based on the search value (username)
      const filteredTeacher = teacher.filter(teacher =>
        teacher.username.toLowerCase().includes(value.toLowerCase())
      );
      setTeacher(filteredTeacher);
    } else {
      fetchTeacher();
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
            icon={<DeleteOutlined style={{ color: 'red' }} />}
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
        <h3 style={{ textAlign: 'center' }}>Manage All Teachers</h3>
        <Search
          placeholder="Search teacher by name"
          style={{ width: '60%', marginBottom: 10 }}
          onSearch={handleSearch}
        /> <br />
       
      </center>
      <br />
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={teacher}
          scroll={{ x: '100%' }}
        />
      </div>
      {modalData && (
        <Modal
          title="Teacher Details"
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
          <p><strong>Teacher Name:</strong> {modalData.username ? modalData.username : ''}</p>
          <p><strong>Email:</strong> {modalData.email ? modalData.email : ''}</p>
          <p><strong>Gender:</strong> {modalData.gender ? modalData.gender : ''}</p>
          <p><strong>Joined date :</strong> {modalData.created_at ? modalData.created_at : ''}</p>
        </Modal>
      )}
    </div>
  );
};

export default App;
