import React, { useState, useEffect, useRef } from 'react';
import { Card, Radio, Button, message, Alert, Progress } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuizResult from '../Student_comp/Result';
let url = 'http://localhost:3000/api'
const Quiz = () => {
  const { id } = useParams();
  const [btn, setBtn] = useState(false);
  const [quizid, setquizid] = useState('');
  const [loading, setLoading] = useState(true);
  const [quizDetails, setQuizDetails] = useState({
    teacherName: '',
    quizName: '',
    total_questions: 0,
    passingScore: 0,
    question_point: 0,
    timer: 0,
    total_point: 0
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
  const [active, setactive] = useState('')
  const [point, setpasing_point] = useState('')
  const exitFullScreenTimer = useRef(null);
  useEffect(() => {
    setLoading(false);
  }, []);
  useEffect(() => {
    const checkQuizTaken = async () => {
      const studentId = JSON.parse(localStorage.getItem('user')).userData.id;

      try {
        const response = await axios.get(`${url}/result/check-result/${id}/${studentId}`);
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
        const response = await axios.get(`${url}/quiz/start/${id}`);
        const quizData = response.data;
        setactive(quizData.active)
        console.log(quizData.passing_point);
        setquizid(quizData._id);
        setpasing_point(quizData.passing_point)
        if (quizData) {
          setQuizDetails({
            teacherName: quizData.teacher_name,
            quizName: quizData.quizName,
            total_questions: quizData.questions.length,
            passingScore: quizData.passing_point,
            question_point: quizData.question_point,
            timer: quizData.timer,
            total_point: quizData.total_point
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
      // enterFullScreen();
    }
  }, []);

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
    try {
      const currentQuestion = questions[currentIndex];
      if (currentQuestion && currentQuestion.selectedAnswer !== null) {
        const isCorrect = currentQuestion.selectedAnswer === currentQuestion.correctAnswer;
        if (isCorrect) {
          setScore((prevScore) => prevScore + quizDetails.question_point);
        }
  
        setQuizSubmitted(true);
        exitFullScreen();
        
        // Clear the quiz state from local storage
        localStorage.removeItem('quizState');
  
        // Fetch user details
        const studentId = JSON.parse(localStorage.getItem('user')).userData.id;
        const studentName = JSON.parse(localStorage.getItem('user')).userData.username;
  
        // Save the result
        await axios.post(`${url}/result/save-result`, {
          quizName: quizDetails.quizName,
          teacherName: quizDetails.teacherName,
          studentId,
          score,
          quiz_id: quizid,
          student_name: studentName,
          passing_point: point
        });
  
        message.success('Quiz result saved successfully');
      } else {
        message.warning('Please select an option before submitting.');
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      message.error('Failed to save quiz result');
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
    const percentage = (previousResult.score / quizDetails.total_point) * 100;
    // console.log(previousResult.score);
    // const percentage= (score / (quizDetails.totalPoints * quizDetails.total_point)) * 100;
    const status = previousResult.score >= quizDetails.passingScore ? 'success' : 'warning';

    let quiz = JSON.parse(localStorage.getItem('quizState'))

    return (

      <>
      {quiz ? <Button onClick={localStorage.removeItem('quizState')} >

        See youre result
      </Button> :  
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card
          title={`Quiz Result`}
          style={{ width: 350, textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}
        >
          <p>
            <strong>Teacher :</strong> {previousResult.teacherName}
          </p>
          <p>
            <strong>Quiz :</strong> {previousResult.quizName}
          </p>
          <p>
            <strong>Your Score:</strong> {previousResult.score}
          </p>
                {previousResult.score >= quizDetails.passingScore ? 
                <p style={{color : 'green'}} ><strong>Congratulations you pass</strong></p> :
                <p style={{color : 'red'}} ><strong >Sorry you Fail</strong></p> 
              }
          
          <Progress percent={percentage} status={status} />


        </Card>
      </div>
      }
      </>
      
    );
  }

  if (!quizStarted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card title={`Quiz Name: ${quizDetails.quizName}`} style={{ width: 350, textAlign: 'center' }}>
          <p>
            <strong>Teacher Name :</strong> {quizDetails.teacherName}
          </p>
          <p>
            <strong>Total Questions :</strong> {quizDetails.total_questions}
          </p>
          <p>
            <strong>Total Time :</strong> {`${quizDetails.timer} min`}
          </p>
          <p>
            <strong>Passing Score:</strong> {quizDetails.passingScore}
          </p>
          <br />
          {active ?
            <Button type="primary" onClick={handleStartQuiz}>
              Start Quiz
            </Button>
            :
            <h2 style={{ color: 'red' }}>Quiz is disabled</h2>
          }
        </Card>
      </div>
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      ) : (
        <Card
          title={`Question ${currentIndex + 1}`}
          style={{ maxWidth: '600px', width: '100%' }}
        >
          {exitFullScreenWarning ? (
            <>
              <Alert
                message="Warning"
                description="You have exited full screen mode. Please return to full screen within 20 seconds, or your quiz will be automatically submitted."
                type="warning"
                showIcon
              />
              <br />
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
                  <Radio key={index} value={option} style={{ display: 'block', marginBottom: '8px' }}>
                    {option}
                  </Radio>
                ))}
              </Radio.Group>
              <br />
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <strong>Time Left: {formatTime(timeLeft)}</strong>
              </div>
              {currentIndex < questions.length - 1 && btn && (
                <center>
                  <Button type="primary" onClick={handleNextQuestion} style={{ marginTop: '20px' }}>
                    Next Question
                  </Button>
                </center>
              )}
              {currentIndex === questions.length - 1 && btn && (
                <center>
                  <Button type="primary" style={{ marginTop: '20px' }} onClick={handleQuizSubmit}>
                    Submit Quiz
                  </Button>
                </center>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  );


};

export default Quiz;
