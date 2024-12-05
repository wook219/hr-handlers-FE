import { useEffect, useState } from 'react';
import { getAllChatRoomAPI } from '../../../api/chat';
import EnterChatRoomButton from '../ChatButtons/EnterChatRoomButton';
import './ChattingList.css';

const ChattingList = () => {
  const [chatrooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await getAllChatRoomAPI();

        // 비공개가 아닌 채팅방만 필터링
        const publicChatRooms = response.data.filter((chatroom) => chatroom.isSecret === 'N');

        setChatRooms(publicChatRooms);
      } catch (error) {
        console.error('Failed to fetch chatrooms: ', error);
      }
    };

    fetchChatRooms();
  }, []);
  return (
    <div className="chatting-list-container">
      <div className="chatting-list">
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
  );
};

export default ChattingList;
