import React, { useEffect, useState } from 'react';
import { Layout, Menu, Space, Dropdown, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { SiGoogleclassroom } from "react-icons/si";
import { MdQuiz } from "react-icons/md";
import axios from 'axios';
import url from '../api/api.js'
import Tnoti from './Tnoti.jsx'
// let url = 'http://localhost:3000/api';

const { Header } = Layout;

const Navi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState('');

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    // console.log('Logout clicked');
    navigate('/');
  };

  const menuItems = [
    {
      key: '1',
      icon: <CgProfile />,
      label: <Link to="/teacher/profile">Profile</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      icon: <CiLogout />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('user')).userData.id;
    const getUserData = () => {
      axios.get(`${url}/users/${id}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getUserData();
  }, []);

  const menuItemsNav = [
    {
      key: '/teacher/dashboard',
      icon: <UserOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/teacher/createclasswork',
      icon: <SiGoogleclassroom />,
      label: 'Create a Class',
    },
    {
      key: '/teacher/quiz',
      icon: <MdQuiz />,
      label: 'Create Quiz',
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '5px 5px 20px 20px',
          marginTop: 3,
          padding: '0 24px',
        }}
      >
        <div className="demo-logo" />

        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['/teacher/dashboard']}
          style={{
            flex: 1,
            minWidth: 0,
          }}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={menuItemsNav}
        />
        
       <Tnoti />
        
        <Dropdown menu={{ items: menuItems }}>
          <div className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Space style={{ color: 'white' }}>
              <Avatar style={{ marginBottom: 6 }} src={data.profileurl ? data.profileurl : 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-5283577-4413139.png'} />
              Hello  {data.username ? data.username : ''}
              <DownOutlined />
            </Space>
          </div>
        </Dropdown>
      </Header>
    </Layout>
  );
};

export default Navi;
