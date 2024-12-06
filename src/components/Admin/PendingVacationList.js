import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import { getAdminVacationsAPI, approveVacationAPI, rejectVacationAPI } from '../../api/admin/vacation'

const PendingVacationList = () => {
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                setLoading(true);
                const data = await getAdminVacationsAPI();
                setVacations(data);
            } catch (err) {
                setError('휴가 목록을 불러오는데 실패했습니다.');
                console.error('Error fetching vacations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVacations();
    }, []);

    // 휴가 타입별 표시 텍스트
    const getVacationTypeText = (type) => {
        switch(type) {
            case 'ANNUAL': return '연차';
            case 'HALF': return '반차';
            case 'SICK': return '병가';
            case 'PUBLIC': return '공가';
            default: return type;
        }
    };

    // 상태별 표시 텍스트
    const getStatusText = (status) => {
        switch(status) {
            case 'PENDING': return '승인대기';
            case 'APPROVED': return '승인';
            case 'REJECTED': return '반려';
            default: return status;
        }
    };

    const handleApprove = async (vacationId) => {
        try {
            await approveVacationAPI(vacationId);
            // 목록 갱신
            const data = await getAdminVacationsAPI();
            setVacations(data);
            alert('휴가가 승인되었습니다.');
        } catch (error) {
            console.error('Error approving vacation:', error);
            alert('휴가 승인에 실패했습니다.');
        }
    };

    // 휴가 반려 처리
    const handleReject = async (vacationId) => {
        try {
            await rejectVacationAPI(vacationId);
            // 목록 갱신
            const data = await getAdminVacationsAPI();
            setVacations(data);
            alert('휴가가 반려되었습니다.');
        } catch (error) {
            console.error('Error rejecting vacation:', error);
            alert('휴가 반려에 실패했습니다.');
        }
    };
    
    return (
        <Table className="admin-vacation-table" hover>
                        <thead>
                            <tr>
                                <th>직급</th>
                                <th>부서</th>
                                <th>이름</th>
                                <th>기간</th>
                                <th>항목</th>
                                <th>사용기간</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                        {vacations.map((vacation, index) => (
                                    <tr key={index}>
                                        <td>{vacation.position}</td>
                                        <td>{vacation.deptName}</td>
                                        <td>{vacation.name}</td>
                                        <td>{vacation.period}</td>
                                        <td>{getVacationTypeText(vacation.type)}</td>
                                        <td>{vacation.use}일</td>
                                        <td>{getStatusText(vacation.status)}</td>
                                        <td>
                                            <button 
                                                className="admin-approve-button"
                                                onClick={() => handleApprove(vacation.id)}
                                            >
                                                승인
                                            </button>
                                            <button 
                                                className="admin-reject-button"
                                                onClick={() => handleReject(vacation.id)}
                                            >
                                                반려
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
    );
}

export default PendingVacationList;
