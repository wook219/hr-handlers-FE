import React, { useEffect, useState } from 'react';
import EnterChatRoomButton from '../../components/Chat/EnterChatRoomButton';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabNavigation from '../../components/Chat/ChatTabNavigation';

const ChatList = () => {
  return (
    <div className="container mt-5">
      <TabNavigation />
    </div>
  );
};

export default ChatList;
