import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetailAPI } from '../../api/post';

const PostDetailPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await getPostDetailAPI(postId);
                setPost(response);
            } catch (error) {
                console.error('Failed to fetch post detail:', error);
            }
        };

        fetchPostDetail();
    }, [postId]);

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>작성자: {post.author || '알 수 없음'}</p>
            <p>작성일: {post.createdAt}</p>
        </div>
    );
};

export default PostDetailPage;
