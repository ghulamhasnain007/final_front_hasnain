import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout, Modal, Avatar, message } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Navi from '../Teachercomp/Tnavi';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const UserReports = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [code, setCode] = useState('');
  const { id } = useParams();

  useEffect(() => {
    getClassCode();
    getClassData();
  }, []);

  const getClassCode = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/creteclass/getclass/${id}`);
      setCode(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const getClassData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/classjoininguser/${id}`);
      const updatedData = response.data.map(user => ({
        ...user,
        className: user.className || 'Default Class Name',
        key: user._id, // Adding unique key for each row
      }));
      setData(updatedData);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const handleSearch = async () => {
    if (searchText) {
      try {
        const classId = id; // Assuming classId is available from useParams()

        const response = await axios.post(`http://localhost:3000/api/classjoininguser/get/${searchText}`, {
           classId
         });

        const updatedData = response.data.map(user => ({
          ...user,
          className: user.className || 'Default Class Name',
          key: user._id, // Adding unique key for each row
        }));
        setData(updatedData);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching class details:', error);
      }
    } else {
      getClassData();
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          const classCode = code.class_code;
          const userId = record._id;
          await axios.delete(`http://localhost:3000/api/joinclass/delete`, { data: { classCode, userId } });
          message.success('Delete successful');
          getClassData(); // Refresh data after deletion
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('Delete failed');
        }
      },
    });
  };

  const handleView = (record) => {
    setSelectedUser(record);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <>
          <Avatar src={record.profileurl} size="small" style={{ marginRight: 8 }} />
          {text}
        </>
      ),
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
          <Button type="link" onClick={() => handleView(record)}>View</Button>
          <Button type="link" onClick={() => handleDelete(record)} danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <Navi /><br /><br /><br /><br />
      <Layout style={{ minHeight: '100vh', borderRadius: 30 }}>
        <h2 style={{ textAlign: 'center' }}>All Students</h2>
        <Content style={{ margin: '16px 16px', borderRadius: 30 }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <Input
                placeholder="Search by name or email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: 300, marginRight: 8 }}
              />
              <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                Search
              </Button><br />
              <h2>Class Name: {code.className}</h2>
            </div>
            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: 30 }}>
              <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Admin Dashboard ©2024 Created by YourCompany</Footer>
      </Layout>

      {/* View Modal */}
      <Modal
        title="User Details"
        open={modalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
      >
        {selectedUser && (
          <>
            <center><Avatar src={selectedUser.profileurl} size={64} /></center>
            <p><strong>Name:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Class Name:</strong> {selectedUser.className}</p>
            <p><strong>Join Date:</strong> {selectedUser.datereport}</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserReports;
