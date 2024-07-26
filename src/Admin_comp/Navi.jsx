import React, { useState, useEffect } from 'react';
import { Layout, Menu, Space, Dropdown, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, TeamOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import { FaChalkboardTeacher } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { FaHandsClapping } from "react-icons/fa6";
import axios from 'axios';

const { Header } = Layout;

const Navi = () => {
  const navigate = useNavigate();
  const [data, setData] = useState('');

  const handleMenuClick = (e) => {
   
      localStorage.removeItem('admin');
      // console.log('Logout clicked');
      navigate('/');
    }
  

  const items = [
    {
      label: (
        <Link to="/admin/profile">
          Profile
        </Link>
      ),
      key: '1',
      icon: <CgProfile />
    },
    // {
    //   label: (
    //     <Link to="/admin/setting">
    //       Setting
    //     </Link>
    //   ),
    //   key: '2',
    //   icon: <SettingOutlined />
    // },
    {
      type: 'divider',
    },
    {
      label: 'Logout',
      key: '3',
      icon: <CiLogout  onClick={handleMenuClick}  />
    },
  ];

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem('admin')).userData.id;
    const getUserData = () => {
      axios.get(`http://localhost:3000/api/users/${id}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          // console.log(err);
        });
    };

    getUserData();
  }, []);

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1,
          width: '98%',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 20,
          marginTop: 20
        }}
      >
        <div className="demo-logo" />

        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['/admin/dashboard']}
          style={{
            flex: 1,
            minWidth: 0,
          }}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={[
            {
              key: '/admin/dashboard',
              icon: <UserOutlined />,
              label: 'Dashboard',
              to: '/admin/dashboard',
            },
            {
              key: '/admin/allstudent',
              icon: <TeamOutlined />,
              label: 'Manage Students',
              to: '/admin/allstudent',
            },
            {
              key: '/admin/mteacher',
              icon: <FaChalkboardTeacher />,
              label: 'Manage Teachers',
              to: '/admin/mteacher',
            },
          ]}
        />

        <Dropdown menu={{ items }} >
          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <Space style={{ color: 'white' }}>
              <Avatar style={{ marginBottom: 6 }} src={data.profileurl ? data.profileurl : 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-5283577-4413139.png'} /> Hello <FaHandsClapping /> {data.username ? data.username : ''}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </Layout>
  );
};

export default Navi;
