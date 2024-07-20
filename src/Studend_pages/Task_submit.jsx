import React, { useEffect, useState } from 'react';
import { Card, Upload, Button, Input, Image, message, Alert, Spin } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { PiBracketsCurlyLight } from "react-icons/pi";
import Student_nav from '../Student_comp/Student_nav';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import student from '../token/student.js';
let url = 'http://localhost:3000/api'
const { TextArea } = Input;

const TaskSubmission = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [url, setUrl] = useState('');
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmissionClosed, setIsSubmissionClosed] = useState(false);
  const [isLoadingTask, setIsLoadingTask] = useState(true); // Loader for task fetching
  const { id, classid } = useParams();

  const handleBeforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    setImgFile(file);
    return false;
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setImgFile(null);
  };

  const studentCard = async (item) => {
    try {
      // const userid = JSON.parse(localStorage.getItem('user')).userData.id;
      await axios.post(`${url}/point/student/${item.student_id}`, {
        submission: 1,
        class_id: item.class_id,
      });
    } catch (error) {
      console.error('Error in studentCard:', error);
    }
  };

  const handleSubmit = async () => {
    const userid = JSON.parse(localStorage.getItem('user'));
    const formData = new FormData();
    formData.append('text', text);
    formData.append('file', imgFile);
    formData.append('task_id', id);
    formData.append('url', url);
    formData.append('class_id', classid);
    formData.append('student_id', userid.userData.id);
    formData.append('student_name', userid.userData.username);
    formData.append('total_points', task.points);
    formData.append('class_name', task.class_name);
    formData.append('task_name', task.title);
    setLoading(true);

    try {
      const response = await student.post('/tasksubmit', formData);
      if (response && response.data) {
        message.success(response.data.message);
        setText('');
        setImagePreview(null);
        setImgFile(null);
        setUrl('');
        if (response.data.message == 'Submission sent successfully') {
          studentCard(response.data.file)
        }
        
      } else {
        message.error('Unexpected response from server');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error('An error occurred while submitting the task');
      }
    } finally {
      setLoading(false);
    }
  };

  const getTask = async () => {
    setIsLoadingTask(true);
    try {
      const response = await axios.get(`${url}/createtask/task/${id}`);
      if (response.data.length > 0) {
        const taskData = response.data[0];
        setTask(taskData);
        const currentDate = new Date();
        const lastDate = new Date(taskData.last_date);
        if (currentDate > lastDate) {
          setIsSubmissionClosed(true);
          message.error(`Task Submission Closed: ${taskData.title} - Created Date: ${taskData.created_at?.slice(0, 10) || 'N/A'}`);
        }
      } else {
        setTask({});
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      message.error('Failed to fetch task details.');
    } finally {
      setIsLoadingTask(false);
    }
  };

  useEffect(() => {
    getTask();
  }, [id]);

  return (
    <>
      <Student_nav /> 
      <br /><br /><br />
      <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
        <div style={{ margin: '20px auto', maxWidth: '800px' }}>
          {isLoadingTask ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {isSubmissionClosed && (
                <Alert
                  message="Task Submission Closed"
                  description={`Task: ${task.title} - Created Date: ${task.created_at?.slice(0, 10) || 'N/A'}`}
                  type="error"
                  showIcon
                  style={{ marginBottom: '20px' }}
                />
              )}
              <Card 
                title={`Teacher Name: ${task.teacher_name}`} 
                style={{ borderRadius: "13px 31px 50px 12px", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff' }}
              >
                <Card 
                  type="inner" 
                  title={`Last Date of Assignment: ${task.last_date?.slice(0, 10) || 'N/A'}`} 
                  style={{ borderRadius: "13px 31px 50px 12px", marginBottom: '20px' }}
                >
                  <h3 style={{ color: '#1890ff' }}>Task Instructions</h3>
                  <p>{task.instructions}</p>
                  <Upload
                    beforeUpload={handleBeforeUpload}
                    fileList={imagePreview ? [{ url: imagePreview }] : []}
                    maxCount={1}
                    onRemove={handleDeleteImage}
                    disabled={isSubmissionClosed}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      disabled={isSubmissionClosed}
                      style={{ backgroundColor: '#1890ff', color: '#fff', borderColor: '#1890ff' }}
                    >
                      Upload Image
                    </Button>
                  </Upload>
                  {imagePreview && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <Image width={200} src={imagePreview} />
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={handleDeleteImage}
                        style={{ marginTop: '5px', color: '#ff4d4f' }}
                      >
                        Delete Image
                      </Button>
                    </div>
                  )}
                  <TextArea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your text here (max 200 characters)"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    maxLength={200}
                    style={{ marginTop: '10px' }}
                    disabled={isSubmissionClosed}
                  />
                  <p style={{ textAlign: 'right', fontSize: '12px', color: 'rgba(0,0,0,0.45)' }}>
                    {text.length}/200 characters
                  </p>
                  <center>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      style={{ width: '100%', maxWidth: '600px', marginTop: '10px' }}
                      size="large"
                      placeholder="Paste URL"
                      prefix={<PiBracketsCurlyLight />}
                      disabled={isSubmissionClosed}
                    />
                    <br /><br />
                    <Button
                      type="primary"
                      loading={loading}
                      onClick={handleSubmit}
                      disabled={loading || isSubmissionClosed}
                      style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                    >
                      {loading ? 'Submitting...' : 'Submit the Assignment'}
                    </Button>
                  </center>
                </Card>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskSubmission;
