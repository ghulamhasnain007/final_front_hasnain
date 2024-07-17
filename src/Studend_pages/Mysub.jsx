import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Typography, Empty, Modal, Button, Input } from 'antd';

const { Title } = Typography;

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

  const handleImageClick = () => {
    // Implement logic to show image
    // For now, assuming submission has an `img` property
    // Ensure `currentSubmission` has correct properties based on your API response
    // Example: setCurrentSubmission({ ...currentSubmission, showImage: true });
    setCurrentSubmission({ ...currentSubmission, showImage: true });
  };

  return (
    <div>
      <Title level={3}>Pending Submissions</Title>
      {pendingSubmissions && pendingSubmissions.length > 0 ? (
        <Row gutter={[16, 16]}>
          {pendingSubmissions.map(submission => (
            <Col key={submission._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ marginBottom: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                cover={<img alt="example" src={submission.img || "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608"} />}
                onClick={() => handleCardClick(submission)}
              >
                <div style={{ height: 150 }}>
                  <Title level={4} style={{ marginBottom: 0 }}>{submission.class_id || 'Dummy Class'}</Title>
                  <p style={{ marginTop: 8 }}><strong>Task Name:</strong> {submission.task_id || 'Dummy Task'}</p>
                  <p><strong>Points:</strong> {submission.points || 'N/A'}</p>
                  <p><strong>Total Points:</strong> {submission.total_points || 'N/A'}</p>
                  <p><strong>Status:</strong> {submission.status || 'Pending'}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No Pending Submissions" />
      )}

      <Title level={3}>Checked Submissions</Title>
      {checkedSubmissions && checkedSubmissions.length > 0 ? (
        <Row gutter={[16, 16]}>
          {checkedSubmissions.map(submission => (
            <Col key={submission._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ marginBottom: 16, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                cover={<img alt="example" src={submission.img || "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608"} />}
                onClick={() => handleCardClick(submission)}
              >
                <div style={{ height: 150 }}>
                  <Title level={4} style={{ marginBottom: 0 }}>{submission.className || 'Dummy Class'}</Title>
                  <p style={{ marginTop: 8 }}><strong>Task Name:</strong> {submission.taskName || 'Dummy Task'}</p>
                  <p><strong>Points:</strong> {submission.points || 'N/A'}</p>
                  <p><strong>Total Points:</strong> {submission.total_points || 'N/A'}</p>
                  <p><strong>Status:</strong> {submission.status || 'Checked'}</p>
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
            <p>Text Area 1: Add your text here</p>
            <Button type="primary" onClick={handleImageClick}>Show Image</Button>
            {/* Conditionally render image */}
            {currentSubmission.showImage && (
              <img src={currentSubmission.img} alt="Submission Image" style={{ marginTop: '16px', maxWidth: '100%' }} />
            )}
            <Input placeholder="Add your input here" style={{ marginTop: '16px' }} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionData;
