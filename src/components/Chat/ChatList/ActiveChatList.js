import React, { useEffect, useState } from 'react';
import { getAllEnterChatAPI } from '../../../api/chat';
import EnterChatRoomButton from '../EnterChatRoomButton';
import './ChattingList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ActiveChatList = () => {
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
    <div className="chatting-list-container">
      <div className="chatting-list">
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

export default ActiveChatList;
