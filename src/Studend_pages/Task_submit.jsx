import React, { useEffect, useState } from 'react';
import { Card, Upload, Button, Input, Image, message, Alert } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { PiBracketsCurlyLight } from "react-icons/pi";
import Student_nav from '../Student_comp/Student_nav';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import student from '../token/student.js'
const { TextArea } = Input;

const TaskSubmission = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [url, setUrl] = useState('');
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmissionClosed, setIsSubmissionClosed] = useState(false);
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

  useEffect(() => {
    const userid = JSON.parse(localStorage.getItem('user'));
    console.log(userid.userData.id);
  }, []);

  const adminchart = () => {
    try {
      axios.post('http://localhost:3000/api/adminuser/chartdetail', {
        Total_Students: 0,
        Total_Tasks: 0,
        Total_Classes: 0,
        Total_submissions: 1,
        Total_teacher: 0
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
    setLoading(true);
    try {
      const response = await student.post('/tasksubmit', formData);
      message.success(response.data.message);
      // Clear form fields after submission
      setText('');
      setImagePreview(null);
      setImgFile(null);
      setUrl('');
      adminchart();
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getTask = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/createtask/task/${id}`);
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
    }
  };

  useEffect(() => {
    getTask();
  }, [id]);

  return (
    <div>
      <Student_nav /> <br /><br /><br /><br />
      <div style={{ padding: '20px' }}> <br />
        {isSubmissionClosed && (
          <Alert
            message="Task Submission Closed"
            description={`Task: ${task.title} - Created Date: ${task.created_at?.slice(0, 10) || 'N/A'}`}
            type="error"
            showIcon
          />
        )} <br />
        <Card title={`Teacher name: ${task.teacher_name}`}>
          <Card type="inner" title={`Last date of assignment: ${task.last_date?.slice(0, 10) || 'N/A'}`}>
            <h3>Task Instructions</h3>
            <p>{task.instructions}</p>
            <Upload
              beforeUpload={handleBeforeUpload}
              fileList={imagePreview ? [{ url: imagePreview }] : []}
              maxCount={1}
              onRemove={handleDeleteImage}
              disabled={isSubmissionClosed}
            >
              <Button icon={<UploadOutlined />} disabled={isSubmissionClosed}>Upload Image</Button>
            </Upload>
            {imagePreview && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <Image width={200} src={imagePreview} />
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteImage}
                  style={{ marginTop: '5px' }}
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
                style={{ width: 300 }}
                size="large"
                placeholder="Paste URL"
                prefix={<PiBracketsCurlyLight />}
                disabled={isSubmissionClosed}
              /><br /><br />
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                disabled={loading || isSubmissionClosed}
              >
                {loading ? 'Submitting...' : 'Submit the Assignment'}
              </Button>
            </center>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default TaskSubmission;
