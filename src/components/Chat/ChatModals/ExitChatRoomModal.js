import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useToast } from '../../../context/ToastContext';
import './ChatRoomModal.css';
import { useNavigate } from 'react-router-dom';

const ExitChatRoomModal = ({ show, handleClose, handleExit }) => {
  const [isExited, setIsExited] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleExitChat = async () => {
    try {
      await handleExit();
      setIsExited(true);
      showToast('채팅방 퇴장이 완료되었습니다.', 'success');

      setTimeout(() => {
        navigate('/chat'); // 채팅방 목록 페이지로 이동
      }, 200);
    } catch (error) {
      console.error('퇴장 처리 중 오류 발생', error);
      showToast('퇴장 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  const handleCloseExitModal = () => {
    setIsExited(false);
    navigate('/chat');
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="chatroom-modal-content">
        <Modal.Header>
          <Modal.Title className="text-center">채팅방 퇴장</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center chatroom-exit-check">채팅방에서 퇴장하시겠습니까?</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button className="chatroom-button chatroom-modal-button-color" onClick={handleExitChat}>
            퇴장
          </button>
          <button className="chatroom-button ml-2 chatroom-cancel-button-color" onClick={handleCloseExitModal}>
            취소
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExitChatRoomModal;
