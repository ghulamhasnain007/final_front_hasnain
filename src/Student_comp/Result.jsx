import React from 'react';
import { Card, Progress } from 'antd';

const QuizResult = ({ quizDetails, score }) => {
  const percent = (score / (quizDetails.totalPoints * quizDetails.question_point)) * 100;
  const progressColor = score >= quizDetails.passingScore ? 'green' : 'red';

  return (
    <Card
      title={`Quiz Results: ${quizDetails.quizName}`}
      style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto',padding: '20px' }}
    //   bodyStyle={{ padding: '20px' }}
    >
      <p><strong>Teacher:</strong> {quizDetails.teacherName}</p>
      <p><strong>Your Total Score:</strong> {score}</p>
      <Progress percent={percent} strokeColor={progressColor} />
    </Card>
  );
};

export default QuizResult;
