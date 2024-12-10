import React, { useState, useEffect } from 'react';
import VacationTypeList from '../../components/Vacation/VacationType/VacationTypeList';
import VacationApprovedList from '../../components/Vacation/VacationStatus/VacationApprovedList';
import VacationChart from '../../components/Vacation/VacationStatus/VacationChart';
import VacationPendingList from '../../components/Vacation/VacationStatus/VacationPendingList';
import './VacationPage.css';
import '../../components/Vacation/VacationStatus/VacationStatus.css';
import { getVacationSummaryAPI } from '../../api/vacation';

const VacationPage = () => {
    const [summaryData, setSummaryData] = useState({
        remaining: 0,
        used: 0,
        pending: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVacationSummary = async () => {
        try {
            setLoading(true);
            const data = await getVacationSummaryAPI();
            setSummaryData({
                remaining: data.remaining,
                used: data.used,
                pending: data.pending
            });
        } catch (err) {
            setError('휴가 현황을 불러오는데 실패했습니다.');
            console.error('Error fetching vacation summary:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacationSummary();
    }, []);

    const handleVacationUpdate = async () => {
        // 휴가 신청 후 데이터 새로고침
        await fetchVacationSummary();
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

  return (
    <div className='vacation-container'>
            <h4 className='vacation-section-title'>휴가 신청</h4>
            <section className="vacation-section">
                <VacationTypeList 
                remainingDays={summaryData.remaining}
                onVacationUpdate={handleVacationUpdate}
                />
            </section>

            <h4 className='vacation-section-title'>휴가 현황</h4>
            <section className="vacation-section vacation-chart-and-pending">
                <VacationChart 
                    summaryData={summaryData}
                />
                <VacationPendingList 
                    onVacationUpdate={fetchVacationSummary}
                />
            </section>

            <section className="vacation-section">
                <VacationApprovedList />
            </section>
        </div>
  );
};

export default VacationPage;