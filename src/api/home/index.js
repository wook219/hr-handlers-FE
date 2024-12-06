import axios from '../axios';

// 공지사항 가져오기 API
export const getAllNoticesAPI = async (page = 0, size = 5) => {
    try {
      const response = await axios.get(`/post/notices?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      throw error;
    }
};
