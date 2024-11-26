import { useNavigate } from 'react-router-dom'; // useNavigate로 페이지 이동
import React from 'react';
import './EnterChatRoomButton.css';

const EnterChatRoomButton = ({ chatRoomId }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleEnterChatRoomClick = () => {
    navigate(`/chatroom/${chatRoomId}`); // 페이지 이동
  };

  return (
    <button className="chat-enter-button" onClick={handleEnterChatRoomClick}>
      참여
    </button>
  );
};

export default EnterChatRoomButton;
