import React from 'react';
import { Dropdown, Menu, Avatar, Badge, Space,Button } from 'antd';
import { BellTwoTone, DownOutlined } from '@ant-design/icons';
import { IoIosNotificationsOutline } from "react-icons/io";
const messages = [
  {
    id: 1,
    avatar: 'https://via.placeholder.com/40',
    title: 'New assignment available',
    description: 'Check out the new assignment on Mathematics.',
  },
  {
    id: 2,
    avatar: 'https://via.placeholder.com/40',
    title: 'Classroom update',
    description: 'Your classroom has been updated with new materials.',
  },
  {
    id: 3,
    avatar: 'https://via.placeholder.com/40',
    title: 'Classroom update',
    description: 'Your classroom has been updated with new materials.',
  },
  {
    id: 4,
    avatar: 'https://via.placeholder.com/40',
    title: 'Classroom update',
    description: 'Your classroom has been updated with new materials.',
  },
  {
    id: 5,
    avatar: 'https://via.placeholder.com/40',
    title: 'Classroom update',
    description: 'Your classroom has been updated with new materials.',
  },
  {
    id: 6,
    avatar: 'https://via.placeholder.com/40',
    title: 'Classroom update',
    description: 'Your classroom has been updated with new materials.',
  },
  {
    id: 7,
    avatar: 'https://via.placeholder.com/40',
    title: 'Classroom update',
    description: 'Your classroom has been updated with new materials.',
  },
];

const MessageDropdown = () => {
  const items = messages.map((message) => ({
    key: message.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={message.avatar} />
        <div style={{ marginLeft: 10 }}>
          <strong>{message.title}</strong>
          <p style={{ margin: 0 }}>{message.description}</p>
        </div>
      </div>
    ),
  }));

  return (
    
    <Dropdown
      menu={{
        items,
        style: { maxHeight: '200px', overflowY: 'auto' }
      }}
      trigger={['click']}
    >
        <Space>
          <Badge style={{ marginTop : '22px' }} count={1}>
            <BellTwoTone style={{ fontSize: '24px' , color : 'white' , marginTop : '22px' ,cursor : 'pointer' }} />
          </Badge>
          <DownOutlined />
        </Space>
    </Dropdown>
  );
};

export default MessageDropdown;
