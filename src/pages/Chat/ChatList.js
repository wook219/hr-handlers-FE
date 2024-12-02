import React, { useEffect, useState } from 'react';
import ActiveChatList from '../../components/Chat/ChatList/ActiveChatList';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabNavigation from '../../components/Chat/ChatTabNavigation';

const ChatList = () => {
  return (
    <div className="chatroom-list-all-container mt-5">
      <TabNavigation />
      <ActiveChatList />
    </div>
  );
};

export default ChatList;
