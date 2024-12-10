import React, { useEffect, useState } from 'react';
import { getAllEnterChatAPI } from '../../../api/chat';
import EnterChatRoomButton from '../ChatButtons/EnterChatRoomButton';
import './ChattingList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaLock } from 'react-icons/fa6';
import TabNavigation from '../ChatTabNavigation';
import CreateChatRoomButton from '../ChatButtons/CreateChatRoomButton';
import { IoClose } from 'react-icons/io5';

const ActiveChatList = () => {
  const [chats, setChats] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    size: 5,
    pageGroupSize: 5,
  });
  const [search, setSearch] = useState('');

  // 페이지네이션 관련 페이지 번호 구하기
  const totalPages = Math.floor(pagination.totalElements / pagination.size);
  const startPage = Math.floor(pagination.currentPage / pagination.pageGroupSize) * pagination.pageGroupSize;
  const endPage = Math.min(startPage + pagination.pageGroupSize - 1, totalPages - 1);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getAllEnterChatAPI(search, pagination.currentPage, pagination.size);

        setChats(response.data.content);
        setPagination((prevState) => ({
          ...prevState,
          totalElements: response.data.totalElements, // 전체 데이터 수 업데이트
        }));
      } catch (error) {
        console.error('Failed to fetch enterChatRooms: ', error);
      }
    };

    fetchChats();
  }, [pagination.currentPage, pagination.size, search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPagination((prevState) => ({
        ...prevState,
        currentPage: newPage,
      }));
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch(''); // 검색어 초기화
  };

  return (
    <div>
      <div className="create-chatroom-container">
        <CreateChatRoomButton />
      </div>
      <div className="chat-tabs-container">
        <TabNavigation />
        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="chatroom-search-input"
              placeholder="채팅방 검색"
              value={search}
              onChange={handleSearchChange}
            />
            {search && <IoClose className="clear-search-icon" onClick={handleClearSearch} aria-label="Clear search" />}
          </div>
        </div>
      </div>

      <div className="chatting-list-container">
        <div className="chatting-list">
          {chats.map((chat, index) => (
            <div className="row align-items-center mb-3" key={index}>
              <div className="col-2 text-center">
                <span>{index + 1 + pagination.currentPage * pagination.size}</span>
              </div>

              <div className="col-7">
                <span className="chatroom-list-title">
                  {chat.title}
                  {chat.isSecret === 'Y' && <FaLock className="chat-secret-icon" />}
                </span>
              </div>

              <div className="col-3 text-center">
                <EnterChatRoomButton chatRoomId={chat.chatRoomId} title={chat.title} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 페이지네이션 UI */}
      <div className="chatroom-pagination">
        {/* 이전 페이지 버튼 */}
        <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 0}>
          이전
        </button>

        {/* 페이지 그룹 */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={pagination.currentPage === page ? 'active' : ''}
          >
            {page + 1}
          </button>
        ))}

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ActiveChatList;
