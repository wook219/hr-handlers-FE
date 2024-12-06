import React, { useState } from 'react';
import './EnterChatRoomButton.css';
import { useNavigate } from 'react-router-dom';
import { deleteChatRoomAPI } from '../../../api/chat';
import DeleteChatRoomModal from '../ChatModals/DeleteChatRoomModal.js';

const DeleteChatRoomButton = ({ chatRoomId, onDelete }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteChatRoom = async () => {
    try {
      setLoading(true);
      await deleteChatRoomAPI(chatRoomId);
      onDelete(chatRoomId);
      navigate(`/chatroom`);
    } catch (error) {
      console.error('채팅방 삭제 중 에러 발생: ', error);
      setError('채팅방 삭제 실패');
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  return (
    <>
      <button className="chat-delete-button" onClick={openDeleteModal} disabled={loading}>
        삭제
      </button>

      <DeleteChatRoomModal
        show={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteChatRoom}
        chatRoomId={chatRoomId}
      />
    </>
  );
};

export default DeleteChatRoomButton;
