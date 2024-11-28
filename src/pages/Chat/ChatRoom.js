import React, { useCallback, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import UseWebSocket from './UseWebSocket';
import ChatMessage from './ChatMessage';
import { getChatMessagesAPI } from '../../api/chat';

const ChatRoom = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [empNo, setEmpNo] = useState('');
  const [messageInput, setMessageInput] = useState([]);

  const chatBodyRef = useRef(null);

  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmpNo(decodedToken.empNo);
        console.log('EmpNo: ', decodedToken.empNo);
      } catch (error) {
        console.error('토큰 디코딩 에러: ', error);
      }
    } else {
    }
  }, [navigator]);

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const roomId = pathParts[pathParts.length - 1];
    if (roomId) {
      setChatRoomId(roomId);
      loadChatMessages(roomId);
    }
  }, [window.location.search]);

  const handleMessageReceived = useCallback((message) => {
    console.log('Received message: ', message);
    setMessages((prevMessages) => {
      const tempIndex = prevMessages.findIndex((msg) => msg.isTemp && msg.text === message.message);

      if (tempIndex !== -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[tempIndex] = {
          ...message,
          id: message.messageId,
          text: message.message,
          name: message.employeeName,
          sent: true,
          received: false,
          isTemp: false,
        };
        return updatedMessages;
      } else {
        return [
          ...prevMessages,
          {
            id: message.messageId,
            name: message.employeeName,
            text: message.message,
            sent: false,
            received: true,
            fromServer: true,
          },
        ];
      }
    });
  }, []);

  // WebSocket 관련 hook
  const { sendMessage } = UseWebSocket(chatRoomId, handleMessageReceived, empNo);

  // 채팅 메시지 불러오기
  const loadChatMessages = useCallback(
    async (roomId) => {
      try {
        const chatMessages = await getChatMessagesAPI(roomId);
        console.log('Loaded messages: ', chatMessages);

        const formattedMessages = chatMessages.data.map((msg) => ({
          id: msg.messageId,
          text: msg.message,
          sent: msg.empNo === empNo,
          name: msg.employeeName,
          timestamp: new Date(msg.timestamp),
        }));

        setMessages(formattedMessages);
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
      }
    },
    [empNo]
  );

  const handleSendMessage = () => {
    const newMessage = messageInput.trim();
    if (newMessage !== '') {
      const tempMessage = {
        id: `temp-${Date.now()}`,
        text: newMessage,
        sent: true,
        received: false,
        isTemp: true,
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      sendMessage({
        chatRoomId: chatRoomId,
        message: newMessage,
        empNo: empNo,
      });

      setMessageInput('');
    }
  };

  return (
    <div>
      <h2>채팅방 {chatRoomId}</h2>
      <div ref={chatBodyRef} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((message, name) => (
          <ChatMessage key={message.id} message={message.text} name={message.name} />
        ))}
      </div>

      {/* 메시지 입력 부분 */}
      <div>
        <input
          type="text"
          placeholder="메시지 입력"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;
