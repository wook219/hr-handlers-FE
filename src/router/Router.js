import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Salary from "../pages/Salary/SalaryPage";
import AdminSalary from "../pages/Admin/Salary/AdminSalaryPage";
import User from "../pages/User/UserPage";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<User/>} />
            <Route path="/salary" element={<Salary/>} />
            <Route path="/admin/salary" element={<AdminSalary/>} />
        </Routes>
    );
}
export default AppRouter;
