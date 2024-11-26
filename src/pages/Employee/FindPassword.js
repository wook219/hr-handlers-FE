import React from "react";
import "./FindPassword.css";

const PasswordResetModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="findpassword-modal-overlay">
      <div className="findpassword-modal-content">
        <button className="findpassword-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>비밀번호 찾기</h2>
        <p>입력하신 이메일로 임시 비밀번호가 전송됩니다.</p>
        <form>
          <div className="findpassword-form-group">
            <label htmlFor="empNo" className="findpassword-label">사원번호</label>
            <input
              type="text"
              id="empNo"
              className="findpassword-input"
              placeholder="사원번호 입력"
              required
            />
          </div>
          <div className="findpassword-form-group">
            <label htmlFor="email" className="findpassword-label">이메일</label>
            <input
              type="email"
              id="email"
              className="findpassword-input"
              placeholder="이메일 입력"
              required
            />
          </div>
          <button type="submit" className="findpassword-submit-button">
            확인
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetModal;