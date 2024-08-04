import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './Style.css';
import logo from './logo/images (1).png';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState('');

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('role');
    setRole('');
  };

  useEffect(() => {
   

    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(JSON.parse(storedRole));
    }
  }, []);

  return (
    <header className="header" style={{ backgroundColor: '#f0f2f5', padding: '10px 20px' }}>
      <div className="logo-container" >
        <img src={logo} alt="SMIT Portal Logo" className="logo" style={{ borderRadius: '10px' }} />
      </div>
      {!role ? (
        <Button
          className="login-button"
          type="primary"
          onClick={showModal}
          style={{
            backgroundColor: '#40a9ff',
            borderColor: '#40a9ff',
            borderRadius: '5px',
          }}
  
        >
          Login
        </Button>
      ) : (
        <Button
          className="login-button"
          type="primary"
          onClick={logout}
          style={{
            backgroundColor: '#52c41a',
            borderColor: '#52c41a',
            borderRadius: '5px',
          }}

        >
          Log out
        </Button>
      )}
      <Modal
        title="Select and login"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="login-modal"
        style={{ borderRadius: '10px' }}


      >
        <hr />
        <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to={'/student/login'}>
            <Button type="primary" block style={{ borderRadius: '5px' }}>
              Login if you are a Student
            </Button>
          </Link>
          <Link to={'/teacher/login'}>
            <Button block style={{ borderRadius: '5px' }}>
              Login if you are a Teacher
            </Button>
          </Link>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
