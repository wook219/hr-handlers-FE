import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Salary from "../pages/Salary/SalaryPage";
import AdminSalary from "../pages/Admin/Salary/AdminSalaryPage";
import User from "../pages/User/UserPage";
import PostListPage from '../pages/Post/PostListPage'; // 게시글 목록 페이지
import PostDetailPage from '../pages/Post/PostDetailPage'; // 게시글 상세 페이지

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<User/>} />
            <Route path="/salary" element={<Salary/>} />
            <Route path="/admin/salary" element={<AdminSalary/>} />
            <Route path="/post" element={<PostListPage />} />
            <Route path="/post/:postId" element={<PostDetailPage />} />
        </Routes>
    );
}
export default AppRouter;
