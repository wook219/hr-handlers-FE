import React, { useState } from 'react';
import PendingVacationList from '../../../components/Admin/PendingVacationList'
import VacationStatusList from '../../../components/Admin/VacationStatusList';
import './AdminVacationPage.css';

const AdminVacationPage = () => {
    const [activeTab, setActiveTab] = useState('pending');

    return (
        <div className="vacation-management-container">
            <h2 className='vacation-management-title'>사원 휴가 관리</h2>
            
            <div className="admin-section-tabs">
                <button 
                    className={`admin-section-tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    승인 대기 휴가 목록
                </button>
                <button 
                    className={`admin-section-tab ${activeTab === 'status' ? 'active' : ''}`}
                    onClick={() => setActiveTab('status')}
                >
                    휴가 보유 현황
                </button>
            </div>

            {activeTab === 'pending' ? (
                <PendingVacationList />
            ) : (
                <VacationStatusList />
            )}
        </div>
    );
}

export default AdminVacationPage;