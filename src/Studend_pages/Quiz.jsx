import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Row, Col, Card } from 'antd';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [form] = Form.useForm();
  const id = useParams()
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
      const response = await axios.get(`http://localhost:3000/api/quiz/student/${userId}`);
      console.log('Quizzes fetched:', response.data);
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
    let id = JSON.parse(localStorage.getItem('user')).userData.id;
    try {
      const response = await axios.post('http://localhost:3000/api/quiz/join', {
        quizKey: values.quizKey,
        studentId: id,
      });
      console.log('Quiz joined:', response.data);
      message.success('Quiz joined successfully');
      form.resetFields();
      setModalVisible(false);
      fetchQuizzes(); // Refresh the list of quizzes after joining
    } catch (error) {
      console.error('Error joining quiz:', error.response ? error.response.data : error.message);
      message.error('Failed to join quiz');
    }
  };

  const startQuiz = (quizId) => {
    // Implement logic to start the quiz session or navigate to quiz taking page
    console.log('Starting quiz:', quizId);
    // Example: Redirect to quiz page with quizId
    // Replace with your actual logic to start the quiz
  };


  return (
    <div>
      <Button onClick={() => setModalVisible(true)}>Join Quiz</Button>
      <Modal
        visible={modalVisible}
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
            <Button type="primary" htmlType="submit">
              Join Quiz
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Row gutter={16} style={{ marginTop: '16px' }}>
        {quizzes.map((quiz) => (
          <Col span={8} key={quiz._id}>
            <Card
              hoverable
              title={quiz.quizName}
              style={{ marginBottom: '16px' }}
            >
              <p>Quiz Key: {quiz.quizKey}</p>
              
              <Button type="primary" onClick={() => startQuiz(quiz._id)}>
                <Link to={`/student/start/${quiz._id}`} > 
                Start Quiz
                 </Link>
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default App;
