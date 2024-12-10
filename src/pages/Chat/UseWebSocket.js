import { Client } from '@stomp/stompjs';
import { useState, useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';

const UseWebSocket = (chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted, empNo) => {
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

        // 메시지 전송
        stompClient.subscribe(`/topic/message/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          if (typeof onMessageReceived === 'function' && receivedMessage.message) {
            onMessageReceived(receivedMessage);
          }
        });

        // 메시지 수정
        stompClient.subscribe(`/topic/message/update/${chatRoomId}`, (updateMsg) => {
          const updatedMessage = JSON.parse(updateMsg.body);
          if (typeof onMessageUpdated === 'function') {
            onMessageUpdated(updatedMessage);
          }
        });

        // 메시지 삭제
        stompClient.subscribe(`/topic/message/delete/${chatRoomId}`, (deleteMsg) => {
          const deletedMessageId = JSON.parse(deleteMsg.body);
          if (typeof onMessageDeleted === 'function') {
            onMessageDeleted(deletedMessageId);
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
  }, [chatRoomId, onMessageReceived, onMessageUpdated, onMessageDeleted, empNo]);

  const sendMessage = useCallback(
    (message) => {
      if (client && client.active) {
        client.publish({
          destination: `/app/message/${chatRoomId}`,
          body: JSON.stringify({ ...message, empNo: empNo }),
        });
      } else {
        console.error('WebSocket 연결이 되어 있지 않습니다.');
      }
    },
    [client, chatRoomId, empNo]
  );

  const updateMessage = useCallback(
    (messageId, newText) => {
      if (client && client.active) {
        client.publish({
          destination: `/app/message/update/${chatRoomId}`,
          body: JSON.stringify({ messageId: messageId, chatRoomId: chatRoomId, message: newText, empNo: empNo }),
        });
      }
    },
    [client, chatRoomId, empNo]
  );

  const deleteMessage = useCallback(
    (messageId) => {
      if (client && client.active) {
        client.publish({
          destination: `/app/message/delete/${chatRoomId}`,
          body: JSON.stringify({ messageId: messageId, chatRoomId: chatRoomId, empNo: empNo }),
        });
      }
    },
    [client, chatRoomId, empNo]
  );

  return { sendMessage, updateMessage, deleteMessage };
};

export default UseWebSocket;
