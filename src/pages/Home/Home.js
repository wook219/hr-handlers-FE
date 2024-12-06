import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import { getAllNoticesAPI } from "../../api/home"; // 공지사항 API
import PostModal from "../Post/PostModal"; // 모달 컴포넌트
import { useUser } from '../../context/UserContext';
import {
  createPostAPI,
  getPostDetailAPI,
  updatePostAPI,
  deletePostAPI,
} from "../../api/post";

const Home = () => {
  const { user } = useUser();
  
  const [notices, setNotices] = useState([]); // 공지사항 목록 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalData, setModalData] = useState({
    title: "",
    editorData: "",
    hashtags: "공지사항", // 공지사항 해시태그 기본값
  });
  const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
  const [currentEditingId, setCurrentEditingId] = useState(null); // 현재 수정 중인 공지사항 ID
  const [expandedNoticeId, setExpandedNoticeId] = useState(null); // 확장된 공지사항 ID
  const [expandedNoticeContent, setExpandedNoticeContent] = useState(""); // 확장된 공지사항 내용

  const noticesPerPage = 5; // 페이지당 공지사항 개수

  const fetchNotices = async () => {
    try {
      const response = await getAllNoticesAPI(currentPage);
      if (response && response.data && response.data.posts) {
        setNotices(response.data.posts);
        // 전체 페이지 수 계산 (백엔드에서 제공하지 않는 경우)
        const totalElements = response.data.totalElements || response.data.posts.length;
        const calculatedTotalPages = Math.ceil(totalElements / noticesPerPage);
        setTotalPages(calculatedTotalPages);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const handleAddNotice = () => {
    setIsEditMode(false);
    setModalData({ title: "", editorData: "", hashtags: "공지사항" });
    setIsModalOpen(true);
  };

  const handleEditNotice = async (id) => {
    try {
      const response = await getPostDetailAPI(id);
      setIsEditMode(true);
      setCurrentEditingId(id);
      setModalData({
        title: response.data.title,
        editorData: response.data.content,
        hashtags: "공지사항",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error(`Failed to fetch notice for editing (ID: ${id}):`, error);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        await deletePostAPI(id);
        fetchNotices();
      } catch (error) {
        console.error(`Failed to delete notice (ID: ${id}):`, error);
      }
    }
  };

  const handleModalSubmit = async (postData) => {
    try {
      const noticeData = {
        title: postData.title,
        content: postData.content,
        hashtags: postData.hashtags,
        postType: "NOTICE",
      };
  
      if (isEditMode && currentEditingId) {
        await updatePostAPI(currentEditingId, noticeData);
        console.log("공지사항 수정 성공");
  
        setNotices((prevNotices) =>
          prevNotices.map((notice) =>
            notice.id === currentEditingId
              ? { ...notice, title: noticeData.title }
              : notice
          )
        );

        if (expandedNoticeId === currentEditingId) {
          setExpandedNoticeContent(noticeData.content);
        }
      } else {
        const response = await createPostAPI(noticeData);
        console.log("공지사항 생성 성공");
  
        setNotices((prevNotices) => [
          { id: response.data.id, title: noticeData.title, ...noticeData },
          ...prevNotices,
        ]);
      }   
      setCurrentPage(0);
      handleModalClose();  
      fetchNotices();
    } catch (error) {
      console.error("Failed to submit notice:", error);
    }
  };  

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentEditingId(null);
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleNoticeContent = async (id) => {
    if (expandedNoticeId === id) {
      setExpandedNoticeId(null);
      setExpandedNoticeContent("");
    } else {
      try {
        const response = await getPostDetailAPI(id);
        setExpandedNoticeId(id);
        setExpandedNoticeContent(response.data.content);
      } catch (error) {
        console.error(`Failed to fetch notice content (ID: ${id}):`, error);
      }
    }
  };

  return (
    <div className="home-notice-container">
      <div className="home-notice-card shadow-sm rounded">
        <div className="home-notice-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">공지사항</h5>
          {user.role === 'ROLE_ADMIN' && (
          <div className="d-flex align-items-center">
            <div className="add-notice-btn me-3">
              <button onClick={handleAddNotice}>작성</button>
            </div>
          </div>
            )}
        </div>
        <div className="divider"></div>
        <div className="home-notice-body mt-3">
          {notices.length > 0 ? (
            <ul className="list-unstyled">
              {notices.map((notice) => (
                <li key={notice.id} className="home-notice-item">
                  <div
                    className="d-flex justify-content-between align-items-center"
                    onClick={() => toggleNoticeContent(notice.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="notice-icon">📢</span>
                      <span>{notice.title}</span>
                    </div>
                    {user.role === 'ROLE_ADMIN' && (
                    <div>
                      <span
                        className="edit-btn me-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNotice(notice.id);
                        }}
                        style={{ cursor: "pointer", color: "#007bff" }}
                      >
                        수정
                      </span>
                      <span
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotice(notice.id);
                        }}
                        style={{ cursor: "pointer", color: "red" }}
                      >
                        삭제
                      </span>
                    </div>
                    )}
                  </div>
                  {expandedNoticeId === notice.id && (
                    <div
                      className="notice-content mt-2"
                      dangerouslySetInnerHTML={{
                        __html: expandedNoticeContent,
                      }}
                    ></div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">등록된 공지사항이 없습니다.</p>
          )}
        </div>
        <div className="pagination-controls text-center mt-3">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 0}
          >
            {"<"}
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages - 1}
          >
            {">"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <PostModal
          show={isModalOpen}
          handleClose={handleModalClose}
          handleSubmit={handleModalSubmit}
          title={modalData.title}
          setTitle={(title) =>
            setModalData((prev) => ({ ...prev, title }))
          }
          editorData={modalData.editorData}
          setEditorData={(editorData) =>
            setModalData((prev) => ({ ...prev, editorData }))
          }
          isNotice={true}
        />
      )}
    </div>
  );
};

export default Home;