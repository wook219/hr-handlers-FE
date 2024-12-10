import React, { useEffect, useState } from 'react';
import ActiveChatList from '../../components/Chat/ChatList/ActiveChatList';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ChatList = () => {
  return (
    <div className="chatroom-list-all-container mt-5">
      <ActiveChatList />
    </div>
  );
};

export default ChatList;
