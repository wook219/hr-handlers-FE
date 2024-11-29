import React, { useEffect, useState } from 'react';
import ChattingList from '../../components/Chat/ChatList/ChattingList';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabNavigation from '../../components/Chat/ChatTabNavigation';

const ChatRoomListPage = () => {
  return (
    <div className="chatroom-list-all-container mt-5">
      <TabNavigation />
      <ChattingList />
    </div>
  );
};

export default ChatRoomListPage;
