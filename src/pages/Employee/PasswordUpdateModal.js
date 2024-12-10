import React, { useState } from "react";
import { updatePasswordAPI } from "../../api/employee/index"; // 비밀번호 수정 API
import { useToast } from "../../context/ToastContext";
import "./PasswordUpdateModal.css";

const PasswordUpdateModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      showToast("모든 필드를 입력해주세요.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("새 비밀번호가 일치하지 않습니다.", "error");
      return;
    }

    const formData = {
      confirmPassword: confirmPassword.trim(),
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    };

    try {
      const response = await updatePasswordAPI(formData);

      console.log("서버 응답 데이터:", response);

      if (response) {
        showToast("비밀번호가 성공적으로 변경되었습니다.", "success");
        onClose(); 
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast("비밀번호 변경에 실패했습니다.", "error");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error.response?.data || error.message);
      showToast(
        error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.",
        "error"
      );
    }
  };

  // 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="password-change-modal-overlay">
      <div className="password-change-modal-content">
        <button className="password-change-close-button" onClick={onClose}>
          &times;
        </button>
        <h3 className="password-change-modal-title">비밀번호 수정</h3>
        <form onSubmit={handlePasswordUpdate}>
          <div className="password-change-form-group">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호"
              required
            />
          </div>
          <div className="password-change-form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호"
              required
            />
          </div>
          <div className="password-change-form-group">
            <label htmlFor="confirmNewPassword">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="새 비밀번호 확인"
              required
            />
          </div>
          <button type="submit" className="password-change-save-button">
            저장
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordUpdateModal;