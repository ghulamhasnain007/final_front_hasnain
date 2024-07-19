import React from 'react';
import { Card, Progress } from 'antd';

const QuizResult = ({ quizDetails, score }) => {
  // const percentage= (score / (quizDetails.totalPoints * quizDetails.total_point)) * 100;
  // console.log(quizDetails,score)
  const percentage = (score / quizDetails.total_point) * 100;
  // const percentage = (score / quizDetails.total_point) * 100;
  const progressColor = score >= quizDetails.passingScore ? 'green' : 'red';
  
    let quiz = JSON.parse(localStorage.getItem('quizState'))
    if(quiz){
      localStorage.removeItem('quizState')
    }
  return (

  
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}  >
      <Card
      title={`Quiz Results`}
      style={{ width: 350, textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}
    //   bodyStyle={{ padding: '20px' }}
    >
      <p><strong>Teacher:</strong> {quizDetails.teacherName}</p>
      <p><strong>Your Total Score:</strong> {score}</p> <br />
      {score >= quizDetails.passingScore ?
        <p style={{ color: 'green' }} ><strong>Congratulations you pass</strong></p> :
        <p style={{ color: 'red' }} ><strong >Sorry you Fail</strong></p>
      }
      <Progress percent={percentage} strokeColor={progressColor} />
    </Card> 
    </div>
   
  );
};

export default QuizResult;
