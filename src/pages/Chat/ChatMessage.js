import React, { useEffect, useState } from 'react';
import { getEmpNoFromToken } from '../../utils/tokenUtils';
import './ChatMessage.css';

const ChatMessage = ({
  message,
  name,
  empNo,
  messageId,
  timestamp,
  onEdit,
  onDelete,
  selectedMessageId,
  setSelectedMessageId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(message);
  const [contextMenu, setContextMenu] = useState(null); // 우클릭 메뉴 상태
  const [tokenEmpNo, setTokenEmpNo] = useState('');

  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (token) {
      const tokenEmpNo = getEmpNoFromToken();
      setTokenEmpNo(tokenEmpNo);
      if (!tokenEmpNo) throw new Error('EmpNo not authenticated');
    }
  }, [token]); // token이 변경될 때마다 실행

  useEffect(() => {
    // 화면의 다른 곳을 클릭하면 우클릭 메뉴를 닫음
    const handleClickOutside = (e) => {
      if (e.target.closest('.chat-message')) return; // ChatMessage 컴포넌트 안에서 클릭된 경우는 제외
      setContextMenu(null); // 메뉴 숨기기
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // 우클릭 이벤트 핸들러
  const handleRightClick = (e) => {
    e.preventDefault();
    if (empNo === tokenEmpNo) {
      setContextMenu({
        mouseX: e.clientX - 2,
        mouseY: e.clientY - 4,
      });
      setSelectedMessageId(messageId);
    }
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    onDelete(messageId); // 삭제 처리
    handleCloseMenu();
  };

  const handleSaveEdit = () => {
    onEdit(newMessage); // 수정 처리
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    // 엔터키를 눌렀을 때만 저장
    if (e.key === 'Enter') {
      e.preventDefault(); // Enter 키로 폼 제출을 방지
      handleSaveEdit();
    }
  };

  useEffect(() => {
    if (selectedMessageId !== messageId) {
      setContextMenu(null); // 다른 메시지를 선택하면 기존 메뉴 숨기기
    }
  }, [selectedMessageId, messageId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const period = hours < 12 ? '오전' : '오후'; // 오전/오후 구분
    hours = hours % 12; // 12시간 형식으로 변환
    if (hours === 0) hours = 12; // 12시인 경우, 0시를 12시로 변경

    // 분이 1자리일 경우 0을 추가하여 두 자리로 표시
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${period} ${hours}:${formattedMinutes}`;
  };

  let messageClass = empNo !== tokenEmpNo ? 'chat-message-received' : 'chat-message-sent';
  let messageLayout = empNo !== tokenEmpNo ? 'chat-message-left' : 'chat-message-right';
  let messageTime = empNo !== tokenEmpNo ? 'chat-message-time-left' : 'chat-message-time-right';

  return (
    <div className={messageLayout}>
      {empNo !== tokenEmpNo ? <div className="chat-message-name">{name} </div> : null}
      <div onContextMenu={handleRightClick} className={messageClass}>
        <div>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyUp={handleKeyDown} // 엔터키 눌렀을 때 저장
                className="chat-message-input"
                autoFocus
              />
            </div>
          ) : (
            message
          )}
        </div>
        {/* 우클릭 메뉴 */}
        {contextMenu && (
          <div style={{ position: 'absolute', top: contextMenu.mouseY, left: contextMenu.mouseX }}>
            <div onClick={handleEditClick} className="message-change-button">
              수정
            </div>
            <div onClick={handleDeleteClick} className="message-change-button">
              삭제
            </div>
          </div>
        )}
      </div>
      <div className={messageTime}>{formatTimestamp(timestamp)}</div>
    </div>
  );
};

export default ChatMessage;
