import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, List, message } from 'antd';
import { Pie } from '@ant-design/charts';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import student from '../token/student.js';

const DashboardChart = ({ data }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    interactions: [{ type: 'element-active' }],
    colors: ['#f56a00', '#7265e6', '#ffbf00', '#00a854'],
  };

  return <Pie {...config} />;
};

const TodoList = () => {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Fetch initial data from backend when component mounts
    fetchItems();
  }, []);

  const fetchItems = async () => {
    let id = JSON.parse(localStorage.getItem('user')).userData.id;
    try {
      const response = await axios.get(`http://localhost:3000/api/todo/${id}`); // Replace with your endpoint
      setItems(response.data); // Assuming response.data is an array of items
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    let id = JSON.parse(localStorage.getItem('user')).userData.id;
    if (inputValue) {
      try {
        const response = await axios.post('http://localhost:3000/api/todo', { task: inputValue, user_id: id }); // Replace with your endpoint
        setItems([...items, response.data]); // Assuming response.data is the added item
        setInputValue('');
        message.success('Task added successfully');
        fetchItems();
      } catch (error) {
        console.error('Error adding item:', error);
        message.error('Failed to add task');
      }
    }
  };

  const deleteItem = async (id) => {
   console.log(id);
    try {
      await axios.delete(`http://localhost:3000/api/todo/${id}`); // Replace with your endpoint and item ID
      message.success('Task deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      message.error('Failed to delete task');
    }
  };

  return (
    <Card title="Add Todo" bordered={false} style={{ height: '100%' }}>
      <Input
        placeholder="Add a new task"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={addItem}
        style={{ marginBottom: 10 }}
      />
      <Button type="primary" onClick={addItem} block style={{ marginBottom: 10 }}>
        Add Task
      </Button>
      <List
        bordered
        dataSource={items}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                type="text"
                icon={<DeleteOutlined />}
                onClick={() => deleteItem(item._id)}
              />,
            ]}
          >
            {item.task} {/* Assuming your item structure has a `task` field */}
          </List.Item>
        )}
      />
    </Card>
  );
};

const Dashboard = () => {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user.userData.id;

        // Fetch Total Points, Total Classes Joined, Total Submissions
        const response = await student.get(`/point/${id}`);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { type: 'Total Points', value: data.total_point || 0 },
    { type: 'Total Classes Joined', value: data.total_class || 0 },
    { type: 'Total Submissions', value: data.submission || 0 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Overview Chart" bordered={false}>
            <DashboardChart data={chartData} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <TodoList />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
