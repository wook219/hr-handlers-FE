import React, { useEffect, useState } from 'react';
import './ChatRoomHeader.css';
import { ThreeDotsVertical, ChevronLeft } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { getJoinedEmployees } from '../../api/chat';

const ChatRoomHeader = ({ title, handleClickMenu }) => {
  const { chatroomId } = useParams();
  const [contextMenu, setContextMenu] = useState(null); // 메뉴 상태
  const [employeeCount, setEmployeeCount] = useState(0); // 참여 인원 수
  const navigate = useNavigate();

  // 참여 중인 메신저 목록으로 이동
  const handleClick = () => {
    navigate('/chat');
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employees = await getJoinedEmployees(chatroomId);
        const count = employees.data.length;
        setEmployeeCount(count);
      } catch (error) {
        console.error('Failed to fetch employees', error);
      }
    };

    fetchEmployees();
  }, [chatroomId]);

  return (
    <div className="chatroom-header-container">
      <div className="chatroom-left chatroom-header-icon-size" onClick={handleClick}>
        <ChevronLeft />
      </div>
      <div className="chatroom-center">
        {title}({employeeCount})
      </div>
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
