import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // 공통 사이드바 컴포넌트
import Salary from "../pages/Salary/SalaryPage";
import AdminSalary from "../pages/Admin/Salary/AdminSalaryPage";
import User from "../pages/User/UserPage";
import PostListPage from '../pages/Post/PostListPage'; // 게시글 목록 페이지
import PostDetailPage from '../pages/Post/PostDetailPage'; // 게시글 상세 페이지

function Layout({ children }) {
    return (
        <div className="layout">
            <Sidebar />
            <div className="content">{children}</div>
        </div>
    );
}

// 공통 레이아웃이 필요한 라우트 라면 조건 처리
function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<User/>} />
            <Route path="/salary" element={<Salary/>} />
            <Route path="/admin/salary" element={<AdminSalary/>} />
            <Route path="/post" element={<Layout><PostListPage /></Layout>} />
            <Route path="/post/:postId" element={<Layout><PostDetailPage /></Layout>} />
        </Routes>
    );
}
export default AppRouter;
