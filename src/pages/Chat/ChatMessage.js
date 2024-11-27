import React from 'react';

// 보낸 메시지 받은 메시지 구분

const ChatMessage = ({ message, name }) => {
  return (
    <div>
      <div>
        <span>{name} : </span>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
