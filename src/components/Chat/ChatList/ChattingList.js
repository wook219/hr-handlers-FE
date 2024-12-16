import { useEffect, useState } from 'react';
import { getAllChatRoomAPI } from '../../../api/chat';
import EnterChatRoomButton from '../ChatButtons/EnterChatRoomButton';
import DeleteChatRoomButton from '../ChatButtons/DeleteChatRoomButton';
import './ChattingList.css';
import { useUser } from '../../../context/UserContext';
import TabNavigation from '../ChatTabNavigation';
import CreateChatRoomButton from '../ChatButtons/CreateChatRoomButton';
import { IoClose } from 'react-icons/io5';

const ChattingList = () => {
  const [chatrooms, setChatRooms] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    size: 5,
    pageGroupSize: 5,
  });
  const [search, setSearch] = useState('');
  const { user } = useUser();

  // 페이지네이션 관련 페이지 번호 구하기
  const totalPages = Math.max(1, Math.ceil(pagination.totalElements / pagination.size));
  const currentPageGroup = Math.floor(pagination.currentPage / pagination.pageGroupSize);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        // API 호출 시 page와 size를 파라미터로 전달
        const response = await getAllChatRoomAPI(search, pagination.currentPage, pagination.size);

        setChatRooms(response.data.content);
        setPagination((prevState) => ({
          ...prevState,
          totalElements: response.data.totalElements, // 전체 데이터 수 업데이트
        }));
      } catch (error) {
        console.error('Failed to fetch chatrooms: ', error);
      }
    };

    fetchChatRooms();
  }, [pagination.currentPage, pagination.size, search]);

  const handleDeleteChatRoom = async (chatRoomId) => {
    setChatRooms(
      (prevChatRooms) => prevChatRooms.filter((room) => room.chatRoomId !== chatRoomId) // 삭제된 채팅방을 목록에서 제외
    );
    if (chatrooms.length <= pagination.size) {
      const newPage = pagination.currentPage; // 현재 페이지로 다시 요청
      const response = await getAllChatRoomAPI(search, newPage, pagination.size);

      setChatRooms((prevChatRooms) => [
        ...response.data.content, // 새로운 데이터를 추가
      ]);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({
      ...prev,
      currentPage: 0, // 검색 시 페이지를 0으로 초기화
    }));
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
          {chatrooms && chatrooms.length > 0 ? (
            chatrooms.map((chatroom, index) => (
              <div className="row align-items-center mb-3" key={chatroom.chatRoomId}>
                <div className="col-2 text-center">
                  <span>{index + 1 + pagination.currentPage * pagination.size}</span>
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
            ))
          ) : (
            <div className="no-chatrooms">개설된 채팅방이 없습니다.</div>
          )}
        </div>
      </div>
      {/* 페이지네이션 UI */}
      <div className="pagination mt-3 d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${pagination.currentPage === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(0)} disabled={pagination.currentPage === 0}>
              &laquo;
            </button>
          </li>

          <li className={`page-item ${pagination.currentPage === 0 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 0}
            >
              &lt;
            </button>
          </li>

          {[...Array(pagination.pageGroupSize)].map((_, idx) => {
            const pageIndex = currentPageGroup * pagination.pageGroupSize + idx;
            if (pageIndex >= totalPages) return null;
            return (
              <li key={pageIndex} className={`page-item ${pagination.currentPage === pageIndex ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageIndex)}>
                  {pageIndex + 1}
                </button>
              </li>
            );
          })}

          <li className={`page-item ${pagination.currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= totalPages - 1}
            >
              &gt;
            </button>
          </li>

          <li className={`page-item ${pagination.currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={pagination.currentPage === totalPages - 1}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChattingList;
