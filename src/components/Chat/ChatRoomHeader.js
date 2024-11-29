import React from 'react';
import './ChatRoomHeader.css';

const Header = ({ title }) => {
  return (
    <div className="chatroom-header-container">
      <div className="chatroom-left">목록으로</div>
      <div className="chatroom-center">{title}</div>
      <div className="chatroom-right">퇴장</div>
    </div>
  );
};

export default Header;
