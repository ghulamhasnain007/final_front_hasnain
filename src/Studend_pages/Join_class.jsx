import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Typography, Avatar, Card, message, Tooltip, Empty } from 'antd';
import { Link } from 'react-router-dom';
import Student_nav from '../Student_comp/Student_nav';
import student from '../token/student.js'
import axios from 'axios';
import url from '../api/api.js'
// let url = 'http://localhost:3000/api'
const { Title } = Typography;
const { Meta } = Card;

const Join_class = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [classDetails, setClassDetails] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  let joininguserdata = async (class_id, student_id) => {
    // console.log(class_id, student_id)
    try {
      const response = await student.post('/classjoininguser', { class_id, student_id })
        .then((res) => {
          // message.success(res.data.message)
        })
      //   .catch((error) =>
      //     //  message.error(error.response.data.message)
      // )
    } catch (error) {
      console.error('Error save data :', error)
    }
  }


  let chart = async (teacherId) => {
    let totalStudents = 1
    let totalTasks = 0
    let totalClasses = 0
    let totalquiz =  0
    await student.post('/tchart/teacher', { totalStudents, totalTasks, totalClasses, teacherId , totalquiz })
      .then((res) => {
        // console.log(res);
      }).catch((err) => {
        // console.log(err)
      })
  }

  let studentcard = (classid) =>{
    const userid = JSON.parse(localStorage.getItem('user')).userData.id
      // console.log(userid.userData.id);
    try {
      axios.post(`${url}/point/student/${userid}`, {
        total_class : 1,
        class_id : classid
        
      })
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          // console.log(err);
        });
    } catch (error) {
      console.error('Error in adminchart:', error);
    }
   }


  //  const adminchart = async () => {
  //   try {
  //     await axios.post(`${url}/adminuser/chartdetail`, {
  //       Total_Students: 0,
  //       Total_Tasks: 0,
  //       Total_Classes: 1,
  //       Total_submissions: 0,
  //       Total_teacher: 0
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleOk = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let userId = user.userData.id
      const response = await student.post('/joinclass', { classCode, userId })
        .then((res) => {
          message.success(res.data.message)
          setIsModalOpen(false);
          getClassData()
          //  console.log(res.data.class.teacher_id)
          joininguserdata(res.data.class._id, userId)
          chart(res.data.class.teacher_id)
          studentcard(res.data.class._id)
          // adminchart()
        })
        .catch((error) => message.error(error.response.data.message))
    } catch (error) {
      console.error('Error joining class:', error);
      message.error('Failed to join class.');
    }

    getClassData()
    setIsModalOpen(false);

  };



  const getClassData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      let userId = user.userData.id
      const response = await student.get(`/joinclass/${userId}`);
      setClassDetails(response.data)
      // console.log(response.data);
    } catch (error) {
      console.error('Error joining class:', error);
      // message.error('Failed to join class.');
    }
  };

  useEffect(() => {
    getClassData()
  }, [])
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (e) => {
    setClassCode(e.target.value);
  };


  return (
    <div>
      <Student_nav />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <center>
        <Button type="primary" style={{borderRadius: "30px 5px 30px 1px"}} onClick={showModal}>
        Join the class
      </Button>
      </center>
      
      <Modal title="Max Length of code(8)" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Title level={5}>Enter Class Code</Title>
        <Input value={classCode} onChange={onChange} maxLength={8} size="small" />
      </Modal>

      <br />
      <br />
      {classDetails.length > 0 ?
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',borderRadius: "49px 11px 49px 11px" }}>
          {classDetails.map((item, index) => (
            <Tooltip title='Click to see your tasks' key={index}>
              <div style={{ margin: '16px', textAlign: 'center' }}>
                <Link to={`/student/join/${item._id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    style={{ width: 300 ,borderRadius: "49px 11px 49px 11px"}}
                    hoverable
                    cover={<img style={{ width: 300, height: 130 }} alt="example" src={item.theme ? item.theme : 'https://marketplace.canva.com/EAFvgRUWZ0g/1/0/1600w/canva-white-and-green-illustrative-welcome-to-our-classroom-banner-4WcagvYF4Jk.jpg'  } />}
                  >
                    <Meta
                      avatar={<Avatar src={item.teacher_profile ? item.teacher_profile : 'https://api.dicebear.com/7.x/miniavs/svg?seed=8'} />}
                      title={`Class_name : ${item.className ? item.className : ''}`}
                      description={(
                        <>
                          <p>Teacher Name: {item.teacher_name ? item.teacher_name : ''}</p>
                          {/* <p>Total Assignments: {item.totalAssignments}</p> */}
                        </>
                      )}
                    />
                  </Card>
                </Link>
              </div>
            </Tooltip>
          ))}
        </div>
        : <Empty description="No class join" />}
    </div>
  );
};

export default Join_class;
