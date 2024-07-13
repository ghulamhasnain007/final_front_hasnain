import React from 'react';
import { Layout, Space,Row , Typography} from 'antd';
const {  Text } = Typography;
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import './Footer.css';

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer className="footer">
      <div className="footer-content">
        <Space size="large">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookOutlined className="social-icon" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterOutlined className="social-icon" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramOutlined className="social-icon" />
          </a>
        </Space>
        <div className="contact-info">
          <Space size="middle">
            <MailOutlined />
            <span>contact@example.com</span>
            <PhoneOutlined />
            <span>+1 234 567 890</span>
          </Space>
        </div>
      </div>
      <Row justify="center" style={{ marginTop: '20px' }}>
      <Text style={{ color: '#fff' }}>© 2024 Company. All Rights Reserved.</Text>
    </Row>
    </Footer>
  );
};

export default AppFooter;
