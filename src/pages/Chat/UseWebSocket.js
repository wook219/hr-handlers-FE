import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';

const UseWebSocket = (chatRoomId, onMessageReceived) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!chatRoomId) return;

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
        stompClient.subscribe(`/topic/message/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          if (typeof onMessageReceived === 'function' && receivedMessage.message) {
            onMessageReceived(receivedMessage);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
      }
    };
  }, [chatRoomId, onMessageReceived]);

  const sendMessage = useCallback(
    (message) => {
      if (client && client.active) {
        client.publish({
          destination: `/app/message/${chatRoomId}`,
          body: JSON.stringify(message),
        });
      } else {
        console.error('WebSocket 연결이 되어 있지 않습니다.');
      }
    },
    [client, chatRoomId]
  );

  return { sendMessage };
};

export default UseWebSocket;
