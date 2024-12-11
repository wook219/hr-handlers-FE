// components/vacation/VacationPendingList.js
import React, { useState, useEffect } from 'react';
import VacationTable from './VacationTable';
import VacationDetailModal from '../Modal/VacationDetailModal';
import { getPendingVacationsAPI } from '../../../api/vacation';

const VacationPendingList = ({ onVacationUpdate }) => {
    const [selectedVacation, setSelectedVacation] = useState(null);
    const [pendingVacations, setPendingVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingVacations = async () => {
        try {
            setLoading(true);
            const data = await getPendingVacationsAPI();
            setPendingVacations(data);
        } catch (err) {
            setError('승인 대기 휴가 목록을 불러오는데 실패했습니다.');
            console.error('Error fetching pending vacations:', err);
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => {
        fetchPendingVacations();
    }, []);

    const headers = ['문서 번호', '신청 일자', '제목', '시작 일자', '종료 일자', ' '];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const renderRow = (vacation, index) => {
        return (
            <tr key={index}>
                <td>{vacation.docNum}</td>
                <td>{formatDate(vacation.createdAt)}</td>
                <td>{vacation.title}</td>
                <td>{formatDate(vacation.startDate)}</td>
                <td>{formatDate(vacation.endDate)}</td>
                <td>
                    <button 
                        className="vacation-detail-button"
                        onClick={ () => {setSelectedVacation(vacation.id);} }
                    >
                        상세
                    </button>
                </td>
            </tr>
        );
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h5 className='vacation-section-title'>승인 대기 휴가 목록</h5>
            <VacationTable 
                headers={headers}
                data={pendingVacations}
                rowRenderer={renderRow}
            />

            {selectedVacation && (
                <VacationDetailModal
                    vacationId={selectedVacation}
                    onClose={() => setSelectedVacation(null)}
                    editable={true}
                    onModify={() => {
                        fetchPendingVacations();  
                        onVacationUpdate();       
                    }}
                    onDelete={() => {
                        fetchPendingVacations();  
                        onVacationUpdate();       
                    }}
                />
            )}
        </div>
    );
};

export default VacationPendingList;