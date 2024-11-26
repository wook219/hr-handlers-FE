import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPostsAPI, createPostAPI } from "../../api/post";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS import
import "./PostListPage.css"; // 커스텀 CSS import
import PostModal from "./PostModal"; // PostModal 컴포넌트 임포트

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [totalElements, setTotalElements] = useState(0); // 총 게시글 수
  const [size, setSize] = useState(5); // 한 페이지에 표시할 게시글 수
  const [title, setTitle] = useState(""); // 제목
  const [editorData, setEditorData] = useState(""); // 본문 내용
  const [hashtags, setHashtags] = useState(""); // 해시태그

  // 게시글 목록 가져오기
  useEffect(() => {
    fetchPosts(currentPage, size); // 초기 페이지 로드
  }, [currentPage, size]);

  const fetchPosts = async (page, size) => {
    try {
      const response = await getAllPostsAPI(page, size);
      setPosts(response.data.posts); // 게시글 목록 설정
      setTotalElements(response.data.totalElements); // 총 게시글 수 설정
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // 게시글 생성
  const handleCreatePost = async () => {
    try {
      const hashtagArray = hashtags.split(",").map((tag) => tag.trim());
      const newPost = {
        title,
        employeeId: 2, // 테스트용 임의 값, 실제 값은 로그인 사용자 정보로 대체
        content: editorData,
        hashtagContent: hashtagArray,
        imageUrl: "https://example.com/image.jpg", // 임시 이미지 URL
      };
      await createPostAPI(newPost); // API 호출
      handleCloseModal(); // 모달 닫기
      fetchPosts(currentPage, size); // 게시글 목록 갱신
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // 검색 필터
  const filteredPosts = posts.filter((post) =>
    post.title.includes(searchTerm)
  );

  // 모달 닫기
  const handleCloseModal = () => {
    setShowModal(false);
    setTitle("");
    setEditorData("");
    setHashtags("");
  };

  // 페이지네이션 핸들러
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="post-container container mt-5">
      <h2 className="post-title mb-4">게시판</h2>
      <div className="post-controls mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control post-search-input w-75"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn post-create-btn ms-2"
          onClick={() => setShowModal(true)}
        >
          게시글 작성
        </button>
      </div>
      <div className="post-table-responsive">
        <table className="table post-table table-hover align-middle">
          <thead className="post-table-light">
            <tr>
              <th scope="col">글 번호</th>
              <th scope="col">제목</th>
              <th scope="col">해시태그</th>
              <th scope="col">작성자</th>
              <th scope="col">작성일</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-decoration-none post-link"
                  >
                    {post.title}
                  </Link>
                </td>
                <td>
                  {post.hashtagContent.map((tag, index) => (
                    <span
                      key={index}
                      className="badge bg-primary post-tag me-1"
                    >
                      #{tag}
                    </span>
                  ))}
                </td>
                <td>{post.employeeName}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 UI */}
      <div className="pagination mt-3 d-flex justify-content-center">
        <ul className="pagination">
          {/* 이전 페이지 버튼 */}
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
          </li>

          {/* 페이지 번호 */}
          {[...Array(Math.ceil(totalElements / size))].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </button>
            </li>
          ))}

          {/* 다음 페이지 버튼 */}
          <li
            className={`page-item ${
              currentPage === Math.ceil(totalElements / size) - 1
                ? "disabled"
                : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalElements / size) - 1}
            >
              &gt;
            </button>
          </li>
        </ul>
      </div>

      {/* PostModal 컴포넌트 */}
      <PostModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleCreatePost} // 게시글 생성 후 목록 갱신
        title={title}
        setTitle={setTitle}
        editorData={editorData}
        setEditorData={setEditorData}
        hashtags={hashtags}
        setHashtags={setHashtags}
      />
    </div>
  );
};

export default PostListPage;
