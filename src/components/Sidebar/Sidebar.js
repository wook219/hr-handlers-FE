import React from 'react';
import { useNavigation } from './useNavigation';
import { FaHome, FaPlane, FaComment, FaClipboardList, FaDollarSign, FaRegCalendarAlt, FaBriefcase   } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

function Sidebar() {
  const { user, logout } = useUser(); // context 사용 부분 참고
  const navigation = useNavigation();

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 토큰 제거
    logout(); // Context 상태 초기화 
    navigation.toLogin();
  };

  return (
    <div className="sidebar">
      <div className="profile" onClick={navigation.toMyPage} style={{ cursor: 'pointer' }}>
        <img
          className="profile-img"
          src={user.profileImage || "/profile_image.png"}
          alt="프로필 사진"
        />
        <div className="profile-name">{user.name}</div>
        <div className="profile-team">{user.deptName}</div>
      </div>
      <div className="divider"></div>
      <nav>
        <ul>
          <li onClick={navigation.toHome}>
            <FaHome className="icon" />
            <span>홈</span>
          </li>

          <li onClick={navigation.toAttendance}>
            <FaBriefcase className="icon" />
            <span>출퇴근 기록</span>
          </li>

          <li onClick={navigation.toTodo}>
            <FaRegCalendarAlt className="icon" />
            <span>일정 관리</span>
          </li>

          <li onClick={navigation.toVacation}>
            <FaPlane className="icon" />
            <span>휴가 관리</span>
          </li>

          <li onClick={navigation.toChatRoom}>
            <FaComment className="icon" />
            <span>사내메신저</span>
          </li>

          <li onClick={navigation.toBoard}>
            <FaClipboardList className="icon" />
            <span>사내게시판</span>
          </li>

          <li onClick={navigation.toSalary}>
            <FaDollarSign className="icon" />
            <span>급여관리</span>
          </li>
          {user.role === 'ROLE_ADMIN' && (
            <li onClick={navigation.toAdminHome}>
              <FaDollarSign className="icon" />
              <span>통합관리</span>
            </li>
          )}
        </ul>
      </nav>
      <div className="logout">
        <button
          onClick={handleLogout}
          className="logout-button"
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            marginLeft: '150px',
            fontSize: '14px',
            marginBottom: "50px"
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default Sidebar;