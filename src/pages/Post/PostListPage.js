import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPostsAPI, createPostAPI } from "../../api/post";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS import
import "./PostListPage.css"; // 커스텀 CSS import
import PostModal from "./PostModal"; // PostModal 컴포넌트 임포트

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [title, setTitle] = useState(""); // 제목
  const [editorData, setEditorData] = useState(""); // 본문 내용
  const [hashtags, setHashtags] = useState(""); // 해시태그

  // 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPostsAPI();
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

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
      const response = await getAllPostsAPI(); // 게시글 목록 갱신
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">게시판</h2>
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-75"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn custom-button ms-2" // custom-button 클래스 사용
          onClick={() => setShowModal(true)} // 모달 열기
        >
          게시글 작성
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
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
                  <Link to={`/post/${post.id}`} className="text-decoration-none">
                    {post.title}
                  </Link>
                </td>
                <td>
                  {post.hashtagContent.map((tag, index) => (
                    <span key={index} className="badge bg-primary me-1">
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
      {/* PostModal 컴포넌트 */}
      <PostModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleCreatePost}
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
