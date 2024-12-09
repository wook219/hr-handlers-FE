import React from 'react';
import { useNavigation } from '../../../components/Sidebar/useNavigation';
import { FaHome, FaPlane, FaRegCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { BsFillPeopleFill } from "react-icons/bs";
import "./AdminHomePage.css";

function AdminHomePage() {
  const navigate = useNavigation();
  const navItems = [
    { icon: <FaHome />, label: '사원 관리', action: navigate.toAdminEmp },
    { icon: <BsFillPeopleFill />, label: '근태 관리', action: navigate.toAdminAttendance },
    { icon: <FaPlane />, label: '휴가 관리', action: navigate.toAdminVacation},
    { icon: <FaDollarSign />, label: '급여 관리' },
  ];

  return (
    <div className="admin-home-page">
      <div className="nav-grid">
        {navItems.map((item, index) => (
          <div 
          key={index} 
          className="nav-card"
          onClick={item.action} 
          style={{ cursor: 'pointer' }}
          >  
            <div className="icon">{item.icon}</div>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHomePage;