import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Modal, Button, message, Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from '../Teachercomp/Tnavi';
const { Meta } = Card;
// let url = 'http://localhost:3000/api'
import url from '../api/api.js'
import { AuthContext } from '../Context/AuthContext.jsx';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const { auth } = useContext(AuthContext)

  const fetchQuizzes = async () => {
    let id = auth.teacher.userData.id;
    // let id = JSON.parse(localStorage.getItem('user')).userData.id;
    try {
      const response = await axios.get(`${url}/quiz/teacher/${id}`);
      setQuizzes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const updateQuizActiveStatus = async (quizId, activeStatus) => {
    try {
      const response = await axios.put(`${url}/quiz/active/${quizId}`, {
        active: activeStatus,
      });
      // console.log('Quiz updated:', response.data);

      // Update local state to reflect the change
      const updatedQuizzes = quizzes.map((quiz) =>
        quiz._id === quizId ? { ...quiz, active: activeStatus } : quiz
      );
      setQuizzes(updatedQuizzes);

      message.success(`Quiz ${activeStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating quiz:', error);
      message.error('Failed to update quiz');
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      const response = await axios.delete(`${url}/quiz/quiz_delete/${quizId}`);
      // console.log('Quiz deleted:', response.data);

      // Remove the deleted quiz from local state
      const updatedQuizzes = quizzes.filter((quiz) => quiz._id !== quizId);
      setQuizzes(updatedQuizzes);
      fetchQuizzes();
      message.success('Quiz deleted successfully!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      message.error('Failed to delete quiz');
    }
  };

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Quiz Key copied to clipboard!');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <Nav /> <br /><br /><br /><br /><br /><br /><br />
      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: "45px 10px 52px 1px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '1200px', margin: 'auto' }}>
        <center>
          <h1 style={{ fontSize: '2rem' }}>All Quizzes</h1>
        </center>
        <Row gutter={[16, 24]}>
          {quizzes.map((quiz, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={quiz._id}>
              <Card
                hoverable
                style={{ marginBottom: '16px', borderRadius: "45px 10px 52px 1px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                actions={[
                  <Tooltip title="Copy Quiz Key" key="copy">
                    <CopyOutlined style={{color : 'blue'}} onClick={() => copyToClipboard(quiz.quizKey)} />
                  </Tooltip>,
                  <Tooltip title="Delete Quiz" key="delete">
                    <DeleteOutlined style={{color : 'red'}} onClick={() => deleteQuiz(quiz._id)} />
                  </Tooltip>,
                ]}
              >
                <Meta
                  title={`${index + 1}: Quiz Name: ${quiz.quizName}`}
                  description={
                    <>
                      <div>
                        <h4>Quiz Key: {quiz.quizKey}</h4>
                        <h5>Created Date: {quiz.createdAt ? quiz.createdAt : ''}</h5>
                      </div>
                      <Button onClick={() => showModal(quiz)} style={{ marginRight: '8px' }}>View Quiz</Button>
                      {quiz.active ? (
                        <Button onClick={() => updateQuizActiveStatus(quiz._id, false)} type="primary" danger ghost>
                          Disable Quiz
                        </Button>
                      ) : (
                        <Button onClick={() => updateQuizActiveStatus(quiz._id, true)} type="primary">
                          Enable Quiz
                        </Button>
                      )}
                      {/* <Button onClick={() => deleteQuiz(quiz._id)} type="danger" icon={<DeleteOutlined />} style={{ marginLeft: '8px' }}>
                        Delete Quiz
                      </Button> */}
                      <hr />
                      <Link to={`/teacher/quizresult/${quiz._id}`}>
                        <h4>Check Student Result</h4>
                      </Link>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {selectedQuiz && (
          <Modal
            title={`Quiz Name: ${selectedQuiz.quizName}`}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            style={{ padding: '24px' }}
          >
            {selectedQuiz.questions.map((question, index) => (
              <div key={index} style={{ marginBottom: '24px' }}>
                <h3>{`Question ${index + 1}: ${question.question}`}</h3>
                <ul>
                  {question.options.map((option, idx) => (
                    <li key={idx}>{idx + 1}: {option}</li>
                  ))}
                </ul>
                <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
              </div>
            ))}
          </Modal>
        )}
        <center>
          <Link to={'/teacher/quiz'}>
            <Button type='primary'>Back to Create Quiz</Button>
          </Link>
        </center>
      </div>
    </>
  );
};

export default QuizList;
