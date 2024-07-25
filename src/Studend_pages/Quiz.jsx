import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Row, Col, Card } from 'antd';
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
import Navi from '../Student_comp/Student_nav';
let url = 'https://saylaniportalback-production.up.railway.app/api'
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [form] = Form.useForm();
  const id = useParams();

  useEffect(() => {
    fetchQuizzes();
  }, []); // Fetch quizzes on initial render

  const fetchQuizzes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userData || !user.userData.id) {
        console.error('User data or ID not found in localStorage.');
        return;
      }

      const userId = user.userData.id;
      const response = await axios.get(`${url}/quiz/student/${userId}`);
      setQuizzes(response.data.quizzes); // Assuming response structure includes quizzes array
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const onFinish = async (values) => {
    const id = JSON.parse(localStorage.getItem('user')).userData.id;
    try {
      const response = await axios.post(`${url}/quiz/join`, {
        quizKey: values.quizKey,
        studentId: id,
      });
      message.success('Quiz joined successfully');
      form.resetFields();
      setModalVisible(false);
      fetchQuizzes(); // Refresh the list of quizzes after joining
    } catch (error) {
      console.error('Error joining quiz:', error.response ? error.response.data : error.message);
      message.error('Failed to join quiz');
    }
  };

  return (
    <>
      <Navi />
      <br /><br /><br /><br /><br /><br />
      <div style={{ padding: '20px', backgroundColor: '#f0f2f5',borderRadius: "12px 9px 35px 37px"  }}>
        <center>
          <Button
            type="primary"
            onClick={() => setModalVisible(true)}
            style={{ marginBottom: '16px', backgroundColor: '#1890ff', borderColor: '#1890ff' }}
          >
            Join Quiz
          </Button>
        </center>

        <Modal
          open={modalVisible}
          title="Join Quiz"
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="quizKey"
              label="Quiz Key"
              rules={[{ required: true, message: 'Please enter the quiz key' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <center>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  Join Quiz
                </Button>
              </center>
            </Form.Item>
          </Form>
        </Modal>

        <Row gutter={16} style={{ marginTop: '16px' }}>
          {quizzes.map((quiz) => (
            <Col xs={24} sm={12} md={8} lg={6} key={quiz._id}>
              <Card
                hoverable
                title={`Quiz Name: ${quiz.quizName}`}
                style={{
                  marginBottom: '16px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: "12px 9px 35px 37px" ,
                  backgroundColor: '#ffffff',
                }}
              >
                <p><strong>Teacher Name:</strong> {quiz.teacher_name}</p>
                <p><strong>Quiz Key:</strong> {quiz.quizKey}</p>
                <Button
                  type="primary"
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  <Link to={`/student/start/${quiz._id}`} style={{ color: '#ffffff' }}>
                    Start Quiz
                  </Link>
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default App;
