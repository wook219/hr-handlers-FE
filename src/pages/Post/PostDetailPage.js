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

const PostDetailPage = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const { user } = useUser();
    const contentRef = useRef(null);  // contentRef 추가
    const [renderKey, setRenderKey] = useState(0); // 추가

    const [post, setPost] = useState({
        data: null,
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postResponse = await getPostDetailAPI(postId);
                const { data } = postResponse;
                const isAuthor = data.employeeName === user.name;

                setPost({
                    data,
                    title: data.title,
                    content: data.content,
                    hashtags: data.hashtagContent.join(', '),
                    isAuthor,
                });

                const commentsResponse = await getCommentsByPostAPI(postId);
                const formattedComments = commentsResponse.data
                    .map((comment) => ({
                        ...comment,
                        createdAt: new Date(comment.createdAt),
                    }))
                    .sort((a, b) => b.createdAt - a.createdAt); // 최신순 정렬
                setComments(formattedComments);
            } catch (error) {
                console.error('데이터 요청 실패:', error);
            }
        };

        fetchData();
    }, [postId, user.name]);

    const handleEditClick = () => setModalOpen(true);

    const handleModalClose = () => setModalOpen(false);

    const handlePostDelete = async () => {
        if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return;
        try {
            await deletePostAPI(postId);
            alert('게시글이 성공적으로 삭제되었습니다.');
            navigate('/post');
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    const handlePostUpdate = async (updatedData) => {
        const { title, content, hashtags } = updatedData;
        console.log('Updated content:', content); // 업데이트되는 내용 확인
    
        try {
            const updatedPost = {
                title,
                content,
                hashtagContent: hashtags, // 배열 그대로
            };
    
            // 서버로 수정 요청
            await updatePostAPI(postId, updatedPost);
    
            // 상태 즉시 갱신
            setPost((prev) => {
                const newPost = {
                    ...prev,
                    data: {
                        ...prev.data,
                        title: updatedPost.title,
                        content: updatedPost.content,
                        hashtagContent: updatedPost.hashtagContent
                    },
                    title: updatedPost.title,
                    content: updatedPost.content,
                    hashtags: updatedPost.hashtagContent.join(', '),
                };
                console.log('New post state:', newPost); // 새로운 상태 확인
                return newPost;
            });
            setRenderKey(prev => prev + 1); // 강제 리렌더링 추가
            alert('게시글이 성공적으로 수정되었습니다!');
            setModalOpen(false); // 모달 닫기
            window.location.reload(); // 새로고침 추가
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };    


    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createCommentAPI(postId, { content: commentInput });
            const newComment = {
                id: response.data.id,
                content: commentInput,
                employeeName: user.name,
                createdAt: new Date(response.data.timestamp),
            };

            setComments((prev) => [newComment, ...prev]); // 기존 댓글 배열에 추가
            setCommentInput(''); // 입력 필드 초기화
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const handleCommentCancel = () => setCommentInput('');

    if (!post.data) {
        return <p>Loading...</p>;
    }

    return (
        <div className="post-detail-container" key={renderKey}> {/* key 추가 */}
            <h1 className="post-title">{post.title}</h1>
            <p className="post-meta">
                작성자: {post.data.employeeName || '알 수 없음'} | 작성일:{' '}
                {new Date(post.data.createdAt).toLocaleString()}
            </p>
            <div className="post-content">
                <div ref={contentRef} className="ckeditor-content" /> {/* ref 추가 */}
                {post.data.imageUrl && (
                    <img src={post.data.imageUrl} alt="Post illustration" className="post-image" />
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
            <form onSubmit={handleCommentSubmit} className="comment-form">
                <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
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
                                    <span className="comment-employeeName">{c.employeeName}</span>
                                    <span className="comment-date">
                                        {c.createdAt.toLocaleString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                    </span>
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
