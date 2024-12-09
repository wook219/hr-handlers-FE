import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem("access_token");

    // 로그인 페이지로 리다이렉트
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      로그아웃
    </button>
  );
};

export default Logout;