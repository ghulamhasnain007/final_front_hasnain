import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Avatar, Badge, Space } from 'antd';
import { BellOutlined  } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import url from '../api/api.js';

const MessageDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch notifications on component mount
    const fetchNotifications = async () => {
      const id = JSON.parse(localStorage.getItem('user'))?.userData?.id; 
      try {
        const response = await axios.get(`${url}/noti/get/${id}`);
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
    const userId = JSON.parse(localStorage.getItem('user'))?.userData?.id;
    
    if (!userId) {
        console.error('User ID is not available.');
        return;
    }

    try {
        // Send the request to mark notifications as read
        const response = await axios.put(`${url}/noti/update/${userId}`, { status: 'read' });

        if (response.status === 200) {
            // Update the notifications state
            setNotifications(notifications.map(notification => ({
                ...notification,
                read: true
            })));

            // Reset unread count
            setUnreadCount(0);
        } else {
            console.error('Failed to update notification status:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating notification status:', error);
    }
};


  const items = notifications.map((notification) => ({
    key: notification.id,
    label: (
      <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff', display: 'flex', alignItems: 'center', borderRadius: "39px 12px 74px 0px" }}>
        <Link to={`/teacher/createclasswork/${notification.class_id}/task/${notification.task_id}`} >
          <Avatar src={notification.student_profile || 'https://via.placeholder.com/40'} style={{ backgroundColor: '#f56a00', color: '#fff' }} />
          <div style={{ marginLeft: 12, flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
              {notification.student_name} submitted an assignment
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#595959' }}>
              Assignment: {notification.task_name }
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#000' }}>
              Date: {notification.created_at?.slice(0, 10)}
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
          <BellOutlined 
            style={{ fontSize: '24px', color: '#fff', cursor: 'pointer', marginRight: '20px', marginTop: '23px' }}
            onClick={unreadCount > 0 ? handleMarkAsRead : null} // Only call handleMarkAsRead if there are unread notifications
          />
        </Badge>
      </Space>
    </Dropdown>
  );
};

export default MessageDropdown;
