import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Modal, Carousel } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/quiz');
        setQuizzes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const showModal = (quiz) => {
    setSelectedQuiz(quiz);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Row gutter={16}>
        {quizzes.map((quiz) => (
          <Col span={8} key={quiz._id}>
            <Card
              hoverable
              title={quiz.quizName}
              style={{ marginBottom: '16px' }}
              onClick={() => showModal(quiz)}
            >
              <Meta description={`Quiz Key: ${quiz.quizKey}`} />
            </Card>
          </Col>
        ))}
      </Row>

      {selectedQuiz && (
        <Modal
          title={` Quiz name : ${selectedQuiz.quizName}`}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          width={800}
          style={{ padding: '24px' }}
          styles={{ body: { padding: '24px' } }}
        >
          {selectedQuiz.questions.map((question, index) => (
            <div key={index} style={{ marginBottom: '24px' }}>
              <h3>{`Question ${index + 1} :  ${question.question}`}</h3>
              <ul>
                {question.options.map((option, idx) => (
                  <li key={idx}>{idx + 1} : {option}</li>
                ))}
              </ul>
              <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
            </div>
          ))}
        </Modal>
      )}
    </>
  );
};

export default QuizList;
