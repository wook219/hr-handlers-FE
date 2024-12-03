import React, { useEffect, useState, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getPostDetailAPI,
    updatePostAPI,
    deletePostAPI,
    getCommentsByPostAPI,
    createCommentAPI,
} from '../../api/post';
import './PostDetailPage.css';
import { useUser } from '../../context/UserContext';
import PostModal from './PostModal';
import { useToast } from '../../context/ToastContext';  // 이 줄 추가

// CommentItem 컴포넌트 추가
const CommentItem = ({ comment, onReply }) => {
    return (
        <li key={comment.id} className="comment-item">
            <div className="comment-header">
                <span className="comment-employeeName">{comment.employeeName}</span>
                <span className="comment-date">
                    {comment.createdAt.toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </span>
            </div>
            <p className="comment-content">{comment.content}</p>
            <button 
                className="reply-button" 
                onClick={() => onReply(comment.id)}
            >
                답글 달기
            </button>
            
            {comment.replies?.length > 0 && (
                <ul className="nested-comment">
                    {comment.replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            onReply={onReply}
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
    const contentRef = useRef(null);  // contentRef 추가
    const [renderKey, setRenderKey] = useState(0); // 추가
    const [replyToId, setReplyToId] = useState(null); // 대댓글을 위한 상태 추가

    const [post, setPost] = useState({
        title: '',
        content: '',
        hashtags: '',
        isAuthor: false,
    });

    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

        // querySelector를 사용하는 useEffect를 ref를 사용하도록 수정
        useEffect(() => {
            if (contentRef.current) {
                contentRef.current.innerHTML = post.content;
            }
        }, [post.content]);

           const fetchData = async () => {
                try {
                    const postResponse = await getPostDetailAPI(postId);
                    const { data } = postResponse;
                    const isAuthor = data.employeeName === user.name;
                    
                    console.log('데이터: ', data);

                    setPost({
                        ...data,
                        hashtags: data.hashtagContent.join(', '),
                        isAuthor,
                    });
        
                    const commentsResponse = await getCommentsByPostAPI(postId);
                    console.log('Received comments:', commentsResponse.data);
                    
                    // 서버에서 받은 댓글 데이터에 날짜 변환만 적용
                    const formattedComments = commentsResponse.data.map(comment => ({
                        ...comment,
                        createdAt: new Date(comment.createdAt)
                    }));
        
                    // 최신순 정렬
                    const sortedComments = formattedComments.sort(
                        (a, b) => b.createdAt - a.createdAt
                    );
        
                    setComments(sortedComments);
                } catch (error) {
                    console.error('데이터 요청 실패:', error);
                }
            };
        

        useEffect(() => {
         
            fetchData();
        }, [postId, user.name]);

    const handleEditClick = () => setModalOpen(true);

    const handleModalClose = () => setModalOpen(false);

    const handlePostDelete = async () => {
        if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return;
        try {
            await deletePostAPI(postId);
            showToast('게시글이 성공적으로 삭제되었습니다!', 'success');
            navigate('/post');
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            showToast('게시글 삭제에 실패했습니다', 'error');
        }
    };

    const handlePostUpdate = async (updatedData) => {
        const { title, content, hashtags } = updatedData;
    
        try {
            const updatedPost = {
                title,
                content,
                hashtagContent: hashtags, // 배열 그대로
            };
        console.log('updatedPost:', updatedPost); // 업데이트되는 내용 확인
    
            // 서버로 수정 요청
            await updatePostAPI(postId, updatedPost);
            
            await fetchData();
            showToast('게시글이 성공적으로 수정되었습니다!', 'success');
            setModalOpen(false); // 모달 닫기


        } catch (error) {
            showToast('게시글 수정에 실패했습니다', 'error');
            console.error('게시글 수정 실패:', error);
        }
    };    

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        // 로그인 여부 확인
        if (!user.empNo) {
            showToast('로그인이 필요합니다.', 'warning');
            return;
        }

        try {
            const response = await createCommentAPI(postId, { 
                content: commentInput,
                parentCommentId: replyToId
            });
    
            const newComment = {
                id: response.data.id,
                content: commentInput,
                employeeName: user.name,
                createdAt: new Date(response.data.timestamp),
                parentId: replyToId,
                replies: []
            };
    
            setComments((prev) => {
                if (replyToId) {
                    // 대댓글인 경우: 모든 댓글 트리를 순회하면서 부모 댓글 찾기
                    return prev.map(comment => {
                        // 현재 댓글이 부모인 경우
                        if (comment.id === replyToId) {
                            return {
                                ...comment,
                                replies: [newComment, ...(comment.replies || [])]
                            };
                        }
                        // 현재 댓글의 replies 배열 내에 부모가 있는지 확인
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: comment.replies.map(reply => {
                                    if (reply.id === replyToId) {
                                        return {
                                            ...reply,
                                            replies: [newComment, ...(reply.replies || [])]
                                        };
                                    }
                                    return reply;
                                })
                            };
                        }
                        return comment;
                    });
                }
                // 일반 댓글인 경우
                return [newComment, ...prev];
            });
            
            setCommentInput('');
            setReplyToId(null);
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            showToast('댓글 작성에 실패했습니다', 'error');
        }
    };

    const handleReplyClick = (commentId) => {
        // 로그인 여부 확인
        if (!user.empNo) {
            showToast('로그인이 필요합니다.', 'warning');
            return;
        }
        setReplyToId(commentId);
    };

    const handleCommentCancel = () => {
        setCommentInput('');
        setReplyToId(null);
    };

    if (!post.title?.length) {
        return <p>Loading...</p>;
    }

    return (
        <div className="post-detail-container" key={renderKey}>
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
            {post.isAuthor && (
                <div className="post-actions">
                    <button className="edit-button" onClick={handleEditClick}>
                        수정
                    </button>
                    <button className="delete-button" onClick={handlePostDelete}>
                        삭제
                    </button>
                </div>
            )}
            <PostModal
                show={isModalOpen}
                handleClose={handleModalClose}
                handleSubmit={handlePostUpdate}
                title={post.title}
                setTitle={(title) => setPost((prev) => ({ ...prev, title }))}
                editorData={post.content}
                setEditorData={(content) => setPost((prev) => ({ ...prev, content }))}
                hashtags={post.hashtags}
                setHashtags={(hashtags) => setPost((prev) => ({ ...prev, hashtags }))}
                isEditMode={true}
            />
            <hr />
            <section className="comments-section">
                <h5>댓글</h5>
                {replyToId && (
                    <p className="replying-to">
                        답글 작성 중... 
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
                        placeholder={replyToId ? "답글을 입력하세요" : "댓글을 입력하세요"}
                        className="comment-input"
                        required
                    ></textarea>
                    <div className="comment-buttons">
                        <button 
                            type="button" 
                            className="comment-cancel-button" 
                            onClick={handleCommentCancel}
                        >
                            취소
                        </button>
                        <button type="submit" className="comment-submit-button">
                            {replyToId ? '답글 등록' : '등록'}
                        </button>
                    </div>
                </form>
                {comments.length > 0 ? (
                    <ul className="comments-list">
                        {comments.map((comment) => (
                            <CommentItem 
                                key={comment.id} 
                                comment={comment}
                                onReply={(id) => setReplyToId(id)}
                            />
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