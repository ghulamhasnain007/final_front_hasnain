import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import axios from 'axios';
import teacher from '../token/teacher.js'

const DashboardPage = () => {
  const [data,setdata] = useState('')
  // Mock data for total counts
  const totalstudent = data.totalstudent ?  data.totalstudent : '0'
  const totalClasses = data.totalclass ?  data.totalclass :  '0'
  const totalQuizzes = 150; 
  const totalTasks = data.totaltask ?   data.totaltask :  '0'

  
  let get = () =>{
    const teacher_id = JSON.parse(localStorage.getItem('techerdata')).userData.id
    teacher.get(`/joinclass/get/${teacher_id}`)
    .then((res)=>{
      console.log(res.data)
      setdata(res.data)
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  useEffect(()=>{

    get()
  },[])
  return (
    <><br /><br /><br /><br /> <br />
      <div style={{ background: '#ECECEC', padding: '30px' , borderRadius : 20 }}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={totalstudent}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Class Created "
                value={totalClasses}
                valueStyle={{ color: '#096dd9' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Quizzes"
                value={totalQuizzes}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Tasks Created "
                value={totalTasks}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardPage;
