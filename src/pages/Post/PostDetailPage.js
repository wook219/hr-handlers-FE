import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostDetailAPI , updatePostAPI, deletePostAPI } from '../../api/post';
import './PostDetailPage.css';
import { getEmpNoFromToken } from '../../utils/tokenUtils';
import PostModal from "./PostModal"; // PostModal 컴포넌트 가져오기

const PostDetailPage = () => {
    const navigate = useNavigate(); // useNavigate 훅 선언
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isAuthor, setIsAuthor] = useState(false); // 작성자 여부 확인 상태
    const [isModalOpen, setModalOpen] = useState(false); // 모달 열림 상태
    const [title, setTitle] = useState("");
    const [editorData, setEditorData] = useState("");
    const [hashtags, setHashtags] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 게시글 정보 가져오기
                const postResponse = await getPostDetailAPI(postId);
                setPost(postResponse.data);
                setTitle(postResponse.data.title);
                setEditorData(postResponse.data.content);
                setHashtags(postResponse.data.hashtagContent.join(", "));

                // JWT에서 empNo 추출
                const empNo = getEmpNoFromToken();
                if (!empNo) throw new Error('JWT에서 empNo를 추출하지 못했습니다.');

                // 게시글 작성자와 현재 로그인한 사용자 비교
                setIsAuthor(postResponse.data.employeeEmpNo === empNo);

                // 더미 댓글 데이터 추가
                setComments([
                    { id: 1, author: 'hello123', content: '네, 익명 아니더라구요...', createdAt: '2024.11.18 오후 14:50' },
                    { id: 2, author: 'hello123', content: '다시 보니 정말 재밌네요!', createdAt: '2024.11.18 오후 14:51' },
                ]);
            } catch (error) {
                console.error('데이터 요청 실패:', error);
            }
        };

        fetchData();
    }, [postId]);

    const handleEditClick = () => {
        setModalOpen(true); // 모달 열기
      };
    
      const handleModalClose = () => {
        setModalOpen(false); // 모달 닫기
      };

    const handlePostDelete = async () => {
        if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return; // 삭제 확인 대화상자
        try {
            await deletePostAPI(postId); // 삭제 API 호출
            alert("게시글이 성공적으로 삭제되었습니다.");
            navigate("/post"); // 삭제 후 메인 페이지로 리다이렉트
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            alert("게시글 삭제에 실패했습니다.");
        }
    };
    
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        const newComment = {
            id: comments.length + 1,
            author: '익명 사용자',
            content: comment,
            createdAt: new Date().toLocaleString(),
        };
        setComments([...comments, newComment]);
        setComment('');
    };

    const handleCommentCancel = () => {
        setComment('');
    };


    const handlePostUpdate = async () => {
        const updatedPost = {
        title,
        content: editorData,
        hashtagContent: hashtags.split(",").map((tag) => tag.trim()),
        };

        try {
        await updatePostAPI(postId, updatedPost);
        alert("게시글이 성공적으로 수정되었습니다!");
        setPost({ ...post, ...updatedPost });
        setModalOpen(false); // 모달 닫기
        } catch (error) {
        console.error("게시글 수정 실패:", error);
        alert("게시글 수정에 실패했습니다.");
        }
    };


    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <div className="post-detail-container">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-meta">
                작성자: {post.employeeName || '알 수 없음'} | 작성일: {new Date(post.createdAt).toLocaleString()}
            </p>
            <div className="post-content">
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="ckeditor-content"
                />
                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="Post illustration"
                        className="post-image"
                    />
                )}
            </div>
                <div className="post-actions">
                    <button className="edit-button" onClick={handleEditClick}>수정</button>
                    <button className="delete-button" onClick={handlePostDelete}>삭제</button>
                </div>
                <PostModal
                    show={isModalOpen}
                    handleClose={handleModalClose}
                    handleSubmit={handlePostUpdate}
                    title={title}
                    setTitle={setTitle}
                    editorData={editorData}
                    setEditorData={setEditorData}
                    hashtags={hashtags}
                    setHashtags={setHashtags}
                    isEditMode={true} // 수정 모드 활성화
                />
            <hr />
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="comment-input"
                    required
                ></textarea>
                <div className="comment-buttons">
                    <button type="button" className="comment-cancel-button" onClick={handleCommentCancel}>
                        취소
                    </button>
                    <button type="submit" className="comment-submit-button">
                        등록
                    </button>
                </div>
            </form>
            <section className="comments-section">
                <h5>댓글</h5>
                {comments.length > 0 ? (
                    <ul className="comments-list">
                        {comments.map((c) => (
                            <li key={c.id} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-author">{c.author}</span>
                                    <span className="comment-date">{c.createdAt}</span>
                                </div>
                                <p className="comment-content">{c.content}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-comments">댓글이 없습니다.</p>
                )}
            </section>
        </div>
    );
};

export default PostDetailPage;
