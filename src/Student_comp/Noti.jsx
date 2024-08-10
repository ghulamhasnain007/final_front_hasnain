import React, { useContext, useEffect, useState } from 'react';
import { Dropdown, Menu, Avatar, Badge, Space } from 'antd';
import { BellTwoTone } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import url from '../api/api.js';
import { AuthContext } from '../Context/AuthContext.jsx';

const MessageDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { auth } = useContext(AuthContext)

  useEffect(() => {
    // Fetch notifications on component mount
    const fetchNotifications = async () => {
      const id = auth.student?.userData?.id; 
      // const id = JSON.parse(localStorage.getItem('user'))?.userData?.id; 
      try {
        const response = await axios.get(`${url}/noti/${id}`);
        const data = response.data;
        
        // console.log('API Response:', data.count); // Log API response for debugging
        
        // Ensure data.tasks is an array and data.countResult is defined
        setNotifications(Array.isArray(data.tasks) ? data.tasks : []);
        setUnreadCount(data.count);
        // console.log(unreadCount)
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [url]);

  const handleMarkAsRead = async () => {
    const id = auth.student?.userData?.id;
    // const id = JSON.parse(localStorage.getItem('user'))?.userData?.id;
    try {
      await axios.put(`${url}/noti/${id}`, { status: 'read' });
      // Update state or refetch notifications
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
      setUnreadCount(0); // Assuming all notifications are marked as read
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  const items = notifications.map((notification) => ({
    key: notification.id,
    label: (
      <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff', display: 'flex', alignItems: 'center', borderRadius: "39px 12px 74px 0px" }}>
        <Link to={`/student/join/${notification.class_id}`} >
          <Avatar src={notification.teacher_profile || 'https://via.placeholder.com/40'} style={{ backgroundColor: '#f56a00', color: '#fff' }} />
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
              {notification.teacher_name} posted a new assignment
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#595959' }}>
              Assignment name: {notification.title}
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#000' }}>
              Last Date: {notification.last_date.slice(0, 10)}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#1890ff' }}>
              {notification.points} points
            </p>
          </div>
        </Link>
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{
        items,
        style: { maxHeight: '300px', overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: "39px 12px 74px 0px" }
      }}
      trigger={['click']}
    >
      <Space>
        <Badge count={unreadCount} style={{ backgroundColor: '#52c41a', marginRight: '20px', marginTop: '23px' }}>
          <BellTwoTone
            style={{ fontSize: '24px', color: '#fff', cursor: 'pointer', marginRight: '20px', marginTop: '23px' }}
            onClick={unreadCount > 0 ? handleMarkAsRead : null} // Only call handleMarkAsRead if there are unread notifications
          />
        </Badge>
      </Space>
    </Dropdown>
  );
};

export default MessageDropdown;
