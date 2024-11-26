import React from "react";
import { useNavigation } from './useNavigation';
import { FaHome, FaPlane, FaComment, FaClipboardList, FaDollarSign, FaRegCalendarAlt } from "react-icons/fa";
import { useUser } from "../../context/UserContext"; // 유저 Context 가져오기

function Sidebar() {
  const { user } = useUser(); // Context에서 유저 정보 가져오기
  const navigation = useNavigation();
    
  return (
    <div className="sidebar">
      <div className="profile">
        <img
          className="profile-img"
          src="https://via.placeholder.com/80"
          alt="프로필 사진"
        />
        <div className="profile-name">홍길동</div>
        <div className="profile-team">개발 1팀</div>
      </div>
      <div className="divider"></div>
      <nav>
        <ul>

          <li>
            <FaHome className="icon" />
            <span>홈</span>
          </li>

          <li onClick={navigation.toTodo}>
            <FaRegCalendarAlt className="icon" />
            <span>일정 관리</span>
          </li>

          <li>
            <FaPlane className="icon" />
            <span>출퇴근기록</span>
          </li>

          <li>
            <FaComment className="icon" />
            <span>사내메신저</span>
          </li>

          <li>
            <FaClipboardList className="icon" />
            <span>사내게시판</span>
          </li>

          <li>
            <FaDollarSign className="icon" />
            <span>급여관리</span>
          </li>
          
        </ul>
      </nav>
      <div className="logout">
        <a href="#">로그아웃</a>
      </div>
    </div>
  );
}

export default Sidebar;
