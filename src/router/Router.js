import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Salary from "../pages/Salary/SalaryPage";
import User from "../pages/user/UserPage";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<User/>} />
            <Route path="/salary" element={<Salary/>} />
        </Routes>
    );
}
export default AppRouter;
