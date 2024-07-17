import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme, Space, Dropdown, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
const { Header, Content, Footer } = Layout;
import { UserOutlined, TeamOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons';
import { FaChalkboardTeacher } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { FaHandsClapping } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { TbMessageReport } from "react-icons/tb";
import { MdAssignment } from "react-icons/md";
import axios from 'axios';
const Student_nav = () => {
  const navigate = useNavigate()
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();


  const [visible, setVisible] = React.useState(false);
  const [data, setdata] = useState('')

  const handleClick = (e) => {
    console.log('click', e);
  };

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      // Handle logout logic here
      console.log('Logout clicked');
    } else {
      console.log('Clicked', e);
    }
  };

  const items = [
    {
      label: (
        <Link to="/student/profile">
          Profile
        </Link>
      ),
      key: '1',
      icon: <CgProfile />
    },
    {
      label: (
        <Link to="/admin/setting">
          Setting
        </Link>
      ),
      key: '2',
      icon: <SettingOutlined />,

    },
    {
      type: 'divider', // No need for quotes around 'divider'
    },
    {
      label: 'Logout',
      key: '3',
      icon: <CiLogout />
    },
  ];

  const menu = { items };
  useEffect(() => {
    let id = JSON.parse(localStorage.getItem('user')).userData.id
    let getuserdata = () =>{
      try {
        axios.get(`http://localhost:3000/api/users/${id}`)
        .then((res)=>{
          // console.log(res.data);
          setdata(res.data)
        })
        .catch((err)=>{
          console.log(err);
        })
      } catch (error) {
        console.log(error);
      }
    }

    getuserdata()

  }, [])


  return (
    <>

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


          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}
            style={{
              flex: 1,
              minWidth: 0,
            }}
            onClick={({ key }) => {
              navigate(key)
            }}

            items={[
              {
                key: '/student/dashboard',
                icon: <UserOutlined />,
                label: 'Dashboard',
                // Use Link for routing
                to: <Link to={'/student/dashboard'} />,
                // component: Card_Comp, // Optional: Pass component to render
              },
              {
                key: '/student/join',
                icon: <SiGoogleclassroom />,
                label: ' class Room',
                // Add to property for future use (optional)
                to: '/student/join', // Replace with your desired route path
              },{
                key: '/student/mysubmission',
                icon: <MdAssignment />,
                label: 'My submissions',
                // Add to property for future use (optional)
                to: '/student/mysubmission', // Replace with your desired route path
              },

            ]}

          >
          </Menu>

          <Dropdown menu={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <Space style={{ color: 'white' }} >
                <Avatar style={{ marginBottom: 6 }} src={data.profileurl ? data.profileurl : 'https://cdn3d.iconscout.com/3d/premium/thumb/profile-5283577-4413139.png'} /> Hello <FaHandsClapping />  {data.username ? data.username : ''}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>


        </Header>
        {/* <Content
        style={{
          padding: '0 48px',
        }}
      >
       
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </div>
      </Content> */}
        {/* <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer> */}

      </Layout>

    </>

  );
};
export default Student_nav;