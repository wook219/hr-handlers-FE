import React, { useEffect, useState } from 'react';
import { getAllChatRoomAPI } from '../../api/chat';
import EnterChatRoomButton from '../../components/Chat/EnterChatRoomButton';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TabNavigation from '../../components/Chat/ChatTabNavigation';

const ChatRoomList = () => {
  const [chatrooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await getAllChatRoomAPI();
        setChatRooms(response.data);
      } catch (error) {
        console.error('Failed to fetch chatrooms: ', error);
      }
    };

    fetchChatRooms();
  }, []);

  return (
    <div className="chatroom-list-all-container mt-5">
      <TabNavigation />
      <div className="chatroom-list-container">
        <div className="chatroom-list">
          {chatrooms.map((chatroom) => (
            <div className="row align-items-center mb-3" key={chatroom.chatRoomId}>
              <div className="col-2 text-center">
                <span>{chatroom.chatRoomId}</span>
              </div>

              <div className="col-7">
                <span className="chatroom-list-title">{chatroom.title}</span>
              </div>

              <div className="col-3 text-center">
                <EnterChatRoomButton chatRoomId={chatroom.chatRoomId} title={chatroom.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
