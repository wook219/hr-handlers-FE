import React, { useState } from "react";
import { matchEmailAndEmpNoAPI, sendResetPasswordAPI } from "../../api/employee";
import { useToast } from "../../context/ToastContext"; 
import "./FindPassword.css";

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [empNo, setEmpNo] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  // 모달이 열리지 않은 경우 모달을 렌더링하지 않음
  if (!isOpen) return null;

  const handleClose = () => {
    setEmpNo("");
    setEmail("");
    setIsSubmitted(false);
    setErrorMessage("");
    onClose();
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: 사원 번호와 이메일 일치 여부 확인
      const checkResponse = await matchEmailAndEmpNoAPI(empNo, email);

      if (checkResponse && checkResponse.data) {
        // Step 2: 메일 전송
        const sendMailResponse = await sendResetPasswordAPI(empNo, email);

        if (sendMailResponse && sendMailResponse.data) {
          setIsSubmitted(true);
        } else {
          showToast("메일 전송에 실패했습니다. 다시 시도해주세요.", "error");
        }
      } else {
        showToast("사원 번호와 이메일이 일치하지 않습니다. 다시 확인해주세요.", "warning");
      }
    } catch (error) {
      showToast("오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };
  
  return (
    <div className="findpassword-modal-overlay">
      <div
        className={`findpassword-modal-content ${isSubmitted ? "findpassword-success-modal" : "findpassword-form-modal"
          }`}
      >
        <button className="findpassword-close-button" onClick={handleClose}>
          &times;
        </button>

        {isSubmitted ? (
          // 성공적으로 이메일 전송된 경우의 메시지
          <div className="findpassword-success-message">
            <h5 className="findpassword-success-title">임시 비밀번호가 이메일로 전송되었습니다.</h5>
            <p className="findpassword-success-text">
              이메일({email})로 임시 비밀번호를 보냈습니다. 이메일을 확인해 주세요.
            </p>
          </div>
        ) : (
          // 이메일 확인 폼
          <>
            <h6 className="findpassword-form-title">비밀번호 찾기</h6>
            <p className="findpassword-form-description">
              입력하신 이메일로 임시 비밀번호가 전송됩니다.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="findpassword-form-group">
                <label htmlFor="empNo" className="findpassword-label">
                  사원번호
                </label>
                <input
                  type="text"
                  id="empNo"
                  className="findpassword-input"
                  value={empNo}
                  onChange={(e) => setEmpNo(e.target.value)}
                  required
                />
              </div>
              <div className="findpassword-form-group">
                <label htmlFor="email" className="findpassword-label">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  className="findpassword-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errorMessage && (
                <p className="findpassword-error-message">{errorMessage}</p>
              )}
              <button type="submit" className="findpassword-submit-button">
                확인
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordResetModal;
