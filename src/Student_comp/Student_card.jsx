import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import axios from 'axios';
import student from '../token/student.js'
const Dashboard = () => {
  const [data,setdata] = useState('')
  

  let totalClasses = async() =>{
    let user = JSON.parse(localStorage.getItem('user'))
    let id = user.userData.id
    await student.get(`/point/get/${id}`)
    .then((res)=>{
      // console.log(res.data);
      setdata(res.data)
    })
    .catch((err)=>{
      console.log(err);
    })
  }
  useEffect(()=>{
    totalClasses()
  },[])
  
  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title="Total Class join"
            bordered={false}
            style={{ backgroundColor: '#f56a00', color: '#fff' }}
          >
            <p style={{ fontSize: '24px' }}>{data.class_join ? data.class_join  : 0 }</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title="Total Submission"
            bordered={false}
            style={{ backgroundColor: '#7265e6', color: '#fff' }}
          >
            <p style={{ fontSize: '24px' }}>{data.submission ? data.submission : 0}</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title="Total  Points"
            bordered={false}
            style={{ backgroundColor: '#ffbf00', color: '#fff' }}
          >
            <p style={{ fontSize: '24px' }}>{data.total_point? data.total_point : 0 }</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card
            title="Total Quiz point"
            bordered={false}
            style={{ backgroundColor: '#00a854', color: '#fff' }}
          >
            <p style={{ fontSize: '24px' }}>{data.totalQuizScore ? data.totalQuizScore : 0  }</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
