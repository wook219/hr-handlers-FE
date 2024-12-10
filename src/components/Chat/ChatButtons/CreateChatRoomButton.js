import React, { useState } from 'react';
import CreateChatRoomModal from '../ChatModals/CreateChatRoomModal';
import { Button } from 'react-bootstrap';
import { SendFill } from 'react-bootstrap-icons';
import './CreateChatRoomButton.css';
import { createChatRoomAPI } from '../../../api/chat';
import { useNavigate } from 'react-router-dom';

const CreateChatRoomButton = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateChatRoom = async (title, isSecret) => {
    const response = await createChatRoomAPI(title, isSecret);

    navigate(`/chatroom/${response.data.chatRoomId}`, { state: { title } });

    handleCloseModal(); // 모달 닫기
  };

  return (
    <div>
      <Button onClick={handleShowModal} className="create-chatroom-btn">
        <SendFill className="chat-icon" />
        채팅방 개설하기
      </Button>

      <CreateChatRoomModal
        show={showModal}
        onClose={handleCloseModal}
        onCreate={handleCreateChatRoom} // onCreate에 API 호출 함수 전달
      />
    </div>
  );
};

export default CreateChatRoomButton;
