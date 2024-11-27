import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetailAPI } from '../../api/post';
import './PostDetailPage.css';

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState(''); // 댓글 입력 상태
    const [comments, setComments] = useState([]); // 댓글 리스트 (더미 데이터)

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await getPostDetailAPI(postId);
                setPost(response.data);
                // 임시 댓글 데이터
                setComments([
                    { id: 1, author: 'hello123', content: '네, 익명 아니더라구요...', createdAt: '2024.11.18 오후 14:50' },
                    { id: 2, author: 'hello123', content: '다시 보니 정말 재밌네요!', createdAt: '2024.11.18 오후 14:51' },
                ]);
            } catch (error) {
                console.error('Failed to fetch post detail:', error);
            }
        };

        fetchPostDetail();
    }, [postId]);

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
