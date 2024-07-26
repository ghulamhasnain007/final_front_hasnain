import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, List, message, Spin } from 'antd';
import { Pie } from '@ant-design/charts';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import student from '../token/student.js';
let url = 'http://localhost:3000/api'
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    let id = JSON.parse(localStorage.getItem('user')).userData.id;
    try {
      const response = await axios.get(`${url}/todo/${id}`);
      setItems(response.data);
      
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    let id = JSON.parse(localStorage.getItem('user')).userData.id;
    if (inputValue) {
      try {
        const response = await axios.post(`${url}/todo`, { task: inputValue, user_id: id });
        setItems([...items, response.data]);
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
    try {
      await axios.delete(`${url}/todo/${id}`);
      message.success('Task deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      message.error('Failed to delete task');
    }
  };

  return (
    <Card
      title="Todo List"
      bordered={false}
      style={{ height: '100%', borderRadius: "31px 27px 36px 17px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
    >
      <Input
        placeholder="Add a new task"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={addItem}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        onClick={addItem}
        block
        style={{ marginBottom: 10, borderRadius: '4px' }}
      >
        Add Task
      </Button>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <List
          bordered
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => deleteItem(item._id)}
                />,
              ]}
            >
              {item.task}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user.userData.id;

        const response = await student.get(`/point/${id}`);
        setData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { type: 'Total Points', value: data?.total_point || 0 },
    { type: 'Total Classes Joined', value: data?.total_class || 0 },
    { type: 'Total Submissions', value: data?.submission || 0 },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col xs={24} md={12}>
            <Card
              title="Overview Chart"
              bordered={false}
              style={{ borderRadius: "31px 27px 36px 17px", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
            >
              <DashboardChart data={chartData} />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <TodoList />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
