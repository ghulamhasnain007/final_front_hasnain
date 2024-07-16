import React from 'react';
import { Card, Row, Col, Typography } from 'antd';

const { Title } = Typography;

const SubmissionData = () => {
  // Example submission data array of objects
  const submissions = [
    { id: 1, className: 'Mathematics', taskName: 'Algebra Quiz', points: 95, status: 'checked' },
    { id: 2, className: 'Science', taskName: 'Chemistry Lab Report', points: 85, status: 'pending' },
    { id: 3, className: 'English', taskName: 'Essay on Shakespeare', points: 90, status: 'checked' },
    { id: 4, className: 'History', taskName: 'World War II Report', points: 80, status: 'pending' },
  ];

  // Filter submissions by status
  const pendingSubmissions = submissions.filter(submission => submission.status === 'pending');
  const checkedSubmissions = submissions.filter(submission => submission.status === 'checked');

  return (
    <div>
      <Title level={3}>Pending Submissions</Title>
      <Row gutter={[16, 16]}>
        {pendingSubmissions.map(submission => (
          <Col key={submission.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ marginBottom: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              cover={<img alt="example" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608" />}
            >
              <div style={{ height: 150 }}>
                <Title level={4} style={{ marginBottom: 0 }}>{submission.className}</Title>
                <p style={{ marginTop: 8 }}><strong>Task Name:</strong> {submission.taskName}</p>
                <p><strong>Points:</strong> {submission.points}</p>
                <p><strong>Status:</strong> {submission.status}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3}>Checked Submissions</Title>
      <Row gutter={[16, 16]}>
        {checkedSubmissions.map(submission => (
          <Col key={submission.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ marginBottom: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              cover={<img alt="example" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608" />}
            >
              <div style={{ height: 150 }}>
                <Title level={4} style={{ marginBottom: 0 }}>{submission.className}</Title>
                <p style={{ marginTop: 8 }}><strong>Task Name:</strong> {submission.taskName}</p>
                <p><strong>Points:</strong> {submission.points}</p>
                <p><strong>Status:</strong> {submission.status}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SubmissionData;
