import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ChatRoomModal.css';

const ExitChatRoomModal = ({ show, handleClose, handleExit }) => {
  const [isExited, setIsExited] = useState(false);

  const handleExitChat = async () => {
    try {
      await handleExit();
      setIsExited(true);
    } catch (error) {
      console.error('퇴장 처리 중 오류 발생', error);
    }
  };

  const handleCloseExitModal = () => {
    setIsExited(false);
    window.location.href = '/chat';
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="chatroom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title className="text-center">채팅방 퇴장</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center chatroom-exit-check">채팅방에서 퇴장하시겠습니까?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button className="chatroom-button chatroom-modal-button-color" size="lg" onClick={handleExitChat}>
            퇴장
          </Button>
          <Button className="chatroom-button ml-2" variant="secondary" size="lg" onClick={handleClose}>
            취소
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 채팅방 퇴장 완료 모달 */}
      <Modal show={isExited} onHide={() => setIsExited(false)} centered className="chatroom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title className="text-center">채팅방 퇴장 완료</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="chatroom-modal-success-text">채팅방 퇴장이 완료되었습니다.</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button className="chatroom-modal-button-color chatroom-button" onClick={handleCloseExitModal} size="lg">
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExitChatRoomModal;
