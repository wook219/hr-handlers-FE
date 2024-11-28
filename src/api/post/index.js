import axios from '../axios';


// 게시글 목록 조회 API
export const getAllPostsAPI = async (page = 0, size = 5) => {
    try {
        const response = await axios.get(`/post?page=${page}&size=${size}`);
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
        // 로컬스토리지에서 JWT 토큰 가져오기
        const token = localStorage.getItem("access_token");
        if (!token) {
            throw new Error("JWT 토큰이 없습니다. 로그인을 해주세요.");
        }

        // Authorization 헤더 포함하여 POST 요청
        const response = await axios.post('/post', postData, {
            headers: {
                Authorization: `Bearer ${token}`, // Bearer 토큰 설정
            },
        });

        return response.data; // 응답 데이터 반환
    } catch (error) {
        console.error('게시글 생성 실패:', error);
        throw error; // 에러 다시 던지기
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
