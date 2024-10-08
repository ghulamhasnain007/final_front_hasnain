import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Layout, Modal, Avatar, message } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Navi from '../Teachercomp/Tnavi';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import url from '../api/api.js'
// let url = 'http://localhost:3000/api'
const { Header, Content, Footer } = Layout;

const UserReports = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [code, setCode] = useState('');
  const [student_id , setid] = useState('')
  const { id } = useParams();

  useEffect(() => {
    getClassCode();
    getClassData();
  }, []);

  const getClassCode = async () => {
    try {
      const response = await axios.get(`${url}/creteclass/getclass/${id}`);
      setCode(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const getClassData = async () => {
    try {
      const response = await axios.get(`${url}/classjoininguser/${id}`);
      const updatedData = response.data.map(user => ({
        ...user,
        key: user._id, // Adding unique key for each row
      }));
      setData(updatedData);
      console.log(updatedData);
    } catch (error) {
      console.error('Error fetching class details:', error);
    }
  };

  const handleSearch = async () => {
    if (searchText) {
      try {
        const classId = id; // Assuming classId is available from useParams()

        const response = await axios.post(`${url}/classjoininguser/get/${searchText}`, {
           classId
         });

        const updatedData = response.data.map(user => ({
          ...user,

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
          await axios.delete(`${url}/joinclass/delete`, { data: { classCode, userId } });
          message.success('Delete successful');
          setModalOpen(false);
          getClassData(); // Refresh data after deletion
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('Delete failed');
        }
      },
    });
  };

  const handleView = async(record) => {
    const res = await axios.get(`${url}/tasksubmit/${id}/${record._id}`);
    setid(res.data)
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
      <Navi /><br /><br /><br /><br /> <br />
      <Layout style={{ minHeight: '100vh', borderRadius: 30 }}>
        <h2 style={{ textAlign: 'center' ,marginTop : 10}}>All Students</h2>
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
              <h2 style={{marginTop : 20 , marginBottom : 20 }} >Class: {code.className}</h2>
            </div>
            <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: 30 }}>
              <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} />
            </div>
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Admin Dashboard ©2024 Created by YourCompany</Footer> */}
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
            <p><strong>Class Name:</strong> {code.className}</p>
            <p><strong>Total assigemnt : </strong> {`${student_id.total_assigemnt ? student_id.total_assigemnt : 0}`}</p>
            <p><strong>Submitted  : </strong> {`${student_id.student_submissions ? student_id.student_submissions: 0}`}</p>
            <p><strong> Not Submitted  : </strong> {`${student_id.total_assigemnt -  student_id.student_submissions ? student_id.total_assigemnt -  student_id.student_submissions  : 0   }`}</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserReports;
