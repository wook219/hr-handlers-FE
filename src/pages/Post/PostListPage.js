import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPostsAPI, createPostAPI } from "../../api/post";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PostListPage.css";
import PostModal from "./PostModal";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalElements: 0,
    size: 5,
    pageGroupSize: 5,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [modalState, setModalState] = useState({
    show: false,
    title: "",
    editorData: "",
    hashtags: "",
  });

  // 게시글 목록 가져오기
  useEffect(() => {
    fetchPosts(pagination.currentPage, pagination.size);
  }, [pagination.currentPage, pagination.size]);

  const fetchPosts = async (page, size) => {
    try {
      const response = await getAllPostsAPI(page, size);
      setPosts(response.data.posts);
      setPagination((prev) => ({
        ...prev,
        totalElements: response.data.totalElements,
      }));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  // 게시글 생성
  const handleCreatePost = async (postData) => {
    try {
      const hashtagArray = modalState.hashtags.split(",").map((tag) => tag.trim());
      const newPost = {
        title: modalState.title,
        employeeId: 2,
        content: postData.content,
        hashtagContent: hashtagArray,
      };

      await createPostAPI(newPost);
      handleCloseModal();
      fetchPosts(pagination.currentPage, pagination.size);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalState({
      show: false,
      title: "",
      editorData: "",
      hashtags: "",
    });
  };

  // 페이지네이션 핸들러
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const totalPages = Math.ceil(pagination.totalElements / pagination.size);
  const currentPageGroup = Math.floor(pagination.currentPage / pagination.pageGroupSize);

  // 검색 필터
  const filteredPosts = posts.filter((post) => post.title.includes(searchTerm));

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
          onClick={() =>
            setModalState((prev) => ({ ...prev, show: true }))
          }
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
            {filteredPosts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1 + pagination.currentPage * pagination.size}</td>
                <td>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-decoration-none post-link"
                  >
                    {post.title}
                  </Link>
                </td>
                <td>
                  {post.hashtagContent.map((tag, idx) => (
                    <span
                      key={idx}
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
          <li
            className={`page-item ${pagination.currentPage === 0 ? "disabled" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(0)}
              disabled={pagination.currentPage === 0}
            >
              &laquo;
            </button>
          </li>

          <li
            className={`page-item ${
              currentPageGroup === 0 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                handlePageChange((currentPageGroup - 1) * pagination.pageGroupSize)
              }
              disabled={currentPageGroup === 0}
            >
              &lt;
            </button>
          </li>

          {[...Array(pagination.pageGroupSize)].map((_, idx) => {
            const pageIndex = currentPageGroup * pagination.pageGroupSize + idx;
            if (pageIndex >= totalPages) return null;
            return (
              <li
                key={pageIndex}
                className={`page-item ${
                  pagination.currentPage === pageIndex ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageIndex)}
                >
                  {pageIndex + 1}
                </button>
              </li>
            );
          })}

          <li
            className={`page-item ${
              currentPageGroup === Math.floor(totalPages / pagination.pageGroupSize)
                ? "disabled"
                : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() =>
                handlePageChange((currentPageGroup + 1) * pagination.pageGroupSize)
              }
              disabled={
                currentPageGroup ===
                Math.floor(totalPages / pagination.pageGroupSize)
              }
            >
              &gt;
            </button>
          </li>

          <li
            className={`page-item ${
              pagination.currentPage === totalPages - 1 ? "disabled" : ""
            }`}
          >
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

      {/* PostModal 컴포넌트 */}
      <PostModal
        show={modalState.show}
        handleClose={handleCloseModal}
        handleSubmit={handleCreatePost}
        title={modalState.title}
        setTitle={(title) =>
          setModalState((prev) => ({ ...prev, title }))
        }
        editorData={modalState.editorData}
        setEditorData={(editorData) =>
          setModalState((prev) => ({ ...prev, editorData }))
        }
        hashtags={modalState.hashtags}
        setHashtags={(hashtags) =>
          setModalState((prev) => ({ ...prev, hashtags }))
        }
      />
    </div>
  );
};

export default PostListPage;
