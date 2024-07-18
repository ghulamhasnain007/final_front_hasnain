import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Modal, Button, message, Tooltip } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Nav from '../Teachercomp/Tnavi';
const { Meta } = Card;

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);


  const fetchQuizzes = async () => {
    let id = JSON.parse(localStorage.getItem('techerdata')).userData.id;
    try {
      const response = await axios.get(`http://localhost:3000/api/quiz/teacher/${id}`);
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
      const response = await axios.put(`http://localhost:3000/api/quiz/active/${quizId}`, {
        active: activeStatus,
      });
      console.log('Quiz updated:', response.data);

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
      const response = await axios.delete(`http://localhost:3000/api/quiz/quiz_delete/${quizId}`);
      console.log('Quiz deleted:', response.data);

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
    return <Spin size="large" />;
  }

  return (
    <>
      <Nav />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <center>
        <h1>All Quizes</h1>
      </center>
      <Row gutter={16}>
        {quizzes.map((quiz,index) => (
          <Col span={8} key={quiz._id}>
            <Card hoverable style={{ marginBottom: '16px' }}>
              <Meta
                title={`${index + 1} : Quiz name : ${quiz.quizName}`}
                description={
                  <>
                    <div>
                      <h4>{`Quiz Key: ${quiz.quizKey}`} <CopyOutlined key="copy" onClick={() => copyToClipboard(quiz.quizKey)} /></h4>
                      <h5> Created_date : {quiz.createdAt ? quiz.createdAt : ''}</h5>
                    </div>
                    <Button onClick={() => showModal(quiz)}>View Quiz</Button> <br /><br />
                    {quiz.active ? (
                      <Button onClick={() => updateQuizActiveStatus(quiz._id, false)} type="primary" danger ghost>
                        Disable Quiz
                      </Button>
                    ) : (
                      <Button onClick={() => updateQuizActiveStatus(quiz._id, true)} type="primary">
                        Enable Quiz
                      </Button>
                    )}  <Button onClick={() => deleteQuiz(quiz._id)} type="danger" icon={<DeleteOutlined />}>
                      Delete Quiz
                    </Button>
                    
                    <hr />
                    <Link to={`/teacher/quizresult/${quiz._id}`}>
                      <h4>See student result</h4>
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
          title={`Quiz name: ${selectedQuiz.quizName}`}
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
      <Link to={'/teacher/quiz'}>
        <center>
          <Button type='primary'>Back</Button>
        </center>
      </Link>

    </>
  );
};

export default QuizList;
