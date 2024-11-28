import React, { useState } from 'react';

// 보낸 메시지 받은 메시지 구분

const ChatMessage = ({ message, name, messageId, onEdit, onDelete, setSelectedMessageId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newMessage, setNewMessage] = useState(message);
  const [contextMenu, setContextMenu] = useState(null); // 우클릭 메뉴 상태

  // 우클릭 이벤트 핸들러
  const handleRightClick = (e) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
    setSelectedMessageId(messageId);
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

  return (
    <div onContextMenu={handleRightClick}>
      <div>
        <span>{name} : </span>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onBlur={handleSaveEdit} // 블러 시 저장
            />

            <button onClick={handleSaveEdit}>저장</button>
          </div>
        ) : (
          message
        )}
      </div>

      {/* 우클릭 메뉴 */}
      {contextMenu && (
        <div style={{ position: 'absolute', top: contextMenu.mouseY, left: contextMenu.mouseX }}>
          <div onClick={handleEditClick}>수정</div>
          <div onClick={handleDeleteClick}>삭제</div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
