import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UseWebSocket from './UseWebSocket';
import ChatMessage from './ChatMessage';
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader';
import ActiveChatList from '../../components/Chat/ChatList/ActiveChatList';
import ChatTabNavigation from '../../components/Chat/ChatTabNavigation';
import { getChatMessagesAPI } from '../../api/chat';
import { getEmpNoFromToken } from '../../utils/tokenUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SendFill } from 'react-bootstrap-icons';
import './ChatRoom.css';

const ChatRoom = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [empNo, setEmpNo] = useState('');
  const [messageInput, setMessageInput] = useState([]);
  const [title, setTitle] = useState('');
  const location = useLocation(); // useLocation 훅을 사용하여 state에 접근

  const chatBodyRef = useRef(null);

  const token = localStorage.getItem('access_token');
  useEffect(() => {
    if (token) {
      const empNo = getEmpNoFromToken();
      setEmpNo(empNo);
      if (!empNo) throw new Error('EmpNo not authenticated');
    }
  }, [token]); // token이 변경될 때마다 실행

  const { chatroomId } = useParams();

  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title);
    }

    const pathParts = window.location.pathname.split('/');
    const roomId = pathParts[pathParts.length - 1];
    if (roomId) {
      setChatRoomId(roomId);
      loadChatMessages(roomId);
    }
  }, [chatroomId]);

  // 메시지가 변경될 때마다 스크롤을 가장 아래로 이동
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

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
            text: message.message,
            name: message.employeeName,
            sent: false,
            received: true,
            fromServer: true,
          },
        ];
      }
    });
  }, []);

  const handleMessageUpdated = useCallback((updatedMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === updatedMessage.messageId ? { ...msg, text: updatedMessage.message } : msg))
    );
  }, []);

  const handleMessageDeleted = useCallback((deletedMessageId) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== deletedMessageId));
  }, []);

  // WebSocket 관련 hook
  const { sendMessage, updateMessage, deleteMessage } = UseWebSocket(
    chatRoomId,
    handleMessageReceived,
    handleMessageUpdated,
    handleMessageDeleted,
    empNo
  );

  // 채팅 메시지 불러오기
  const loadChatMessages = useCallback(
    async (roomId) => {
      try {
        const chatMessages = await getChatMessagesAPI(roomId);
        console.log('Loaded messages: ', chatMessages);

        const formattedMessages = chatMessages.data.map((msg) => ({
          id: msg.messageId,
          text: msg.message,
          name: msg.employeeName,
          empNo: msg.empNo,
          sent: msg.empNo === empNo,
          received: msg.empNo !== empNo,
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

      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }
  };

  const handleEditMessage = async (newMessage) => {
    if (selectedMessageId && newMessage.trim()) {
      try {
        await updateMessage(selectedMessageId, newMessage);
      } catch (error) {
        console.error('메시지 수정 중 오류 발생: ', error);
      }
    }
  };

  const handleDeleteMessage = async () => {
    if (selectedMessageId) {
      try {
        await deleteMessage(selectedMessageId);
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== selectedMessageId));

        // 선택된 메시지ID 초기화
        setSelectedMessageId(null);
      } catch (error) {
        console.error('메시지 삭제 중 오류: ', error);
      }
    }
  };

  return (
    <div className="chatroom-page">
      <div className="chatroom-list-all-container mt-5">
        <div className="chatlist-box">참여 중인 메신저</div>
        <ActiveChatList />
      </div>
      <div className="chatroom-entire-container">
        <ChatRoomHeader title={title} />
        <div className="chatroom-page-container">
          <div ref={chatBodyRef} style={{}} className="chat-body">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                name={message.name}
                empNo={message.empNo}
                messageId={message.id}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                selectedMessageId={selectedMessageId}
                setSelectedMessageId={setSelectedMessageId}
              />
            ))}
          </div>

          {/* 메시지 입력 부분 */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="메시지 입력"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSendMessage()}
              autoFocus
            />
            <button onClick={handleSendMessage}>
              <SendFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
