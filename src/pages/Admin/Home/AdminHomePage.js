import React from 'react';
import { useNavigation } from '../../../components/Sidebar/useNavigation';
import { FaHome, FaPlane, FaRegCalendarAlt, FaDollarSign } from 'react-icons/fa';
import "./AdminHomePage.css";

function AdminHomePage() {
  const navigation = useNavigation();
  const navItems = [
    { icon: <FaHome />, label: '유저 관리' },
    { icon: <FaRegCalendarAlt />, label: '일정 관리' },
    { icon: <FaPlane />, label: '휴가 관리' },
    { icon: <FaDollarSign />, label: '급여 관리' },
  ];

  return (
    <div className="admin-home-page">
      <div className="nav-grid">
        {navItems.map((item, index) => (
          <div key={index} className="nav-card">
            <div className="icon">{item.icon}</div>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHomePage;