import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useToast } from '../../../context/ToastContext';
import './ChatRoomModal.css';

const DeleteChatRoomModal = ({ show, onClose, onConfirm, chatRoomId }) => {
  const { showToast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      await onConfirm(chatRoomId);
      showToast('채팅방이 삭제되었습니다!', 'success');
    } catch (error) {
      showToast('채팅방 삭제에 실패했습니다.', 'error');
    }
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title>채팅방 삭제</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div>정말 이 채팅방을 삭제하시겠습니까?</div>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button className="chatroom-button chatroom-modal-button-color" onClick={handleDeleteConfirm} size="lg">
          삭제
        </Button>
        <Button className="chatroom-button ml-2" variant="secondary" onClick={onClose} size="lg">
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChatRoomModal;
