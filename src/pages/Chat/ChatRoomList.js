import React, { useEffect, useState } from 'react';
import { getAllChatRoomAPI } from '../../api/chat';
import EnterChatRoomButton from '../../components/Chat/EnterChatRoomButton';
import './ChatRoomList.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container mt-5">
      <h2>채팅방 목록</h2>
      <div>
        <p>메신저 목록</p>
        <p>참여 중인 메신저</p>
      </div>
      <div>
        {chatrooms.map((chatroom) => (
          <div className="row align-items-center mb-3" key={chatroom.chatRoomId}>
            <div className="col-2 text-center">
              <span>{chatroom.chatRoomId}</span>
            </div>

            <div className="col-7">
              <span className="chatroom-title">{chatroom.title}</span>
            </div>

            <div className="col-3 text-center">
              <EnterChatRoomButton chatRoomId={chatroom.chatRoomId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
