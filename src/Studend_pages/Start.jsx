import React, { useState, useEffect, useRef } from 'react';
import { Card, Radio, Button, message, Alert } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizResult from '../Student_comp/Result';

const Quiz = () => {
  const { id } = useParams();
  const [btn, setBtn] = useState(false);
  const [quizid, setquizid] = useState('');
  const [quizDetails, setQuizDetails] = useState({
    teacherName: '',
    quizName: '',
    totalPoints: 0,
    passingScore: 0,
    question_point: 0,
    timer: 0,
  });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [previousResult, setPreviousResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [exitFullScreenWarning, setExitFullScreenWarning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [active , setactive] = useState('')
  const [point,setpasing_point] = useState('')
  const exitFullScreenTimer = useRef(null);
 
  useEffect(() => {
    const checkQuizTaken = async () => {
      const studentId = JSON.parse(localStorage.getItem('user')).userData.id;

      try {
        const response = await axios.get(`http://localhost:3000/api/result/check-result/${id}/${studentId}`);
        if (response.data.taken) {
          setAlreadyTaken(true);
          setPreviousResult(response.data.result);
        }
      } catch (error) {
        console.error('Error checking quiz taken:', error);
        // message.error('Failed to check if quiz was taken');
      }
    };

    if (id) {
      checkQuizTaken();
    }
  }, [id]);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/quiz/start/${id}`);
        const quizData = response.data;
        setactive(quizData.active)
        console.log(quizData.passing_point);
        setquizid(quizData._id );
        setpasing_point(quizData.passing_point)
        if (quizData) {
          setQuizDetails({
            teacherName: quizData.teacher_name,
            quizName: quizData.quizName,
            totalPoints: quizData.questions.length,
            passingScore: quizData.passing_point,
            question_point: quizData.question_point,
            timer: quizData.timer,
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

    if (id && !alreadyTaken) {
      getQuiz();
    }
  }, [id, alreadyTaken]);

  useEffect(() => {
    const savedQuizState = JSON.parse(localStorage.getItem('quizState'));
    if (savedQuizState && savedQuizState.id === id) {
      setQuizStarted(true);
      setCurrentIndex(savedQuizState.currentIndex);
      setScore(savedQuizState.score);
      setTimeLeft(savedQuizState.timeLeft);
      setQuestions(savedQuizState.questions);
      setQuizDetails(savedQuizState.quizDetails);
      enterFullScreen();
    }
  }, [id]);

  useEffect(() => {
    if (quizStarted && quizDetails.timer > 0 && timeLeft === null) {
      setTimeLeft(quizDetails.timer * 60);
    }
  }, [quizStarted, quizDetails.timer, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleQuizSubmit();
    }

    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          saveQuizState();
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    const handleResize = () => {
      if (quizStarted && !document.fullscreenElement) {
        showExitFullScreenWarning();
      }
    };

    const handleFullScreenChange = () => {
      if (quizStarted && !document.fullscreenElement) {
        showExitFullScreenWarning();
      } else if (document.fullscreenElement) {
        setExitFullScreenWarning(false);
        clearTimeout(exitFullScreenTimer.current);
        setIsFullScreen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [quizStarted]);

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const saveQuizState = () => {
    const quizState = {
      id,
      currentIndex,
      score,
      timeLeft,
      questions,
      quizDetails,
    };
    localStorage.setItem('quizState', JSON.stringify(quizState));
  };

  const handleStartQuiz = () => {
    setCurrentIndex(0);
    setQuizStarted(true);
    enterFullScreen();
    saveQuizState();
  };

  const handleOptionSelect = (option) => {
    const updatedQuestions = [...questions];
    const currentQuestion = updatedQuestions[currentIndex];
    currentQuestion.selectedAnswer = option;

    setQuestions(updatedQuestions);
    saveQuizState();
    if (option) {
      setBtn(true);
    }
  };

  const handleNextQuestion = () => {
    setBtn(false);
    const currentQuestion = questions[currentIndex];
    if (currentQuestion.selectedAnswer !== null) {
      const isCorrect = currentQuestion.selectedAnswer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore((prevScore) => prevScore + quizDetails.question_point);
      }
      setCurrentIndex(currentIndex + 1);
      saveQuizState();
    } else {
      message.warning('Please select an option before proceeding.');
    }
  };

  const handleQuizSubmit = async () => {
    const currentQuestion = questions[currentIndex];
    if (currentQuestion.selectedAnswer !== null) {
      const isCorrect = currentQuestion.selectedAnswer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore((prevScore) => prevScore + quizDetails.question_point);
      }
      setQuizSubmitted(true);
      // message.success(`Your total score: ${score}`);
      localStorage.removeItem('quizState');
      exitFullScreen();

      const studentId = JSON.parse(localStorage.getItem('user')).userData.id;
      const student_name = JSON.parse(localStorage.getItem('user')).userData.username
      try {
        await axios.post('http://localhost:3000/api/result/save-result', {
          quizName: quizDetails.quizName,
          teacherName: quizDetails.teacherName,
          studentId,
          score,
          quiz_id: quizid,
          student_name: student_name,
          passing_point : point
        });
        // message.success('Quiz result saved successfully');
      } catch (error) {
        console.error('Error saving quiz result:', error);
        // message.error('Failed to save quiz result');
      }
    } else {
      message.warning('Please select an option before submitting.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const showExitFullScreenWarning = () => {
    setExitFullScreenWarning(true);
    setIsFullScreen(false);
    exitFullScreenTimer.current = setTimeout(() => {
      if (!document.fullscreenElement) {
        handleQuizSubmit();
      } else {
        setExitFullScreenWarning(false);
      }
    }, 20000);
  };

  if (!quizDetails.quizName) {
    return <Card>Loading...</Card>;
  }

  if (alreadyTaken) {
    return (
      <Card title={`Quiz Result: ${quizDetails.quizName}`} style={{ textAlign: 'center' }}>
        <p>
          <strong>Teacher:</strong> {previousResult.teacherName}
        </p>
        <p>
          <strong>Quiz Name:</strong> {previousResult.quizName}
        </p>
        <p>
          <strong>Your Score:</strong> {previousResult.score}
        </p>
      </Card>
    );
  }

  if (!quizStarted) {
    return (
      <Card title={`Quiz Name: ${quizDetails.quizName}`} style={{ textAlign: 'center' }}>
        <p>
          <strong>Teacher Name :</strong> {quizDetails.teacherName}
        </p>
        <p>
          <strong>Total Questions :</strong> {quizDetails.totalPoints}
        </p>
        <p>
          <strong> Total Time :</strong> {`${quizDetails.timer} min`} 
        </p>
        <p>
          <strong>Passing Score:</strong> {quizDetails.passingScore}
        </p> <br />
        {active  ?  
        <Button type="primary" onClick={handleStartQuiz}>
          Start Quiz
        </Button> : <h2 style={{color : 'red'}} >Quiz is disable</h2> }
      </Card>
    );
  }

  if (quizSubmitted) {
    return <QuizResult quizDetails={quizDetails} score={score} />;
  }

  if (currentIndex === -1 || currentIndex >= questions.length) {
    return null;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Card title={`Question ${currentIndex + 1}`}>
      {exitFullScreenWarning ? (
        <>
          <Alert
            message="Warning"
            description="You have exited full screen mode. Please return to full screen within 20 seconds, or your quiz will be automatically submitted."
            type="warning"
            showIcon
          /> <br />
          <center>
            <Button type="primary" onClick={enterFullScreen}>
              Return to Full Screen
            </Button>
          </center>
          <br />
        </>
      ) : (
        <>
          <p>{currentQuestion.question}</p>
          <Radio.Group onChange={(e) => handleOptionSelect(e.target.value)} value={currentQuestion.selectedAnswer}>
            {currentQuestion.options.map((option, index) => (
              <Radio key={index} value={option}>
                {option}
              </Radio>
            ))}
          </Radio.Group>
          <br />
          <br />
          <div>
            <strong>Time Left: {formatTime(timeLeft)}</strong>
          </div>
          {currentIndex < questions.length - 1 && btn && (
            <Button type="primary" onClick={handleNextQuestion}>
              Next Question
            </Button>
          )} <br />
          {currentIndex === questions.length - 1 && btn && (
            <Button type="primary" style={{ marginLeft: '10px' }} onClick={handleQuizSubmit}>
              Submit Quiz
            </Button>
          )}
        </>
      )}
    </Card>
  );
};

export default Quiz;
