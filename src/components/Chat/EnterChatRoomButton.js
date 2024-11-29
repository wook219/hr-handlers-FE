import { useNavigate } from 'react-router-dom'; // useNavigate로 페이지 이동
import React, { useState } from 'react';
import './EnterChatRoomButton.css';
import { enterChatRoomAPI } from '../../api/chat';

const EnterChatRoomButton = ({ chatRoomId, title }) => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnterChatRoomClick = async () => {
    try {
      setLoading(true); // API 호출 시작하면 로딩 상태로 설정
      await enterChatRoomAPI(chatRoomId);
      navigate(`/chatroom/${chatRoomId}`, { state: { title } }); // 페이지 이동
    } catch (error) {
      console.error('Error entering chatRoom: ', error);
      setError('채팅방 입장에 실패');
    } finally {
      setLoading(false); // API 호출이 끝나고 로딩
    }
  };

  return (
    <button className="chat-enter-button" onClick={handleEnterChatRoomClick} disabled={loading}>
      {loading ? '입장 중' : '참여'}
    </button>
  );
};

export default EnterChatRoomButton;
