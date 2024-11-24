import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPostsAPI } from "../../api/post";
import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS import
import "./PostListPage.css"; // 커스텀 CSS import

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPosts = posts.filter((post) =>
    post.title.includes(searchTerm)
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">게시판</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
    </div>
  );
};

export default PostListPage;
