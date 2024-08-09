import React, { useEffect, useState } from 'react';
import { Card, message, Empty, Alert, Spin } from 'antd';
import { Link, useParams } from 'react-router-dom';
import Student_nav from '../Student_comp/Student_nav';
import axios from 'axios';
import url from '../api/api.js'
// let url = 'http://localhost:3000/api'
const App = () => {
  const [data, setData] = useState([]);
  const [classData, setClassData] = useState('');
  const [loading, setLoading] = useState(true); // State for loading
  const { classid } = useParams();

  const getTask = async () => {
    try {
      const response = await axios.get(`${url}/createtask/${classid}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching task details:', error);
      message.error('Failed to fetch task details.');
    }
  };

  const getClassDetails = async () => {
    try {
      const response = await axios.get(`${url}/creteclass/getclass/${classid}`);
      setClassData(response.data);
    } catch (error) {
      console.error('Error fetching class details:', error);
      message.error('Failed to fetch class details.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getTask(), getClassDetails()]);
      setLoading(false);
    };
    fetchData();
  }, [classid]);

  const isAfterLateDate = (lateDate) => {
    const today = new Date();
    const lateDateObj = new Date(lateDate);
    return today > lateDateObj;
  };

  const isOneDayRemaining = (lateDate) => {
    const today = new Date();
    const lateDateObj = new Date(lateDate);
    const timeDifference = lateDateObj - today;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference <= 1 && daysDifference > 0;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
    
    <Student_nav />
      <br /><br /><br /><br /><br />
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      
      {data.length > 0 ? (
        <Card title={`Class Name: ${classData.className}`} style={{ backgroundColor: '#fff',borderRadius: "6px 14px 66px 38px" }}>
          {data.map((item, index) => (
            <div key={index}>
              <br />
              {isAfterLateDate(item.last_date) ? (
                <Alert
                  message="Task Submission Closed"
                  description={
                    <>
                      <p>Task Name: {item.title}</p>
                      <p>Created Date: {item.created_at?.slice(0, 10) || 'N/A'}</p>
                      <p>Last Date: {item.last_date?.slice(0, 10) || 'N/A'}</p>
                    </>
                  }
                  type="error"
                  style={{ marginBottom: '16px',borderRadius: "15px 36px 48px 15px" }}
                />
              ) : (
                <>
                  {isOneDayRemaining(item.last_date) && (
                    <Alert
                      message={`Hurry Up! Only 1 day left to submit the task: ${item.title}`}
                      type="warning"
                      style={{ marginBottom: '16px' ,borderRadius: "15px 36px 48px 15px"}}
                    />
                  )}
                  <br />
                  <Link
                    to={`/student/join/${classid}/tasksubmit/${item._id}`}
                    style={{ textDecorationLine: 'none' }}
                    onClick={(e) => {
                      if (isAfterLateDate(item.last_date)) {
                        e.preventDefault();
                        message.error(`Task Submission Closed: ${item.title} - Created Date: ${item.created_at?.slice(0, 10) || 'N/A'}`);
                      }
                    }}
                  >
                    <Card
                      hoverable
                      style={{
                        marginBottom: '16px',
                       borderRadius: "15px 36px 48px 15px",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                      }}
                      title={`${index + 1} : ${item.teacher_name} posted a new assignment: ${item.title}`}
                    >
                      <p>Task Instructions: {item.instructions}</p>
                      <p>Task Created Date: {item.created_at?.slice(0, 10) || 'N/A'}</p>
                      <hr />
                      <p style={{ color: 'red' }}>{`Last Date to Submit: ${item.last_date?.slice(0, 10) || 'N/A'}`}</p>
                    </Card>
                  </Link>
                  <br />
                </>
              )}
            </div>
          ))}
        </Card>
      ) : (
        <Empty description="No Task Available" />
      )}
    </div>
</>

  );
};

export default App;
