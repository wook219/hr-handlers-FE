import React, { useState, useEffect } from 'react';
import UseWebSocket from './UseWebSocket'; // 커스텀 훅 가져오기
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios를 사용하여 백엔드 API 호출

const ChatComponent = () => {
  const [chatRoomId, setChatRoomId] = useState('1'); // 테스트용 고정 chatRoomId
  const [employeeId, setEmployeeId] = useState('1'); // 테스트용 기본 employeeId
  const [message, setMessage] = useState(''); // 메시지 입력
  const [receivedMessages, setReceivedMessages] = useState([]); // 수신된 메시지
  const [sendingMessages, setSendingMessages] = useState([]); // 보낸 메시지
  const [contextMenu, setContextMenu] = useState(null); // 우클릭 메뉴 상태
  const [selectedMessage, setSelectedMessage] = useState(null); // 수정하거나 삭제할 메시지
  const navigate = useNavigate();

  // 메시지가 수신되면 호출될 함수
  const onMessageReceived = (message) => {
    console.log('Received message:', message);
    setReceivedMessages((prevMessages) => [...prevMessages, { ...message, type: 'received' }]);
  };

  // 메시지 수정 후 호출될 함수
  const onMessageUpdated = (updatedMessage) => {
    setReceivedMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === updatedMessage.id ? { ...msg, message: updatedMessage.message } : msg))
    );
    setSendingMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === updatedMessage.id ? { ...msg, message: updatedMessage.message } : msg))
    );
  };

  const onMessageDeleted = (deletedMessage) => {
    setReceivedMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== deletedMessage.id));
    setSendingMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== deletedMessage.id));
  };

  // UseWebSocket 훅 사용
  const { sendMessage, isConnected, updateMessage, deleteMessage } = UseWebSocket(
    chatRoomId,
    onMessageReceived,
    onMessageUpdated,
    onMessageDeleted,
    employeeId
  );

  // 초기 메시지 가져오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/chatroom/${chatRoomId}`); // 백엔드 API 호출
        const messages = response.data.data; // 응답 데이터에서 메시지 목록 가져오기
        // 메시지 구분하여 저장
        const categorizedMessages = messages.map((msg) => {
          if (msg.employeeId === employeeId) {
            return { ...msg, type: 'sent' }; // 보낸 메시지
          } else {
            return { ...msg, type: 'received' }; // 받은 메시지
          }
        });
        setReceivedMessages(categorizedMessages); // 수신된 메시지 상태 업데이트
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages(); // 컴포넌트가 마운트될 때 메시지 가져오기
  }, [chatRoomId, employeeId]);

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (message.trim() !== '') {
      const sentMessage = { message, employeeId, id: Date.now() }; // 메시지와 함께 employeeId 포함
      if (isConnected) {
        sendMessage(sentMessage); // 메시지 전송
        setSendingMessages((prevMessages) => [...prevMessages, sentMessage]); // 보낸 메시지 기록
        setMessage(''); // 메시지 전송 후 입력창 초기화
      } else {
        console.error('WebSocket 연결이 되어 있지 않습니다.');
      }
    }
  };

  // 우클릭 메뉴 표시 함수
  const handleRightClick = (e, msg) => {
    e.preventDefault(); // 기본 우클릭 메뉴 차단
    setContextMenu({ x: e.clientX, y: e.clientY });
    setSelectedMessage(msg); // 선택된 메시지 저장
  };

  // 수정 함수
  const handleEditMessage = () => {
    if (selectedMessage) {
      const newMessage = prompt('Edit message:', selectedMessage.message);
      if (newMessage && newMessage !== selectedMessage.message) {
        updateMessage(selectedMessage.id, newMessage); // 메시지 수정 요청
        setSendingMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === selectedMessage.id ? { ...msg, message: newMessage } : msg))
        );
        setSelectedMessage(null);
        setContextMenu(null);
      }
    }
  };

  // 삭제 함수
  const handleDeleteMessage = () => {
    if (selectedMessage) {
      // 본인이 보낸 메시지만 삭제 가능
      if (selectedMessage.employeeId === employeeId) {
        if (window.confirm('Are you sure you want to delete this message?')) {
          deleteMessage(selectedMessage.id); // 메시지 삭제 요청
          setSendingMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== selectedMessage.id));
          setSelectedMessage(null);
          setContextMenu(null);
        }
      } else {
        alert('You can only delete your own messages.');
      }
    }
  };

  return (
    <div>
      <h1>Chat Application</h1>

      {/* employeeId와 message 입력 받기 */}
      <div>
        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Employee ID"
        />
      </div>

      <div>
        <label htmlFor="message">Message:</label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
        />
      </div>

      <button onClick={handleSendMessage}>Send Message</button>

      {/* 보낸 메시지 목록 */}
      <div>
        <h3>Sent Messages:</h3>
        <ul>
          {sendingMessages.map((msg, index) => (
            <li
              key={index}
              onContextMenu={(e) => handleRightClick(e, msg)} // 우클릭 메뉴 활성화
            >
              {msg.message} (Sent)
            </li>
          ))}
        </ul>
      </div>

      {/* 우클릭 메뉴 */}
      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: 'white',
            border: '1px solid black',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}
        >
          <button onClick={handleEditMessage}>Edit Message</button>
          <button onClick={handleDeleteMessage}>Delete Message</button>
        </div>
      )}

      {/* 받은 메시지 목록 */}
      <div>
        <h3>Received Messages:</h3>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index}>
              {msg.message} ({msg.type === 'sent' ? 'Sent' : 'Received'}) : {msg.employeeName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatComponent;
