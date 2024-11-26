import React, { useEffect, useState } from "react";
import { getMyPageAPI } from "../../api/employee/index"; // API 가져오기
import "./MyPage.css";

const MyPage = () => {
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyPageAPI(); // API 호출
        setUserData(data);
        setLoading(false); // 로딩 완료
      } catch (error) {
        setError(error.message);
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="mypage-loading">로딩 중...</div>; // 로딩 메시지
  if (error) return <div className="mypage-error">오류: {error}</div>; // 오류 메시지

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>
      <div className="mypage-info">
        <div className="mypage-info-item">
          <span className="mypage-info-label">사원번호:</span>
          <span>{userData.empNo}</span>
        </div>
        <div className="mypage-info-item">
          <span className="mypage-info-label">이름:</span>
          <span>{userData.name}</span>
        </div>
        <div className="mypage-info-item">
          <span className="mypage-info-label">부서:</span>
          <span>{userData.team}</span>
        </div>
        <div className="mypage-info-item">
          <span className="mypage-info-label">이메일:</span>
          <span>{userData.email}</span>
        </div>
      </div>
    </div>
  );
};

export default MyPage;