import { useEffect, useState } from 'react';
import { getAllChatRoomAPI } from '../../../api/chat';
import EnterChatRoomButton from '../ChatButtons/EnterChatRoomButton';
import DeleteChatRoomButton from '../ChatButtons/DeleteChatRoomButton';
import './ChattingList.css';
import { useUser } from '../../../context/UserContext';

const ChattingList = () => {
  const [chatrooms, setChatRooms] = useState([]);
  const { user } = useUser();

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

  const handleDeleteChatRoom = (chatRoomId) => {
    setChatRooms(
      (prevChatRooms) => prevChatRooms.filter((room) => room.chatRoomId !== chatRoomId) // 삭제된 채팅방을 목록에서 제외
    );
  };
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
              {user.role === 'ROLE_ADMIN' && (
                <DeleteChatRoomButton chatRoomId={chatroom.chatRoomId} onDelete={handleDeleteChatRoom} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChattingList;
