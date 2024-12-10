import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext"; 
import { loginAPI, fetchUserInfo } from "../../api/employee/index"; 
import { useToast } from "../../context/ToastContext";
import FindPassword from "./FindPassword";
import "./Login.css";

const Login = () => {
  const [empNo, setEmpNo] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!empNo.trim()) {
      showToast("사원 번호를 입력해주세요.", "warning");
      return;
    }
    if (!password.trim()) {
      showToast("비밀번호를 입력해주세요.", "warning");
      return;
    }

    try {
      // 로그인 API 호출
      const token = await loginAPI(empNo, password);

      // 토큰 저장
      localStorage.setItem("access_token", typeof token === "string" ? token : JSON.stringify(token));

      // 사용자 정보 API 호출
      const userInfo = await fetchUserInfo(empNo);

      // Context에 사용자 정보 저장
      login({
        empNo: userInfo.empNo,
        name: userInfo.name,
        role: userInfo.role,
        deptName: userInfo.deptName,
        profileImage: userInfo.profileImage
      });

      showToast(`${userInfo.name}님 환영합니다.`, "success");
      navigate("/home");
    } catch (error) {
      showToast(
        error.response?.data?.message || "아이디 또는 비밀번호를 잘못 입력했습니다.",
        "error"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img
            src="/free-icon-hr-9227651.png"
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
            <label className="login-button-label">Login</label>
          </button>
        </form>
        <div className="find-password-container">
          <button
            className="find-password-link"
            onClick={() => setModalOpen(true)}
          >
            비밀번호 찾기 &gt;
          </button>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <FindPassword isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Login;