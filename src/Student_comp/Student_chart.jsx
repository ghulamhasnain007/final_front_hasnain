import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Button, List } from 'antd';
import { Pie } from '@ant-design/charts';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

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

  const addItem = () => {
    if (inputValue) {
      setItems([...items, inputValue]);
      setInputValue('');
    }
  };

  const deleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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
                onClick={() => deleteItem(index)}
              />,
            ]}
          >
            {item}
          </List.Item>
        )}
      />
    </Card>
  );
};

const Dashboard = () => {
  const [totalPoints, setTotalPoints] = useState('');
  const [totalClasses, setTotalClasses] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const id = user.userData.id;

        // Fetch Total Points
        const pointsResponse = await axios.get(`http://localhost:3000/api/point/${id}`);
        setTotalPoints(pointsResponse.data);
        console.log(pointsResponse.data);
        // Fetch Total Classes Joined
        const classesResponse = await axios.get(`http://localhost:3000/api/point/get/${id}`)
        setTotalClasses(classesResponse.data.totalclassjoin);
        console.log(classesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  

  const chartData = [
    { type: 'Total Points', value: totalPoints.totalPoints },
    { type: 'Total Classes Joined', value: totalClasses},
    { type: 'Total submmisions', value: totalPoints.totalSubmissions },
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
