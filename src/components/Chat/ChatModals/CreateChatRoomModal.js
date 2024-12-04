import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useToast } from '../../../context/ToastContext';
import './ChatRoomModal.css';
import { useNavigate } from 'react-router-dom';

const CreateChatRoomModal = ({ show, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSecretChange = (e) => {
    setIsSecret(e.target.checked);
  };

  const handleCreate = () => {
    if (title.trim() !== '') {
      onCreate(title, isSecret ? 'Y' : 'N');
      setTitle(''); // 제목 초기화
      showToast('채팅방이 생성되었습니다!', 'success'); // 채팅방 생성 성공 메시지

      // 생성 후 새로고침
      setTimeout(() => {
        window.location.reload(); // 1초 후에 새로고침
      }, 1000);

      // 만약 비공개 채팅방이라면
      if (isSecret) {
        setTimeout(() => {
          navigate('/invite/chatroom'); // 비공개 채팅방 페이지로 이동
        }, 1000);
      }
    } else {
      showToast('채팅방 제목을 입력해주세요.', 'error'); // 제목 입력을 하지 않았을 때 에러 메시지
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose} centered className="chatroom-modal-content">
        <Modal.Header closeButton>
          <Modal.Title className="text-center">채팅방 개설하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="chatroomTitle" className="text-center">
              <Form.Label className="chatroom-modal-label">제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="채팅방 제목을 입력하세요"
                value={title}
                onChange={handleTitleChange}
                className="text-center"
              />
            </Form.Group>

            <Form.Group controlId="isSecret" className="d-flex justify-content-center align-items-center mt-3">
              <Form.Check
                type="checkbox"
                label="비공개 채팅방으로 생성하시겠습니까?"
                checked={isSecret}
                onChange={handleSecretChange} // 체크박스 상태 변경
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button className="chatroom-button chatroom-modal-button-color" onClick={handleCreate} size="lg">
            생성
          </Button>
          <Button className="chatroom-button ml-2" variant="secondary" onClick={onClose} size="lg">
            취소
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateChatRoomModal;
