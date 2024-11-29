import React from 'react';
import './ChatRoomHeader.css';
import { ThreeDotsVertical, BoxArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ChatRoomHeader = ({ title }) => {
  const navigate = useNavigate();

  // 참여 중인 메신저 목록으로 이동
  const handleClick = () => {
    navigate('/chat');
  };

  return (
    <div className="chatroom-header-container">
      <div className="chatroom-left chatroom-header-icon-size" onClick={handleClick}>
        <BoxArrowLeft />
      </div>
      <div className="chatroom-center">{title}</div>
      <div className="chatroom-right chatroom-header-icon-size">
        <ThreeDotsVertical />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
