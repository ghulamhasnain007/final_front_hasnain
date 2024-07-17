import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Typography, Empty, Modal, Button } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Nav from '../Student_comp/Student_nav';

const { Title, Text } = Typography;

const SubmissionData = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [checkedSubmissions, setCheckedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      let id = JSON.parse(localStorage.getItem('user')).userData.id;
      
      try {
        const response = await axios.get(`http://localhost:3000/api/tasksubmit/mysubmissions/${id}`);
        console.log(response.data);
        if (response.data.pending) {
          setPendingSubmissions(response.data.pending);
        }
        if (response.data.checked) {
          setCheckedSubmissions(response.data.checked);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleCardClick = (submission) => {
    setCurrentSubmission(submission);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div>
      <Nav/> <br /><br /><br /><br />
      <Title style={{ marginLeft: 10 }} level={3}>Pending Submissions</Title>
      {pendingSubmissions && pendingSubmissions.length > 0 ? (
        <Row gutter={[16, 16]}>
          {pendingSubmissions.map(submission => (
            <Col key={submission._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ marginBottom: 19, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginLeft: 10 }}
                cover={<img alt="example" src={"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608"} />}
                onClick={() => handleCardClick(submission)}
              >
                <div style={{ height: 150 }}>
                  <Title level={4} style={{ marginBottom: 0 }}>Class : {submission.class_name || ''}</Title>
                  <p style={{ marginTop: 8 }}><strong>Task Name:</strong> {submission.task_name || ''}</p>
                  <p><strong>Points:</strong> {`${submission.point} / ${submission.total_points}`}</p>
                  <p>
                    <ClockCircleOutlined style={{ color: '#faad14' }} /> Pending
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No Pending Submissions" />
      )}

      <Title style={{ marginLeft: 10 }} level={3}>Checked Submissions</Title>
      {checkedSubmissions && checkedSubmissions.length > 0 ? (
        <Row gutter={[16, 16]}>
          {checkedSubmissions.map(submission => (
            <Col key={submission._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ marginBottom: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginLeft: 10 }}
                cover={<img alt="example" src={"https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608"} />}
                onClick={() => handleCardClick(submission)}
              >
                <div style={{ height: 150 }}>
                  <Title level={4} style={{ marginBottom: 0 }}>Class : {submission.class_name || ''}</Title>
                  <p style={{ marginTop: 8 }}><strong>Task Name:</strong> {submission.task_name || ''}</p>
                  <p><strong>Points:</strong> {`${submission.point} / ${submission.total_points}`}</p>
                  <p>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> Checked
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No Checked Submissions" />
      )}

      {/* Modal for Detailed Submission View */}
      <Modal
        title="Detailed Submission View"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="back" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
      >
        {currentSubmission && (
          <div>
            <Title level={4}>Class: {currentSubmission.class_name}</Title>
            <p><strong>Task Name:</strong> {currentSubmission.task_name}</p>
            <p><strong>Points:</strong> {`${currentSubmission.point} / ${currentSubmission.total_points}`}</p>
            {currentSubmission.img && (
              <img src={currentSubmission.img} alt="Submission Image" style={{ marginTop: '16px', maxWidth: '100%' }} />
            )}
            {currentSubmission.text && (
              <p style={{ marginTop: '16px' }}><strong>Submission Text:</strong> {currentSubmission.text}</p>
            )}
            {currentSubmission.url && (
              <p style={{ marginTop: '16px' }}><strong>Submission URL:</strong> <a href={currentSubmission.url} target="_blank" rel="noopener noreferrer">{currentSubmission.url}</a></p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionData;
