import React, { useEffect, useState } from 'react';
import { Card, List, Modal, Image, Input, Button, InputNumber, Tooltip, Spin, Row, Col, message ,Avatar} from 'antd';
import Tnavi from '../Teachercomp/Tnavi';
import { FaRobot } from "react-icons/fa";
import axios from 'axios';
import { TbExternalLink } from "react-icons/tb";
import { RxReload } from "react-icons/rx";
import { Link, useParams } from 'react-router-dom';
import teacher from '../token/teacher.js';
import Loader3D from '../loader/Loader.jsx';
let url = 'http://localhost:3000/api'
import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [scaleStep, setScaleStep] = useState(0.5);
  const [copySuccess, setCopySuccess] = useState(false);
  const [data, setData] = useState([]);
  const [pending, setPending] = useState([]);
  const [checked, setChecked] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [ins, setIns] = useState({});
  const [loading, setLoading] = useState(true);
  // AI checked state 
  const [pendingText, setPendingText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const { taskId } = useParams();
  const [ailoader, setailoader] = useState(false)
  const [messagee, setmessage] = useState('')
  const [textmessage, settextMessage] = useState(false);

  const handleCheckByAI = async () => {
    setailoader(true); // Start AI loader

    try {
      let fullPrompt = prompt;

      // Create an array of objects with _id and code for all pending assignments' files
      const assignments = pending?.flatMap(sub =>
        sub.files?.map(file => ({
          _id: sub._id,
          code: file.code
        })) || []
      ) || [];
      console.log(' Data:', assignments);
      // Sending request with prompt and assignments
      const res = await axios.post(`${url}/ai/check-assignments`, { prompt: fullPrompt, assignments });

      console.log('AI Response Data:', res.data);
      setPrompt('')
      // Assuming res.data is an array of objects with { _id, point, message }
      if (Array.isArray(res.data)) {
        const updatedAssignments = pending.map(assignment => {
          const result = res.data.find(r => r._id === assignment._id);
          return {
            ...assignment,
            point: result ? Number(result.point) : 0, // Convert point to number
            message: result ? result.message : '' // Handle messages if present
          };
        });

        console.log('Updated Assignments:', res.data);

        setResults(res.data);
        await updateScoresInMongoDB(res.data);
      } else {
        console.error('Unexpected response format:', res.data);
        message.error('Unexpected response format from AI check.');
      }
    } catch (error) {
      console.error('Error checking code:', error);
      message.error('Failed to check code. Please try again.');
    } finally {
      setailoader(false); // Stop AI loader
    }
  };

  const updateScoresInMongoDB = async (data) => {
    try {
      const res = await axios.post(`${url}/ai/update-scores`, { assignments: data });
      console.log('Updated in MongoDB:', res.data);
      getSubmissions(); // Refresh submissions list
      setailoader(false);
      setPrompt('')
      message.success('Code checked successfully');
    } catch (error) {
      console.error('Error updating in MongoDB:', error);
      message.error('Failed to update scores. Please try again.');
      setailoader(false);
    }
  };















  const handleCardClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    settextMessage(false)
    // setSelectedItem('');
    setIsModalOpen(false);
    setPreviewVisible(false);
    setCopySuccess(false);
  };



  const handleShowImagePreview = () => {
    setPreviewVisible(true);
  };

  const handlePointChange = (value) => {
    console.log(value);
    setSelectedItem(prev => ({ ...prev, point: value }));
  };

  let studentcard = (item) => {
    try {
      axios.post(`${url}/point/student/${item.updatedDoc.student_id}`, {
        total_point: item.updatedDoc.point || 0,
        class_id: item.updatedDoc.class_id

      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error('Error in adminchart:', error);
    }
  }



  const handleAddPoint = () => {
    console.log(selectedItem._id, selectedItem.point)

    axios.put(`${url}/createtask/point/${selectedItem._id}`, { point: selectedItem.point, message: messagee ? messagee : selectedItem.message })

      .then(response => {
        message.success('Point updated successfully');
        getSubmissions();
        setIsModalOpen(false);
        console.log(response.data);
        studentcard(response.data)
        // Update the data to reflect the changes
        setData(prevData => prevData.map(item => item._id === selectedItem._id ? { ...item, point: selectedItem.point } : item));
      })
      .catch(error => {
        console.log('Error updating point:', error);
        // message.error('Failed to update point');
      });
  };


  const getInstruction = () => {
    axios.get(`${url}/createtask/submittask/${taskId}`)
      .then((res) => {
        setIns(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSubmissions = () => {
    axios.get(`${url}/tasksubmit/submissions/${taskId}`)
      .then((res) => {
        const submissions = Array.isArray(res.data.submissions) ? res.data.submissions : [];
        setData(submissions);
        setPending(res.data.pending);
        setChecked(res.data.checked);
        setLoading(false);
        console.log(submissions);
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

  return (
    <>
      <Tnavi /><br /><br /><br /><br /><br />
      <div style={{ padding: '20px', backgroundColor: '#f0f2f5', borderRadius: "45px 10px 52px 24px" }}>
        <center>
          {/* <Input
          
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Check by AI'
            style={{
              width: 400,
              marginBottom: '10px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          /> */}

          <TextArea value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Write a prompt to check assigment"s'
            style={{
              width: 400,
              marginBottom: '10px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }} autoSize />
          <Button
            style={{ marginLeft: 10, borderRadius: '8px', marginBottom: 10 }}
            type="primary"
            onClick={handleCheckByAI}
            disabled={pending.length === 0 ? true : false}
          >
            Check by AI <FaRobot />
          </Button>
          {ailoader && <Loader3D />}


        </center>

        <Row justify="space-between" align="middle" style={{ padding: '0 20px', marginTop: '20px' }}>
          <Col>
            <h3>Task Instruction: {ins.instructions}</h3>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={getSubmissions}
              style={{ borderRadius: '8px' }}
            >
              Reload <RxReload />
            </Button>
          </Col>
        </Row>

        <div style={{ marginLeft: 20, marginTop: 20 }}>
          <h4><strong>Total Submissions: {data.length}</strong></h4>
          <h4><strong>Total Submissions Checked: {checked.length}</strong></h4>
          <h4><strong>Total Submissions Pending: {pending.length}</strong></h4>
          <h4><strong>Total Points: {ins.points ? ins.points : 'Not set'}</strong></h4>
        </div>

        <br />

        {loading ? (
          <center>
            <Spin size="large" style={{ marginTop: '20px' }} />
          </center>
        ) : (
          <>
            {pending.length > 0 && (
              <>
                <center>
                  <h3>Pending Submissions</h3>
                </center>
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
                  dataSource={pending}
                  renderItem={(item) => (
                    <List.Item key={item._id}>
                      <Card
                        title={item.student_name}
                        onClick={() => handleCardClick(item)}
                        hoverable
                        style={{
                          cursor: 'pointer',
                          borderRadius: "45px 10px 52px 24px",
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {`Sub Date: ${item.created_at ? item.created_at.slice(0, 10) : 'N/A'}`}
                        <hr />
                        <p>
                          <ClockCircleOutlined style={{ color: '#faad14' }} /> Pending
                        </p>
                      </Card>
                    </List.Item>
                  )}
                />
              </>
            )}

            <center>
              <h3>Checked Submissions</h3>
            </center>
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
              dataSource={checked}
              renderItem={(item) => (
                <List.Item key={item._id}>
                  <Card
                    title={item.student_name}
                    onClick={() => handleCardClick(item)}
                    hoverable
                    style={{
                      cursor: 'pointer',
                      borderRadius: "45px 10px 52px 24px",
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    {`Sub Date: ${item.created_at ? item.created_at.slice(0, 10) : 'N/A'}`}
                    <hr />
                    <p style={{ color: 'blueviolet' }}>Points: {item.point} / {item.total_points}</p>
                    <p>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} /> Checked
                    </p>
                  </Card>
                </List.Item>
              )}
            />
          </>
        )}

        <Modal
          title={`Student Name: ${selectedItem.student_name ? selectedItem.student_name : ''}`  }
          open={isModalOpen}
          onCancel={handleModalClose}
          footer={null}
          centered
          style={{ borderRadius: '8px', borderRadius: "45px 10px 52px 24px" }}
        >
          <div>
            <center>
              {selectedItem.url && (
                <div>
                  {/* <p>Here's the URL:</p> */}
                  <Tooltip title={selectedItem.url}>
                    <a href={selectedItem.url} target="_blank" rel="noopener noreferrer">Click to see URL <TbExternalLink /> </a>
                  </Tooltip>
                </div>
              )}
              {selectedItem.img && (
                <>
                  <br />
                  <Button type="primary" onClick={handleShowImagePreview} style={{ borderRadius: '8px' }}>
                    Show Image Preview
                  </Button>
                </>
              )}
            </center>
            <Image
              width={200}
              style={{ display: previewVisible ? 'block' : 'none', marginTop: '10px' }}
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
            {selectedItem.files?.length > 0 && (
              <div>
                <center>
                  <Tooltip title={'click to see code '}>
                    <Link target='blank' to={`/teacher/code/${selectedItem.task_id}/${selectedItem.student_id}`}>Click to see code <TbExternalLink /> </Link>
                  </Tooltip>
                </center>
              </div>
            )}

            <br /> <br />


          </div>


          <div>
            <h4 style={{ color: '#4caf50' }}>Write Review</h4>
            {textmessage ?
              <>


                <TextArea defaultValue={selectedItem.message} onChange={(e) => setmessage(e.target.value)}
                  placeholder='Write message' onClick={() => settextMessage(true)} rows={7} />
              </> : <> <TextArea value={selectedItem.message} onChange={(e) => setmessage(e.target.value)}
                placeholder='Write message' onClick={() => settextMessage(true)} rows={7} />  </>}
          </div>

          <br />
          <div style={{ textAlign: 'center' }}>



            <InputNumber
              max={selectedItem.total_points}
              value={selectedItem.point || 0}
              onChange={handlePointChange}
            // style={{ marginRight: '10px' }}
            /> / {selectedItem.total_points}


            <br /><br />
            <Button onClick={handleAddPoint} style={{ borderRadius: '8px', width: 200 }}>
              Add Point
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );

};

export default App
