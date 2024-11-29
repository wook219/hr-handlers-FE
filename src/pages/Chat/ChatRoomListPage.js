import React, { useEffect, useState } from "react";
import "./ChatRoomList.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TabNavigation from "../../components/Chat/ChatTabNavigation";
import ChatList from "../../components/Chat/ChatList/ChatList";

const ChatRoomListPage = () => {
  return (
    <div className="chatroom-list-all-container mt-5">
      <TabNavigation />
      <ChatList />
    </div>
  );
};

export default ChatRoomListPage;
