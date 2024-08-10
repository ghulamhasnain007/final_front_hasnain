import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Row, Col, Typography, Empty, Modal, Button, Spin, Alert } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Nav from '../Student_comp/Student_nav';
import { Link } from 'react-router-dom';
import { FaExternalLinkSquareAlt } from "react-icons/fa";
const { Title, Text } = Typography;
// let url = 'http://localhost:3000/api'
import url from '../api/api.js'
import { AuthContext } from '../Context/AuthContext.jsx';

const SubmissionData = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [checkedSubmissions, setCheckedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const { auth } = useContext(AuthContext)
  // console.log(currentSubmission.files?.length);


  const fetchSubmissions = async () => {
    let id = auth.student.userData.id;
    // let id = JSON.parse(localStorage.getItem('user')).userData.id;

    try {
      const response = await axios.get(`${url}/tasksubmit/mysubmissions/${id}`);
      setPendingSubmissions(response.data.pending || []);
      setCheckedSubmissions(response.data.checked || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleCardClick = (submission) => {
    setCurrentSubmission(submission);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading submissions...">
          <Alert message="Please wait while we fetch the data" type="info" />
        </Spin>
      </div>
    );
  }

  return (
    <>

      <Nav />
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>

        <br /><br /><br /><br />
        <Button onClick={fetchSubmissions}>Refresh</Button>
        <Title level={3} style={{ color: '#1890ff' }}>Pending Submissions</Title>
        {pendingSubmissions.length > 0 ? (
          <Row gutter={[16, 16]}>
            {pendingSubmissions.map(submission => (
              <Col key={submission._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{
                    marginBottom: 16,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: "14px 14px 34px 34px",
                    backgroundColor: '#fff',
                  }}
                  cover={<img alt="example" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608" />}
                  onClick={() => handleCardClick(submission)}
                >
                  <div style={{ height: 150 }}>
                    <Title level={4} style={{ marginBottom: 0 }}>Class: {submission.class_name || ''}</Title>
                    <p style={{ marginTop: 8 }}><strong>Assigment :</strong> {submission.task_name || ''}</p>
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

        <Title level={3} style={{ color: '#1890ff' }}>Checked Submissions</Title>
        {checkedSubmissions.length > 0 ? (
          <Row gutter={[16, 16]}>
            {checkedSubmissions.map(submission => (
              <Col key={submission._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{
                    marginBottom: 16,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: "14px 14px 34px 34px",
                    backgroundColor: '#fff',
                  }}
                  cover={<img alt="example" src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/free-google-classroom-banner-template-design-df5e76bfa478908057fd215227e2c284_screen.jpg?ts=1614075608" />}
                  onClick={() => handleCardClick(submission)}
                >
                  <div style={{ height: 150 }}>
                    <Title level={4} style={{ marginBottom: 0 }}>Class: {submission.class_name || ''}</Title>
                    <p style={{ marginTop: 8 }}><strong>Assigment :</strong> {submission.task_name || ''}</p>
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
              <p><strong>Assigment :</strong> {currentSubmission.task_name}</p>
              <p><strong>Points:</strong> {`${currentSubmission.point} / ${currentSubmission.total_points}`}</p>
              {currentSubmission.img && (
                <>


                  <img src={currentSubmission.img} alt="Submission Image" style={{ marginTop: '16px', maxWidth: '100%' }} />
                  <center>
                    <h3>Teacher review</h3>
                  </center>

                  <p>{currentSubmission.message} </p>
                </>

              )}
              {currentSubmission.files?.length > 0 && (
                <>

                  <p style={{ marginTop: '16px' }}><strong>My Code : </strong>
                    <Link target='blank' to={`/student/mycode/${currentSubmission.task_id}/${currentSubmission.student_id}`} > Click to run  Code <FaExternalLinkSquareAlt /></Link>

                  </p>
                  <center>
                    <h3>Teacher review</h3>
                  </center>

                  <p>{currentSubmission.message} </p>
                </>
              )}
              {currentSubmission.url && (
                <>


                  <p style={{ marginTop: '16px' }}><strong>Submission URL:</strong> <a href={currentSubmission.url} target="_blank" rel="noopener noreferrer">{currentSubmission.url}</a></p>
                  <center>
                    <h3>Teacher review</h3>
                  </center>

                  <p>{currentSubmission.message} </p>
                </>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>

  );
};

export default SubmissionData;
