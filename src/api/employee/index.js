import instance from "../axios";

export const loginAPI = async (empNo, password) => {
  try {
    // 로그인 API 호출
    const response = await instance.post("http://localhost:8080/login", { empNo, password });

    // 헤더에서 토큰 추출
    const token = response.headers["access"];

    if (!token) {
      throw new Error("헤더에서 JWT 토큰을 가져올 수 없습니다.");
    }

    // 토큰 반환
    return token;
  } catch (error) {
    // 오류 처리
    console.error("로그인 API 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 마이페이지 API
export const getMyPageAPI = async () => {
    try {
      const response = await instance.get('/emp');
      return response.data;
    } catch (error) {
      console.error("마이페이지 데이터 가져오기 오류:", error.response?.data || error.message);
      throw error;
    }
  };