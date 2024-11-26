import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../api/employee/index";
import FindPassword from "./FindPassword";
import "./Login.css";

const Login = () => {
  const [empNo, setEmpNo] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [isModalOpen, setModalOpen] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!empNo.trim()) {
      alert("사원 번호를 입력해주세요.");
      return;
    }
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const token = await loginAPI(empNo, password);
      localStorage.setItem("access_token", token);
      alert(`${empNo}님 환영합니다.`);
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert(error.response?.data?.message || "아이디 또는 비밀번호를 잘못 입력했습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img
            src="/Eployee/free-icon-hr-9227651.png"
            alt="Logo"
            className="login-image-logo"
          />
          <h5>인사잘해</h5>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="empNo" className="login-label">ID</label>
            <input
              type="text"
              id="empNo"
              placeholder="사원 번호"
              className="login-input"
              value={empNo}
              onChange={(e) => setEmpNo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button className="find-password" onClick={() => setModalOpen(true)}> 
          비밀번호 찾기 &gt;
        </button>
      </div>

      {/* 모달 컴포넌트 */}
      <FindPassword isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Login;