import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { getAdminVacationsAPI, approveVacationAPI, rejectVacationAPI } from '../../api/admin/vacation'
import { useToast } from '../../context/ToastContext';

const PendingVacationList = () => {
    const [vacations, setVacations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { showToast } = useToast();

    
    const fetchVacations = async () => {
        try {
            setLoading(true);
            const response = await getAdminVacationsAPI(page);
            setVacations(response.content);  // 직접 Page 객체의 content 접근
            setTotalPages(response.totalPages);  // 직접 Page 객체의 totalPages 접근
        } catch (err) {
            setError('휴가 목록을 불러오는데 실패했습니다.');
            console.error('Error fetching vacations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVacations();
    }, [page]);

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
            // 현재 페이지의 데이터 다시 로드
            const response = await getAdminVacationsAPI(page);
            setVacations(response.content);
            setTotalPages(response.totalPages);
            showToast('휴가를 승인처리 했습니다.', 'success');
        } catch (error) {
            console.error('Error approving vacation:', error);
            showToast('휴가 승인에 실패했습니다.', 'error');
        }
    }

    // 휴가 반려 처리
    const handleReject = async (vacationId) => {
        try {
            await rejectVacationAPI(vacationId);
            // 현재 페이지의 데이터 다시 로드
            const response = await getAdminVacationsAPI(page);
            setVacations(response.content); 
            setTotalPages(response.totalPages);  
            showToast('휴가를 반려처리 했습니다.', 'success');
        } catch (error) {
            console.error('Error rejecting vacation:', error);
            showToast('휴가 승인에 실패했습니다.', 'error');
        }
    };
    
    return (
        <div>
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
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="text-center">로딩중...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="8" className="text-center text-danger">{error}</td>
                        </tr>
                    ) : vacations?.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center">승인 대기중인 휴가가 없습니다.</td>
                        </tr>
                    ) : (
                        vacations?.map((vacation, index) => (
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
                                        size="sm"
                                    >
                                        승인
                                    </button>
                                    <button 
                                        className="admin-reject-button"
                                        onClick={() => handleReject(vacation.id)}
                                        size="sm"
                                    >
                                        반려
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* 페이지네이션 */}
            <div className="pagination-container d-flex justify-content-center">
                <ul className="pagination">
                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(0)} disabled={page === 0}>
                            &laquo;
                        </button>
                    </li>
                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page === 0}>
                            &lt;
                        </button>
                    </li>
                    <li className="page-item active">
                        <button className="page-link">
                            {page + 1}
                        </button>
                    </li>
                    <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(prev => prev + 1)} disabled={page >= totalPages - 1}>
                            &gt;
                        </button>
                    </li>
                    <li className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>
                            &raquo;
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default PendingVacationList;
