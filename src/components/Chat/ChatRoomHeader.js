import React, { useEffect, useState } from 'react';
import './ChatRoomHeader.css';
import { ThreeDotsVertical, BoxArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ChatRoomHeader = ({ title, handleClickMenu }) => {
  const [contextMenu, setContextMenu] = useState(null); // 메뉴 상태
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
      <div className="chatroom-right chatroom-header-icon-size" onClick={handleClickMenu}>
        <ThreeDotsVertical />
      </div>

      {contextMenu && (
        <div style={{ position: 'absolute', top: contextMenu.mouseY, left: contextMenu.mouseX }}>
          <div>메뉴1</div>
          <div>메뉴1</div>
        </div>
      )}
    </div>
  );
};

export default ChatRoomHeader;
