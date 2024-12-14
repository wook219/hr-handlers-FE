import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigation } from './useNavigation';
import { FaHome, FaPlane, FaComment, FaClipboardList, FaDollarSign, FaRegCalendarAlt, FaBriefcase, FaSignOutAlt} from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { MdManageAccounts } from "react-icons/md";
import TreeMenuItem from './TreeMenuItem';


function Sidebar() {
  const { user, logout } = useUser(); // context 사용 부분 참고
  const navigation = useNavigation();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const activeStyle = {
    backgroundColor: '#0f1c3c',
    borderRadius: '5px'
  };

  const isActive = (path) => currentPath === path;

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 토큰 제거
    logout(); // Context 상태 초기화 
    navigation.toLogin();
  };

  const adminMenuItems = [
    { label: '- 급여 관리', onClick: navigation.toAdminSalary, path: '/admin/salary' },
    { label: '- 휴가 관리', onClick: navigation.toAdminVacation, path: '/admin/vacation' },
    { label: '- 사원 관리', onClick: navigation.toAdminEmp, path: '/admin/emp' },
    { label: '- 근태 관리', onClick: navigation.toAdminAttendance, path: '/admin/attendance' },
  ];

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
            <span>자유게시판</span>
          </li>

          <li onClick={navigation.toSalary}>
            <FaDollarSign className="icon" />
            <span>급여관리</span>
          </li>
          
          {user.role === 'ROLE_ADMIN' && (
          <li>
            <TreeMenuItem
              label={
                <>
                  <MdManageAccounts className="icon" />
                  <span>통합관리</span>
                </>
              }
              isOpen={isAdminMenuOpen}
              onToggle={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
            >

            {adminMenuItems.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer"
              style={{ 
                padding: '10px 15px',
                marginTop: '5px',
                marginLeft: '20px',
                fontSize: '18px',
                ...(isActive(item.path) ? activeStyle : {})
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick();
              }}
            >
              {item.label}
            </div>
          ))}
            </TreeMenuItem>
          </li>
        )}
        <li onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <span>로그아웃</span>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;