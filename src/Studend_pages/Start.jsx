import React, { useState, useEffect } from 'react';
import { Card, Radio, Button, message, Progress } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const { id } = useParams(); // Get id parameter from URL
  const [btn,setbtn] = useState(false)
  const [quizDetails, setQuizDetails] = useState({
    teacherName: '',
    quizName: '',
    totalPoints: 0,
    passingScore: 0
  });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/quiz/start/${id}`);
        const quizData = response.data;
        console.log(quizData);
        if (quizData) {
          setQuizDetails({
            teacherName: quizData.teacher_name,
            quizName: quizData.quizName,
            totalPoints : quizData.questions.length , // Assuming each question is worth 2 points
            passingScore: quizData.passing_point,
            question_point: quizData.question_point

          });
          setQuestions(quizData.questions);
        } else {
          message.error('Quiz data not found');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        message.error('Failed to fetch quiz data');
      }
    };

    if (id) {
      getQuiz();
    }
  }, [id]);

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setQuizStarted(true);
  };

  const handleOptionSelect = (option) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[currentIndex];
    currentQuestion.selectedAnswer = option;

    setQuestions(updatedQuestions);
    if(option){
        setbtn(true)
    }
  };

  const handleNextQuestion = () => {
    setbtn(false)
    const currentQuestion = questions[currentIndex];
    if (currentQuestion.selectedAnswer !== null) {
      const isCorrect = currentQuestion.selectedAnswer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore(score + quizDetails.question_point);
      }
      setCurrentIndex(currentIndex + 1);
    } else {
      message.warning('Please select an option before proceeding.');
    }
  };

  const handleQuizSubmit = () => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion.selectedAnswer !== null) {
      const isCorrect = currentQuestion.selectedAnswer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore(score + quizDetails.question_point);
      }
      setQuizSubmitted(true);
      // Ideally, you would send the score to the backend here
      message.success(`Your total score: ${score}`);
    } else {
      message.warning('Please select an option before submitting.');
    }
  };

  if (!quizDetails.quizName) {
    return <Card>Loading...</Card>; // Placeholder while quiz data is fetched
  }

  if (!quizStarted) {
    return (
      <Card title={`Quiz Details: ${quizDetails.quizName}`} style={{ textAlign: 'center' }}>
        <p><strong>Teacher:</strong> {quizDetails.teacherName}</p>
        <p><strong>Total Questions :</strong> {quizDetails.totalPoints}</p>
        <p><strong>Passing Score:</strong> {quizDetails.passingScore}</p>
        <Button type="primary" onClick={handleStartQuiz}>Start Quiz</Button>
      </Card>
    );
  }

  if (quizSubmitted) {
    return (
      <Card title={`Quiz Results: ${quizDetails.quizName}`} style={{ textAlign: 'center' }}>
        <p><strong>Your Total Score:</strong> {score}</p>
        <Progress percent={(score / quizDetails.totalPoints) * 100} />
      </Card>
    );
  }

  if (currentIndex === -1 || currentIndex >= questions.length) {
    return null; // Or handle this scenario based on your app's logic
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Card title={`Question ${currentIndex + 1}`}>
      <p>{currentQuestion.question}</p>
      <Radio.Group 
        onChange={(e) => handleOptionSelect(e.target.value)}
        value={currentQuestion.selectedAnswer} // Set the selected value correctly
      >
        {currentQuestion.options.map((option, index) => (
          <Radio key={index} value={option}>
            {option}
          </Radio>
        ))}
      </Radio.Group>
      <br />
      <br />
      {currentIndex < questions.length - 1 && (
        btn ? 
        <Button type="primary" onClick={handleNextQuestion}>
          Next Question
        </Button> : ''
      )}
      {currentIndex === questions.length - 1 && (
        btn ?
        <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleQuizSubmit}>
          Submit Quiz
        </Button> : ''
      )}
    </Card>
  );
};

export default Quiz;
