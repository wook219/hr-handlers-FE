import axios from "axios";

export const loginAPI = async (empNo, password) => {
  try {
    // 로그인 API 호출
    const response = await axios.post("http://localhost:8080/login", { empNo, password });

    // 헤더에서 토큰 추출
    const token = response.headers["authorization"]?.replace("Bearer ", "");

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
      const token = localStorage.getItem("access_token"); 
  
      if (!token) {
        throw new Error("JWT 토큰이 없습니다. 로그인을 해주세요.");
      }
  
      const response = await axios.get("http://localhost:8080/emp", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("마이페이지 데이터 가져오기 오류:", error.response?.data || error.message);
      throw error;
    }
  };