import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import './Style.css'; // Make sure the CSS file is updated accordingly
import logo from './logo/images (1).png'; // Ensure this path is correct

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="SMIT Portal Logo" className="logo" />
      </div>
      <Button className="login-button" type="primary" onClick={showModal}>
        Login
      </Button>
      <Modal
        title="Select and login"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="login-modal"
      >
        <hr />
        <div className="modal-content">
          <Link to={'/student/login'}>
            <Button type="primary" block>
              Login if you are a Student
            </Button>
          </Link>
          <Link to={'/teacher/login'}>
            <Button block>Login if you are a Teacher</Button>
          </Link>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
