import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';

const UseWebSocket = (chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted, employeeId) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 추적

  // 메시지가 수신되었을 때 호출되는 함수 메모이제이션
  const memoizedOnMessageReceived = useCallback(onMessageReceived, [onMessageReceived]);
  const memoizedOnMessageUpdated = useCallback(onMessageUpdated, [onMessageUpdated]);
  const memoizedOnMessageDeleted = useCallback(onMessageDeleted, [onMessageDeleted]);

  useEffect(() => {
    if (!chatRoomId) return; // chatRoomId가 없으면 WebSocket 연결하지 않음

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('JWT 토큰 없음');
      return;
    }

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        chatRoomId: chatRoomId,
      },
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        setIsConnected(true); // 연결 성공 시 상태 업데이트
        stompClient.subscribe(`/topic/message/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log('받은 메시지:', receivedMessage);
          // onMessageReceived 호출
          if (typeof memoizedOnMessageReceived === 'function' && receivedMessage.message) {
            memoizedOnMessageReceived(receivedMessage);
          }
        });

        // 메시지 수정
        stompClient.subscribe(`/topic/message/update/${chatRoomId}`, (message) => {
          const updatedMessage = JSON.parse(message.body);
          console.log('수정한 메시지:', updatedMessage);
          if (typeof memoizedOnMessageUpdated === 'function' && updatedMessage.update) {
            memoizedOnMessageUpdated(updatedMessage);
          }
        });

        // 메시지 삭제
        stompClient.subscribe(`/topic/message/delete/${chatRoomId}`, (message) => {
          const deletedMessage = JSON.parse(message.body);
          console.log('삭제한 메시지:', deletedMessage);
          if (typeof memoizedOnMessageDeleted === 'function' && deletedMessage) {
            memoizedOnMessageDeleted(deletedMessage);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        console.error('추가 정보:', frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [chatRoomId, employeeId]); // chatRoomId가 변경될 때만 연결

  // 메시지 전송
  const sendMessage = useCallback(
    (message) => {
      if (isConnected && client && client.active) {
        // 연결 상태가 활성화되었을 때만 메시지 발송
        client.publish({
          destination: `/app/message/${chatRoomId}`,
          body: JSON.stringify({ ...message, employeeId }),
        });
      } else {
        console.error('WebSocket 연결이 되어 있지 않습니다.');
      }
    },
    [isConnected, client, chatRoomId, employeeId]
  );

  // 메시지 수정
  const updateMessage = useCallback(
    (messageId, newText) => {
      if (isConnected && client && client.active) {
        console.log('Sending message with employeeId:', employeeId);
        client.publish({
          destination: `/app/message/update/${chatRoomId}`,
          body: JSON.stringify({ messageId: messageId, message: newText, employeeId: employeeId }),
        });
      }
    },
    [isConnected, client, chatRoomId, employeeId]
  );

  // 메시지 삭제
  const deleteMessage = useCallback(
    (messageId) => {
      if (isConnected && client && client.active) {
        console.log('Sending message with employeeId:', employeeId);
        client.publish({
          destination: `/app/message/delete/${chatRoomId}`,
          body: JSON.stringify({ messageId: messageId, employeeId: employeeId }),
        });
      }
    },
    [isConnected, client, chatRoomId, employeeId]
  );

  return { sendMessage, updateMessage, deleteMessage, isConnected }; // 연결 상태도 반환
};

export default UseWebSocket;
