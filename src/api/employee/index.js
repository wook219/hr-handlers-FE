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

    console.log("로그인 성공: JWT 토큰 저장 완료", token);

    // 토큰 반환
    return token;
  } catch (error) {
    // 오류 처리
    console.error("로그인 API 오류:", error.response?.data || error.message);
    throw error;
  }
};