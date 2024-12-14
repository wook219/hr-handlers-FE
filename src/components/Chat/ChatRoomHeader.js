import React, { useEffect, useState } from 'react';
import './ChatRoomHeader.css';
import { ThreeDotsVertical, ChevronLeft, PersonFill } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';

const ChatRoomHeader = ({ title, handleClickMenu, employeeCount }) => {
  const { chatroomId } = useParams();
  // const [employeeCount, setEmployeeCount] = useState(0); // 참여 인원 수
  const navigate = useNavigate();

  // 참여 중인 메신저 목록으로 이동
  const handleClick = () => {
    navigate('/chat');
  };

  return (
    <div className="chatroom-header-container">
      <div className="chatroom-left chatroom-header-icon-size" onClick={handleClick}>
        <ChevronLeft />
      </div>
      <div className="chatroom-center">
        {title}
        <span className="chatroom-header-size">
          <PersonFill className="chatroom-icon-margin" />
          {employeeCount}
        </span>
      </div>
      <div className="chatroom-right chatroom-header-icon-size" onClick={handleClickMenu}>
        <ThreeDotsVertical />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
