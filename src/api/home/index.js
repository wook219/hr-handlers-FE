import axios from '../axios';

// 공지사항 가져오기 API
export const getAllNoticesAPI = async () => {
    try {
      const response = await axios.get("/post/notices"); // 백엔드 엔드포인트 설정
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      throw error;
    }
  };

