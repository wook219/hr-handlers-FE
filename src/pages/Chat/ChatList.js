import React, { useEffect, useState } from 'react';
import { getAllEnterChatAPI } from '../../api/chat';
import EnterChatRoomButton from '../../components/Chat/EnterChatRoomButton';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabNavigation from '../../components/Chat/ChatTabNavigation';

const ChatList = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getAllEnterChatAPI();
        setChats(response.data);
      } catch (error) {
        console.error('Failed to fetch enterChatRooms: ', error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="chatroom-list-all-container mt-5">
      <TabNavigation />
      <div className="chatroom-list-container">
        {chats.map((chat, index) => (
          <div className="row align-items-center mb-3" key={index}>
            <div className="col-2 text-center">
              <span>{index}</span>
            </div>

            <div className="col-7">
              <span className="chatroom-list-title">{chat.title}</span>
            </div>

            <div className="col-3 text-center">
              <EnterChatRoomButton chatRoomId={chat.chatRoomId} title={chat.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
