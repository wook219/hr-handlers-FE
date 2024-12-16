import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Salary from '../pages/Salary/SalaryPage';
import AdminSalary from '../pages/Admin/Salary/AdminSalaryPage';
import PostListPage from '../pages/Post/PostListPage'; // 게시글 목록 페이지
import PostDetailPage from '../pages/Post/PostDetailPage'; // 게시글 상세 페이지
import ChatRoomListPage from '../pages/Chat/ChatRoomListPage'; // 채팅방 목록
import TodoPage from '../pages/Todo/TodoPage';
import Login from '../pages/Employee/Login'; // 로그인 페이지
import MyPage from '../pages/Employee/MyPage';
import ChatList from '../pages/Chat/ChatList';
import ChatRoom from '../pages/Chat/ChatRoom';
import Home from '../pages/Home/Home';
import VacationPage from '../pages/Vacation/VacationPage';
import AttendanceHistory from '../pages/Attendance/AttendanceHistoryPage';

import AdminEmp from '../pages/Admin/Employee/AdminEmployeePage'
import AdminDept from '../pages/Admin/Department/AdminDepartmentPage'
import AdminVacation from '../pages/Admin/Vacation/AdminVacationPage'
import AdminAttendancePage from '../pages/Admin/Attendance/AdminAttendancePage';

// 공통 레이아웃이 필요한 라우트 라면 조건 처리
function AppRouter() {
  return (
    <Routes>
      {/* 기본 경로 /login으로 설정 */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/salary" element={<Salary />} />
      <Route path="/post" element={<PostListPage />} />
      <Route path="/post/:postId" element={<PostDetailPage />} />
      <Route path="/chatroom" element={<ChatRoomListPage />} />
      <Route path="/chatroom/:chatroomId" element={<ChatRoom />} />
      <Route path="/chat" element={<ChatList />} />
      <Route path="/todo" element={<TodoPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/vacation" element={<VacationPage />} />
      <Route path="/attendance" element={<AttendanceHistory />} />
      
      <Route path="/admin/salary" element={<AdminSalary />} />
      <Route path="/admin/emp" element={<AdminEmp />} />
      <Route path="/admin/vacation" element={<AdminVacation />} />
      <Route path="/admin/dept" element={<AdminDept />} />
      <Route path="/admin/attendance" element={<AdminAttendancePage />} />
    </Routes>
  );
}
export default AppRouter;
