import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getPostDetailAPI,
    updatePostAPI,
    deletePostAPI,
    getCommentsByPostAPI,
    createCommentAPI,
    updateCommentAPI,
    deleteCommentAPI,
} from '../../api/post';
import './PostDetailPage.css';
import { useUser } from '../../context/UserContext';
import PostModal from './PostModal';
import { useToast } from '../../context/ToastContext';

const CommentItem = ({ comment, onReply, onDelete, onUpdate }) => {
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(comment.content);

    return (
        <li key={comment.id} className="comment-item">
            <div className="comment-header">
                <span className="comment-employeeName">{comment.employeeName}</span>
                <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </span>
            </div>
            {isEditing ? (
                <textarea
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    className="comment-input"
                />
            ) : (
                <p className="comment-content">{comment.content}</p>
            )}
            <div className="comment-actions">
                <div className="comment-reply">
                    <button className="reply-button" onClick={() => onReply(comment.id)}>
                        답글 달기
                    </button>
                </div>
                {(user.name === comment.employeeName || user.role === 'ROLE_ADMIN') && (
                    <div className="comment-edit-delete">
                       {user.name === comment.employeeName && isEditing ? (
                            <>
                                <button
                                    className="reply-button"
                                    onClick={() => {
                                        onUpdate(comment.id, updatedContent);
                                        setIsEditing(false);
                                    }}
                                >
                                    저장
                                </button>
                                <button
                                    className="reply-button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setUpdatedContent(comment.content);
                                    }}
                                >
                                    취소
                                </button>
                            </>
                        ) : (
                            <>
                             {user.name === comment.employeeName && (
                                <button
                                    className="reply-button"
                                    onClick={() => setIsEditing(true)}
                                >
                                    수정
                                </button>
                                   )}
                                <button
                                    className="reply-button"
                                    onClick={() => onDelete(comment.id)}
                                >
                                    삭제
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            {comment.replies?.length > 0 && (
                <ul className="nested-comment">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const PostDetailPage = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { postId } = useParams();
    const { user } = useUser();
    const contentRef = useRef(null);
    const [replyToId, setReplyToId] = useState(null);

    const [post, setPost] = useState({
        title: '',
        content: '',
        hashtags: '',
        isAuthor: false,
    });

    const [comments, setComments] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalElements: 0,
        size: 5,
    });

    const [commentInput, setCommentInput] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.innerHTML = post.content;
        }
    }, [post.content]);

    useEffect(() => {
        fetchComments(pagination.currentPage, pagination.size);
    }, [pagination.currentPage]);

    useEffect(() => {
        fetchData();
    }, [postId, user.name]);

    const fetchData = async () => {
        try {
            const postResponse = await getPostDetailAPI(postId);
            const { data } = postResponse;
            const isAuthor = data.employeeName === user.name;

            setPost({
                ...data,
                hashtags: data.hashtagContent.join(', '),
                isAuthor,
            });

            fetchComments(pagination.currentPage, pagination.size);
        } catch (error) {
            console.error('데이터 요청 실패:', error);
        }
    };

    const fetchComments = async (page, size) => {
        try {
            const response = await getCommentsByPostAPI(postId, page, size);
            const { content, totalElements } = response.data;

            const formattedComments = content.map((comment) => ({
                ...comment,
                createdAt: new Date(comment.createdAt),
            }));

            setComments(formattedComments);
            setPagination((prev) => ({
                ...prev,
                totalElements,
                currentPage: page,
            }));
        } catch (error) {
            console.error('댓글 요청 실패:', error);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: newPage,
        }));
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!user.empNo) {
            showToast('로그인이 필요합니다.', 'warning');
            return;
        }

        try {
            await createCommentAPI(postId, {
                content: commentInput,
                parentCommentId: replyToId,
            });

            fetchComments(pagination.currentPage, pagination.size);
            setCommentInput('');
            setReplyToId(null);
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            showToast('댓글 작성에 실패했습니다.', 'error');
        }
    };

    const handleCommentUpdate = async (commentId, content) => {
        try {
            await updateCommentAPI(commentId, { content });
            showToast('댓글이 수정되었습니다.', 'success');
            fetchComments(pagination.currentPage, pagination.size);
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            showToast('댓글 수정에 실패했습니다.', 'error');
        }
    };

    const handlePostUpdate = async (updatedData) => {
        const { title, content, hashtags } = updatedData;

        try {
            const updatedPost = {
                title,
                content,
                hashtagContent: Array.isArray(hashtags)
                    ? hashtags
                    : (hashtags || '').split(',').map((tag) => tag.trim()),
            };

            await updatePostAPI(postId, updatedPost);
            fetchData();
            showToast('게시글이 성공적으로 수정되었습니다!', 'success');
            setModalOpen(false);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            showToast('게시글 수정에 실패했습니다.', 'error');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return;

        try {
            await deleteCommentAPI(commentId);
            showToast('댓글이 삭제되었습니다.', 'success');
            fetchComments(pagination.currentPage, pagination.size);
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            showToast('댓글 삭제에 실패했습니다.', 'error');
        }
    };

    const totalPages = Math.ceil(pagination.totalElements / pagination.size);

    if (!post.title?.length) {
        return <p>Loading...</p>;
    }

    const findCommentById = (commentId, commentsList) => {
        for (let comment of commentsList) {
            if (comment.id === commentId) return comment;
            if (comment.replies) {
                const found = findCommentById(commentId, comment.replies);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <div className="post-detail-container">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-meta">
                작성자: {post.employeeName || '알 수 없음'} | 작성일:{' '}
                {new Date(post.createdAt).toLocaleString()}
            </p>
            <div className="post-content">
                <div ref={contentRef} className="ckeditor-content" />
                {post.imageUrl && (
                    <img src={post.imageUrl} alt="Post illustration" className="post-image" />
                )}
            </div>
            {(post.isAuthor || user.role === 'ROLE_ADMIN') && (
                <div className="post-actions">
                    <button className="edit-button" onClick={() => setModalOpen(true)}>
                        수정
                    </button>
                    <button
                        className="delete-button"
                        onClick={() => {
                            if (window.confirm('이 게시글을 삭제하시겠습니까?')) {
                                deletePostAPI(postId)
                                    .then(() => {
                                        showToast('게시글이 성공적으로 삭제되었습니다!', 'success');
                                        navigate('/post');
                                    })
                                    .catch((error) => {
                                        console.error('게시글 삭제 실패:', error);
                                        showToast('게시글 삭제에 실패했습니다.', 'error');
                                    });
                            }
                        }}
                    >
                        삭제
                    </button>
                </div>
            )}
            <PostModal
                show={isModalOpen}
                handleClose={() => setModalOpen(false)}
                handleSubmit={handlePostUpdate}
                title={post.title}
                setTitle={(title) => setPost((prev) => ({ ...prev, title }))}
                editorData={post.content}
                setEditorData={(content) => setPost((prev) => ({ ...prev, content }))}
                hashtags={post.hashtags}
                setHashtags={(hashtags) => setPost((prev) => ({ ...prev, hashtags }))}
            />
            <hr />
            <section className="comments-section">
                <h5>댓글</h5>
                {replyToId && (
                    <p className="replying-to">
                        {findCommentById(replyToId, comments)?.employeeName}님에게 답글 작성 중...
                        <button
                            className="cancel-reply"
                            onClick={() => setReplyToId(null)}
                        >
                            취소
                        </button>
                    </p>
                )}
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder={replyToId ? '답글을 입력하세요' : '댓글을 입력하세요'}
                        className="comment-input"
                        required
                    ></textarea>
                    <button type="submit" className="comment-submit-button">
                        {replyToId ? '답글 등록' : '등록'}
                    </button>
                </form>
                {comments.length > 0 ? (
                    <ul className="comments-list">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onReply={setReplyToId}
                                onDelete={handleCommentDelete}
                                onUpdate={handleCommentUpdate}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="no-comments">댓글이 없습니다.</p>
                )}
                <div className="detail-pagination">
                    <button
                        className="detail-page-link"
                        onClick={() => handlePageChange(0)}
                        disabled={pagination.currentPage === 0}
                    >
                        «
                    </button>
                    <button
                        className="detail-page-link"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 0}
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`detail-page-link ${pagination.currentPage === index ? 'active' : ''}`}
                            onClick={() => handlePageChange(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="detail-page-link"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === totalPages - 1}
                    >
                        ›
                    </button>
                    <button
                        className="detail-page-link"
                        onClick={() => handlePageChange(totalPages - 1)}
                        disabled={pagination.currentPage === totalPages - 1}
                    >
                        »
                    </button>
                </div>
            </section>
        </div>
    );
};

export default PostDetailPage;
