import axios from '../axios';

// 게시글 목록 조회 API
export const getAllPostsAPI = async () => {
    try {
        const response = await axios.get('/post');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch all posts:', error);
        throw error;
    }
};

// 게시글 상세 조회 API
export const getPostDetailAPI = async (postId) => {
    try {
        const response = await axios.get(`/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch post detail (ID: ${postId}):`, error);
        throw error;
    }
};

// 게시글 생성 API
export const createPostAPI = async (postData) => {
    try {
        const response = await axios.post('/post', postData);
        return response.data;
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
};

// 게시글 수정 API
export const updatePostAPI = async (postId, postData) => {
    try {
        const response = await axios.put(`/post/${postId}`, postData);
        return response.data;
    } catch (error) {
        console.error(`Failed to update post (ID: ${postId}):`, error);
        throw error;
    }
};

// 게시글 삭제 API
export const deletePostAPI = async (postId) => {
    try {
        const response = await axios.delete(`/post/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to delete post (ID: ${postId}):`, error);
        throw error;
    }
};
