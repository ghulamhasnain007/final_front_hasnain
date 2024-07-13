import React, { useEffect, useState } from 'react';
import { Card, List, Modal, Image, Input, Button, message, InputNumber, Tooltip, Spin, Row, Col } from 'antd';
import Tnavi from '../Teachercomp/Tnavi';
import { FaRobot } from "react-icons/fa";
import axios from 'axios';
import { RxReload } from "react-icons/rx";
import { useParams } from 'react-router-dom';
import teacher from '../token/teacher.js'
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);
  const [copySuccess, setCopySuccess] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [ins, setIns] = useState({});
  const [loading, setLoading] = useState(true);
  const { taskId } = useParams();

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPreviewVisible(false);
    setCopySuccess(false);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(selectedItem.text || '')
      .then(() => {
        setCopySuccess(true);
        message.success('Text copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy text', error);
        message.error('Failed to copy text');
      });
  };

  const handleShowImagePreview = () => {
    setPreviewVisible(true);
  };

  const handlePointChange = (value) => {
    setSelectedItem(prev => ({ ...prev, point: value }));
  };

  const handleAddPoint = () => {
    teacher.put(`/createtask/point/${selectedItem._id}`, { point: selectedItem.point })
      .then(response => {
        message.success('Point updated successfully');
        getSubmissions();
        setIsModalOpen(false);
        // Update the data to reflect the changes
        setData(prevData => prevData.map(item => item._id === selectedItem._id ? { ...item, point: selectedItem.point } : item));
      })
      .catch(error => {
        console.error('Error updating point:', error);
        message.error('Failed to update point');
      });
  };

  const getInstruction = () => {
    axios.get(`http://localhost:3000/api/createtask/submittask/${taskId}`)
      .then((res) => {
        setIns(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSubmissions = () => {
    axios.get(`http://localhost:3000/api/tasksubmit/submissions/${taskId}`)
      .then((res) => {
        const submissions = Array.isArray(res.data.submissions) ? res.data.submissions : [];
        setData(submissions);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSubmissions();
    getInstruction();
  }, [taskId]);

  const totalChecked = data.reduce((count, item) => item.point !== undefined ? count + 1 : count, 0);
  const totalPending = data.reduce((count, item) => item.point === undefined || item.point === 0 ? count + 1 : count, 0);

  return (
    <>
      <Tnavi />
      <br /><br /><br /><br /><br /><br />

      <center>
        <Input placeholder='Check by AI' style={{ width: 400 }} />
        <Button style={{ marginLeft: 10 }} type="primary">Check by AI <FaRobot /> </Button>
        <br /><br />
      </center>
      <Row justify="space-between" align="middle" style={{ padding: '0 10px' }}>
        <Col>
          <h3>Task instruction : {ins.instructions}</h3>
        </Col>
        <Col>
          <Button type="primary" onClick={getSubmissions}>Reload <RxReload /> </Button>
        </Col>
      </Row>
      <br />
      <h4 style={{ marginLeft: 10 }}><strong>Total Submissions: {data.length}</strong></h4>
      <h4 style={{ marginLeft: 10 }}><strong>Total Submissions checked: {totalChecked}</strong></h4>
      <h4 style={{ marginLeft: 10 }}><strong>Total Submissions pending: {totalPending}</strong></h4>
      <br />
      <center>
        <h3>All Submission's</h3>
      </center>
      {loading ? (
        <center>
          <Spin size="large" />
        </center>
      ) : (
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item._id}>
              <Card
                title={item.student_name}
                onClick={() => handleCardClick(item)}
                hoverable
                style={{ cursor: 'pointer' }}
              >
                {`Submit Date : ${item.created_at ? item.created_at.slice(0, 10) : 'N/A'}`}
                <hr />
                {!item.point ? <p style={{ color: 'red' }}>Task pending</p> : <p style={{ color: 'blueviolet' }}> Point {item.point}</p>}
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={` Student name : ${selectedItem.student_name ? selectedItem.student_name : ''}`}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        centered
      >
        <div>
          <center>
            {selectedItem.url &&
              <div>
                <p>Here's the URL:</p>
                <Tooltip title={selectedItem.url}>
                  <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">Click to see url</a>
                </Tooltip>
              </div>
            }
            {selectedItem.img &&
              <>
                <br />
                <Button type="primary" onClick={handleShowImagePreview}>
                  Show Image Preview
                </Button>
              </>
            }
          </center>
          <Image
            width={200}
            style={{ display: previewVisible ? 'block' : 'none' }}
            src={selectedItem.img}
            preview={{
              visible: previewVisible,
              scaleStep,
              src: selectedItem.img,
              onVisibleChange: (value) => {
                setPreviewVisible(value);
              },
            }}
          />
          {selectedItem.text &&
            <>
              <br /><br />
              <Input.TextArea value={selectedItem.text} autoSize={{ minRows: 3, maxRows: 6 }} disabled />
            </>
          }
          <br /><br />
          <Button onClick={handleCopyText}>
            Copy Text
          </Button>
          {copySuccess && <span style={{ color: 'green', marginLeft: '10px' }}>Copied!</span>}
          <br /><br />
        </div>
        <div style={{ textAlign: 'center' }}>
          <InputNumber min={1} max={10} value={selectedItem.point || 1} onChange={handlePointChange} />
          <br /><br />
          <Button onClick={handleAddPoint}>Add Point</Button>
        </div>
      </Modal>
    </>
  );
};

export default App;
