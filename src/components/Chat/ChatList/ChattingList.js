import { useEffect, useState } from 'react';
import { getAllChatRoomAPI } from '../../../api/chat';
import EnterChatRoomButton from '../ChatButtons/EnterChatRoomButton';
import DeleteChatRoomButton from '../ChatButtons/DeleteChatRoomButton';
import './ChattingList.css';
import { useUser } from '../../../context/UserContext';

const ChattingList = () => {
  const [chatrooms, setChatRooms] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    size: 5,
    pageGroupSize: 5,
  });
  const { user } = useUser();

  // 페이지네이션 관련 페이지 번호 구하기
  const totalPages = Math.ceil(pagination.totalElements / pagination.size);
  const startPage = Math.floor(pagination.currentPage / pagination.pageGroupSize) * pagination.pageGroupSize;
  const endPage = Math.min(startPage + pagination.pageGroupSize - 1, totalPages - 1);

  useEffect(() => {
    const fetchChatRooms = async (search = '') => {
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
  }, [pagination.currentPage, pagination.size]);

  const handleDeleteChatRoom = (chatRoomId) => {
    setChatRooms(
      (prevChatRooms) => prevChatRooms.filter((room) => room.chatRoomId !== chatRoomId) // 삭제된 채팅방을 목록에서 제외
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPagination((prevState) => ({
        ...prevState,
        currentPage: newPage,
      }));
    }
  };

  return (
    <div>
      <div className="chatting-list-container">
        <div className="chatting-list">
          {chatrooms.map((chatroom, index) => (
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

export default ChattingList;
