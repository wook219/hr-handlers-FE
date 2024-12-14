import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UseWebSocket from './UseWebSocket';
import ChatMessage from './ChatMessage';
import ChatRoomHeader from '../../components/Chat/ChatRoomHeader';
import ActiveChatList from '../../components/Chat/ChatList/ActiveChatList';
import { getChatMessagesAPI, getJoinedEmployeesCount } from '../../api/chat';
import { getEmpNoFromToken } from '../../utils/tokenUtils';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SendFill, Calendar2WeekFill } from 'react-bootstrap-icons';
import './ChatRoom.css';
import ExitChatRoomModal from '../../components/Chat/ChatModals/ExitChatRoomModal';
import ChatParticipantsModal from '../../components/Chat/ChatModals/ChatParticipantsModal';
import { exitChatRoomAPI } from '../../api/chat';
import InviteChatRoomModal from '../../components/Chat/ChatModals/InviteChatRoomModal';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const ChatRoom = () => {
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [employeeCount, setEmployeeCount] = useState(0);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [empNo, setEmpNo] = useState('');
  const [messageInput, setMessageInput] = useState([]);
  const [title, setTitle] = useState('');
  const location = useLocation(); // useLocation 훅을 사용하여 state에 접근
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  // 모달 통합
  const [modal, setModal] = useState({
    showExitModal: false,
    showParticipantsModal: false,
    showInviteModal: false,
  });

  const fetchEmployeeCount = async () => {
    try {
      const response = await getJoinedEmployeesCount(chatRoomId);
      setEmployeeCount(response.data);
    } catch (error) {
      console.error('직원 수를 가져오는데 실패했습니다.', error);
    }
  };

  // 초대 후 참여자 수를 1 증가시키는 함수
  const handleInviteSuccess = () => {
    setEmployeeCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    fetchEmployeeCount();
  }, [chatRoomId]);

  const handleClickMenu = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setContextMenu({ mouseX, mouseY });
  };

  // ContextMenu 영역 외의 곳을 클릭하면 메뉴를 닫는 이벤트 처리
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null); // ContextMenu 외의 곳을 클릭했을 경우 메뉴를 닫음
      }
    };

    document.addEventListener('mousedown', handleOutsideClick); // 클릭 시 이벤트 리스너 추가

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick); // 컴포넌트 언마운트 시 이벤트 리스너 정리
    };
  }, [contextMenu]); // contextMenu가 변할 때마다 실행되도록 설정

  // 채팅방 퇴장 모달 컴포넌트 실행
  const handleExitChatRoom = () => {
    setModal((prevState) => ({ ...prevState, showExitModal: true }));
  };

  const handleCloseModal = () => {
    setModal((prevState) => ({ ...prevState, showExitModal: false }));
  };

  const handleConfirmExit = async () => {
    const response = await exitChatRoomAPI(chatRoomId);
    setModal((prevState) => ({ ...prevState, showExitModal: false }));
  };

  // 채팅방 참여 목록 모달 컴포넌트
  const handleParticipants = () => {
    setModal((prevState) => ({ ...prevState, showParticipantsModal: true }));
  };
  const handleCloseParticipants = () => {
    setModal((prevState) => ({ ...prevState, showParticipantsModal: false }));
  };

  // 채팅방 초대 목록 모달 컴포넌트
  const handleInvite = () => {
    setModal((prevState) => ({ ...prevState, showInviteModal: true }));
  };
  const handleCloseInvite = () => {
    setModal((prevState) => ({ ...prevState, showInviteModal: false }));
  };

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
    setMessages((prevMessages) => {
      const tempIndex = prevMessages.findIndex((msg) => msg.isTemp && msg.text === message.message);

      if (tempIndex !== -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[tempIndex] = {
          ...message,
          id: message.messageId,
          text: message.message,
          name: message.employeeName,
          timestamp: message.createdAt,
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
            timestamp: message.createdAt,
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

        const formattedMessages = chatMessages.data.map((msg) => ({
          id: msg.messageId,
          text: msg.message,
          name: msg.employeeName,
          empNo: msg.empNo,
          sent: msg.empNo === empNo,
          received: msg.empNo !== empNo,
          timestamp: new Date(msg.createdAt),
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

  // 메시지 불러오기 후 날짜별 그룹화
  const groupMessagesByDate = (messages) => {
    const groupedMessages = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const messageDate = new Date(message.timestamp);
      const formattedDate = formatDate(messageDate); // 날짜 포맷팅 함수

      // 첫 번째 메시지이거나 이전 메시지와 날짜가 다르면 날짜를 표시
      if (i === 0 || formattedDate !== formatDate(new Date(messages[i - 1].timestamp))) {
        groupedMessages.push({
          date: formattedDate,
          messages: [message],
        });
      } else {
        groupedMessages[groupedMessages.length - 1].messages.push(message);
      }
    }

    return groupedMessages;
  };

  // 날짜 포맷팅 함수: 2024년 12월 3일 화요일 형식
  const formatDate = (timestamp) => {
    const messageDate = dayjs(timestamp).locale('ko');

    return messageDate.format('YYYY년 M월 D일 dddd');
  };

  // 메시지 불러오기 후 날짜별 그룹화
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chatroom-page">
      <div className="chatroom-list-all-container mt-5">
        <ActiveChatList />
      </div>
      <div className="chatroom-entire-container">
        <ChatRoomHeader title={title} handleClickMenu={handleClickMenu} employeeCount={employeeCount} />
        <div className="chatroom-page-container">
          <div ref={chatBodyRef} className="chat-body">
            {groupedMessages.map((group, index) => (
              <div key={index} className="message-group">
                {/* 날짜를 상단에 표시 */}
                <div className="message-date">
                  <Calendar2WeekFill className="chat-calendar-icon" /> {group.date}
                </div>
                {/* 각 날짜 그룹에 속한 메시지들을 렌더링 */}
                {group.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.text}
                    name={message.name}
                    empNo={message.empNo}
                    messageId={message.id}
                    timestamp={message.timestamp}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                    selectedMessageId={selectedMessageId}
                    setSelectedMessageId={setSelectedMessageId}
                  />
                ))}
              </div>
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

          {/* ContextMenu */}
          {contextMenu && (
            <div
              ref={contextMenuRef}
              style={{
                position: 'absolute',
                top: contextMenu.mouseY,
                left: contextMenu.mouseX,
                zIndex: 10,
              }}
              className="context-menu"
            >
              <div onClick={handleInvite}>채팅 초대</div>
              <div onClick={handleParticipants}>참가자 목록</div>
              <div onClick={handleExitChatRoom}>퇴장</div>
            </div>
          )}
        </div>
      </div>
      <InviteChatRoomModal
        show={modal.showInviteModal}
        handleClose={handleCloseInvite}
        chatRoomId={chatRoomId}
        onInviteSuccess={handleInviteSuccess}
      />

      <ExitChatRoomModal show={modal.showExitModal} handleClose={handleCloseModal} handleExit={handleConfirmExit} />

      <ChatParticipantsModal
        show={modal.showParticipantsModal}
        handleClose={handleCloseParticipants}
        chatRoomId={chatRoomId}
      />
    </div>
  );
};

export default ChatRoom;
