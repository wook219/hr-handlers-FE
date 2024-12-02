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

// 사용자 정보 API
export const fetchUserInfo = async () => {
    try {
      // 서버에서 사용자 정보를 가져옴
      const response = await instance.get("/emp", {
        headers: {
          access: `${localStorage.getItem("access_token")}`, // 토큰 추가
        },
      });
  
      // API 응답 데이터 반환
      return response.data.data; 
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error.response?.data || error.message);
      throw error;
    }
  };