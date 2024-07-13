import React, { useState } from 'react';
import { Table, Input, Select, DatePicker, Button, Layout, Modal } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Navi from '../Admin_comp/Navi';

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Sample data
const data = [
  {
    key: 1,
    name: 'John Brown',
    email: 'john.brown@example.com',
    roll: 'Student',
    datereport: '2023-01-01',
  },
  {
    key: 2,
    name: 'Jim Green',
    email: 'jim.green@example.com',
    roll: 'Student',
    datereport: '2023-02-15',
  },
  {
    key: 3,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    roll: 'Teacher',
    datereport: '2023-03-10',
  },
];

const UserReports = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState('');
  const [selectedroll, setSelectedroll] = useState('');
  const [dateRange, setDateRange] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = () => {
    let filtered = data;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedroll) {
      filtered = filtered.filter((item) => item.roll === selectedroll);
    }

    if (dateRange.length === 2) {
      filtered = filtered.filter((item) => {
        const datereport = new Date(item.datereport);
        return datereport >= dateRange[0] && datereport <= dateRange[1];
      });
    }

    setFilteredData(filtered);
  };

  const handleDelete = (record) => {
    const newData = filteredData.filter((item) => item.key !== record.key);
    setFilteredData(newData);
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
    },
    {
      title: 'Roll',
      dataIndex: 'roll',
      key: 'roll',
      width: '20%',
    },
    {
      title: 'Date Report',
      dataIndex: 'datereport',
      key: 'datereport',
      width: '20%',
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
      width: '10%',
    },
  ];

  return (
    <>
      <Navi /><br /><br /><br /><br />
      <Layout style={{ minHeight: '100vh' }}>
        {/* <Header className="site-layout-background" style={{ padding: 0 }}> */}
          <h2 style={{ textAlign: 'center' }}>User Reports</h2>
        {/* </Header> */}
        <Content style={{ margin: '16px 16px' }}>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
              <Input
                placeholder="Search by name or email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ maxWidth: 300, marginRight: 8 }}
              />
              <Select
                placeholder="Select roll"
                value={selectedroll}
                onChange={(value) => setSelectedroll(value)}
                style={{ width: 120, marginRight: 8 }}
              >
                <Option value="">All</Option>
                <Option value="Student">Student</Option>
                <Option value="Teacher">Teacher</Option>
              </Select>
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                style={{ marginRight: 8 }}
              />
              <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                Search
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: '100%', y: 400 }} // Add scroll bar after screen is mobile
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Admin Dashboard ©2024 Created by YourCompany</Footer>
      </Layout>

      {/* View Modal */}
      <Modal
        title="User Details"
        open={modalOpen} // Use open instead of visible
        onClose={closeModal} // Use onClose instead of onCancel
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>
        ]}
      >
        {selectedUser && (
          <>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Roll:</strong> {selectedUser.roll}</p>
            <p><strong>Date Report:</strong> {selectedUser.datereport}</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserReports;
