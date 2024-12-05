import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import { getAllNoticesAPI } from "../../api/home"; // 공지사항 API
import PostModal from "../Post/PostModal"; // 모달 컴포넌트
import { createPostAPI } from "../../api/post";

const Home = () => {
  const [notices, setNotices] = useState([]); // 공지사항 목록 상태
  const [isExpanded, setIsExpanded] = useState(false); // 공지사항 펼치기 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [modalData, setModalData] = useState({
    title: "",
    editorData: "",
    hashtags: "공지사항", // 공지사항 해시태그 기본값
  });

  useEffect(() => {
    fetchNotices(); // 컴포넌트 로드 시 공지사항 가져오기
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await getAllNoticesAPI(); // 공지사항 가져오기 API 호출
      setNotices(response.data.posts); // 공지사항 상태 업데이트 (posts 배열 사용)
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    }
  };

  const toggleNotices = () => {
    setIsExpanded((prev) => !prev); // 펼치기/접기 토글
  };

  const handleAddNotice = () => {
    setModalData({ title: "", editorData: "", hashtags: "공지사항" }); // 모달 초기화
    setIsModalOpen(true); // 모달 열기
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleModalSubmit = async (postData) => {
    try {
      // 공지사항 데이터를 생성
      const noticeData = {
        title: postData.title,
        content: postData.content,
        hashtags: postData.hashtags,
        postType: "NOTICE", // 공지사항 타입 고정
      };

      // createPostAPI 호출
      const response = await createPostAPI(noticeData);
      console.log("공지사항 생성 성공:", response.data);

      // 모달 닫기 및 공지사항 목록 새로고침
      handleModalClose();
      fetchNotices();
    } catch (error) {
      console.error("Failed to submit notice:", error);
    }
  };

  return (
    <div className="home-notice-container">
      <div className="home-notice-card shadow-sm rounded">
        <div className="home-notice-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">공지사항</h5>
          <div className="d-flex align-items-center">
            <div className="add-notice-btn me-3">
              <button onClick={handleAddNotice}>작성</button>
            </div>
            <span
              className={`notice-arrow ${
                isExpanded ? "arrow-up" : "arrow-down"
              }`}
              onClick={toggleNotices}
              style={{ cursor: "pointer" }}
            ></span>
          </div>
        </div>
        <div className="divider"></div>
        {isExpanded && (
          <div className="home-notice-body mt-3">
            {notices.length > 0 ? (
              <ul className="list-unstyled">
                {notices.map((notice) => (
                  <li key={notice.id} className="home-notice-item">
                    <div className="d-flex align-items-center">
                      <span className="me-2">📢</span>
                      <span>{notice.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">등록된 공지사항이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 모달 컴포넌트 */}
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
          isNotice={true} // 공지사항 모드 활성화
        />
      )}
    </div>
  );
};

export default Home;
