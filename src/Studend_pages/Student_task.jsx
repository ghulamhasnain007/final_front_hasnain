import React, { useEffect, useState } from 'react';
import { Card, message, Empty, Alert } from 'antd';
import { Link, useParams } from 'react-router-dom';
import Student_nav from '../Student_comp/Student_nav';
import axios from 'axios';
const App = () => {
  const [data, setData] = useState([]);
  const [classData, setClassData] = useState('');
  const { classid } = useParams();

  const getTask = async () => {
    axios.get(`http://localhost:3000/api/createtask/${classid}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching task details:', error);
      });
  };

  const getClassDetails = () => {
    axios.get(`http://localhost:3000/api/creteclass/getclass/${classid}`)
      .then(response => {
        setClassData(response.data);
      })
      .catch(error => {
        console.error('Error fetching class details:', error);
      });
  };

  useEffect(() => {
    getTask();
    getClassDetails();
  }, [classid]);

  // Function to check if today's date is after the late date
  const isAfterLateDate = (lateDate) => {
    const today = new Date();
    const lateDateObj = new Date(lateDate);
    return today > lateDateObj;
  };

  // Function to check if one day is remaining for task submission
  const isOneDayRemaining = (lateDate) => {
    const today = new Date();
    const lateDateObj = new Date(lateDate);
    const timeDifference = lateDateObj - today;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return daysDifference <= 1 && daysDifference > 0;
  };

  return (
    <div>
      <Student_nav /> <br /><br /><br /><br /><br />
      {data.length > 0 ?
        <Card title={`Class name : ${classData.className}`}>
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
                />
              ) : (
                <>
                  {isOneDayRemaining(item.last_date) && (
                    <Alert
                      message={ `Hurry Up! Only 1 day left to submit the task : =>  ${item.title}` }
                      type="warning"
                    />
                  )} <br />
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
                    <Card hoverable type="inner" title={`${index + 1} : ${item.teacher_name} posted a new assignment: ${item.title}`}>
                      <p>Task Instructions: {item.instructions}</p>
                      <p>Task created date: {item.created_at?.slice(0, 10) || 'N/A'}</p>
                      <hr />
                      <p style={{ color: 'red' }}>{`_Last date to assign a task: ${item.last_date?.slice(0, 10) || 'N/A'}`}</p>
                    </Card>
                    <br />
                  </Link>
                </>
              )}
            </div>
          ))}
        </Card>
        : <Empty description='No Task available' />}
    </div>
  );
};

export default App;
