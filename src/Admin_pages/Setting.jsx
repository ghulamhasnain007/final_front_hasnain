import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ExampleModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleOpenModal}>
        Open Modal
      </Button>
      <Modal
        title="Modal Title"
        open={isOpen}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Modal Content</p>
      </Modal>
    </div>
  );
};

export default ExampleModal;
